<template>
    <div class="vk-atom-ct">
        <div class="top-floor">
             <el-cascader
                class="casca"
                filterable
                clearable
                change-on-select
                :options="tagOption"
                :props="cascaderProps"
                v-model="casValue"
                placeholder="请选择标签类别进行查询"
                @change="casSearchChange"
            />
            <el-input class="search" row-key="key" clearable placeholder="输入标签名称搜索" v-model="search_input" @change="inputChange" @keyup.enter.native="inputSubmit">
                <i slot="prefix" class="el-input__icon el-icon-search"></i>
            </el-input>
            <el-button icon="el-icon-search" plain @click="inputSubmit" type="primary" style="height:31px;">搜索</el-button>
            <el-button class="common-button" v-if="labelAdd" style="float:right;" type="primary" @click="showAddDialog('new')">新增衍生标签</el-button>
        </div>

        <div class="atom-table">
            <el-table :max-height="tableMaxHeight" ref="atomTable" tooltip-effect="dark" highlight-current-row :data="atom_data" @selection-change="atomChange" @sort-change="tableSortChange" v-loading="table_loading">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop='tagName' label='标签名称' />
                <el-table-column prop='tagDesc' label='标签描述'/>
                <el-table-column prop='tagType' label='标签类别' :formatter="formatterTagClass"/>
                <el-table-column prop='objectName' label='业务域' />
                <el-table-column prop='userCn' label="创建人" />
                <el-table-column prop='gmtModified' :formatter="formatterDate" label="修改时间"  width="150"/>
                <el-table-column prop='adAccount' label="域账号" />
                <el-table-column prop="tagState" label="启用/禁用" v-if="labelSwitch">
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.tagState" active-color="#5A8CFF" inactive-color="#dcdfe6" @change="switchChange(scope.row,scope.$index)">
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column fixed="right" width='120' label="操作">
                    <template slot-scope="scope">
                        <div class="action-ct">
                            <span class="boe-btn" @click="showAddDialog('watch',scope.row,scope.$index)">查看</span>
                            <span class="boe-btn" v-if="labelEdit" @click="showAddDialog('edit',scope.row,scope.$index)">编辑</span>
                            <span class="boe-btn" v-if="labelDelete" @click="removeItem(scope.row,scope.$index)">删除</span>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <div class="bt-el-ct" v-if="labelBatch">
                <el-button type="primary" @click="batchChangeSwitch(true)">批量启动API</el-button>
                <el-button type="primary" @click="batchChangeSwitch(false)">批量禁用API</el-button>
            </div>
        </div>
        <div class="t-page">
            <el-pagination 
                v-if="pageTotal!=0"
                background 
                :page-sizes="[10, 20, 30, 40]" 
                layout="total, prev, pager, next, sizes, jumper" 
                :total="pageTotal" 
                :page-size="pageSize" 
                :current-page.sync="pageNo" 
                @size-change="pnSizeChange"
                @current-change="pnCurrentChange">
            </el-pagination>
        </div>

        <!-- 新增与编辑 -->
        <add-dialog ref="addDialog" :sortSearch="sortSearch" :currentType="currentType"></add-dialog>
    </div>
</template>
<script>
    import api from '@/api/';
    import AddDialog from './add.vue'
    import common from '@/constants/common';
    import mixins from '@/constants/mixins';
    import { findIndex, isNull, isEmpty, dropRightWhile, dropWhile } from 'lodash';


    export default {
        mixins: [mixins],
        components: { "add-dialog": AddDialog },
        data() {
            return {
                table_loading: true,
                currentType: '',
                search_input: '',
                switch_value: '',
                checkboxSelected: [],
                pageTotal: 0,
                pageNo: 0,
                pageSize: 10,
                atom_data: [],
                tagClass1Id: '',//一级类目ID
                tagClass2Id: '',//二级类目ID
                orderType:'',
                tagOption: [],
                casValue: [],//类目查询值
                cascaderProps: {
                    value: 'tagClass',
                    children: 'children',
                    label: 'tagClassName'
                }
            }
        },
        mounted() {
            this.getTagTypeTree();//标签类别
            this.sortSearch();
        },
        computed: {
            tableMaxHeight(){
                return window.innerHeight - 250
            },
            labelEdit(){
                return common.permCheck('extend_label_edit');//标签编辑
            },
            labelAdd(){
                return common.permCheck('extend_label_add');//标签新增
            },
            labelBatch(){
                return common.permCheck('extend_label_batch');//标签批量操作
            },
            labelSwitch(){
                return common.permCheck('extend_label_switch');//标签api操作
            },
            labelDelete(){
                return common.permCheck('extend_label_del');//标签删除
            }
        },
        methods: {
            //获取类目树
            getTagTypeTree(){
                api.tagTypeTree({}).then(res => {
                    if(res.success){
                        let checkArr = res.data.filter(item => item.children!=null)
                       
                        this.tagOption = checkArr;
                    }else{
                        this.commonAlert(res);
                    }
                })
            },
            //类目查询cas改变
            casSearchChange(val){
                this.pageNo = 1;
                this.sortSearch();
            },
            //清空form验证状态和数据
            clearForm() {
                this.selectForm = Object.assign({}, this.selectForm, {
                    tagName: '',//标签名称
                    tagType: [],//标签类型
                    objectId: '',//业务域id
                    tagDesc: '',//标签描述
                })
                this.$refs.selectForm.clearValidate();
            },
            //input输入框change事件
            inputChange(value) {
                this.search_input = value;
            },
            //input输入框enter事件
            inputSubmit(e) {
                const { search_input, pageNo, pageSize } = this;
                // this.search_input = e.target.value;
                this.pageNo = 1;
                this.sortSearch()
            },
            formatterDate(row,column){
                return row.gmtModified.substr(0,row.gmtModified.length-2)
            },
            //select 选择框
            selectChange(val) {
                this.selectForm.objectId = val;
            },
            //选择table checkbox
            atomChange(val) {
                this.checkboxSelected = val;
            },
            //开关改变
            switchChange(rowData) {
                let reqUrl = "?tagIds=" + rowData.id + "&" + "status=" + (rowData.tagState ? "1" : "0")
                api.derivativeStatus({}, reqUrl).then((res) => {
                    this.commonAlert(res)
                })
            },
            //批量开启开关
            batchChangeSwitch(b) {
                let tagIds = [];
                this.checkboxSelected.forEach(res => {
                    const idx = this.atom_data.indexOf(res)
                    this.atom_data[idx].tagState = b;
                    tagIds.push(res.id)
                })

                if (tagIds.length > 0) {
                    let str = "?"
                    tagIds.forEach((tag) => {
                        str += "tagIds=" + tag + "&"
                    })
                    let reqUrl = str + "status=" + (b ? "1" : "0")

                    api.derivativeStatus({}, reqUrl).then((res) => {
                        this.commonAlert(res)
                    })
                }

            },

            //分页器size大小
            pnSizeChange(val) {
                this.pageSize = val;
                this.sortSearch();
            },
            //分页器页码改变
            pnCurrentChange(val, row) {
                this.pageNo = val;
                this.sortSearch();
            },
            
            //新增打开弹窗
            showAddDialog(type, row) {
                this.currentType = type;
                this.$refs.addDialog.show(type, row)
            },
            //取消按钮关闭弹窗
            closeDialog() {
                this.clearForm();
            },
            removeItem(rowData) {
                this.$confirm('确认删除此标签？')
                    .then(_ => {
                        api.derivativeDel(null, rowData.id).then(res => {
                            this.commonAlert(res)
                            // 成功删除之后，查询表格，如果表格没值，就回退到第一页
                            this.sortSearch(this.pageNo,()=>{
                                if(this.atom_data.length <= 0 && this.pageNo !=1){
                                    this.pageNo = 1
                                    this.sortSearch()
                                }
                            })
                        })
                    })
                    .catch(_ => {
                        
                    });
            },

            //表格sort变化
            tableSortChange(column, prop, order){
                this.orderType = column.order
                this.sortSearch()                
            },

            formatterTagClass(row, column){
                return row.tagClass1Name + '-' + row.tagClass2Name
            },
            sortSearch(pageNo,cb){
                this.table_loading=true;
                this.pageNo = pageNo || this.pageNo
                return api.derivativeQuery({
                    class1Id: this.casValue[0] || "",
                    class2Id: this.casValue[1] || "",
                    pageNo: this.pageNo || 1 ,
                    pageSize:this.pageSize||10,
                    sortType:2,
                    tagName:this.search_input,
                    tagType:2
                }).then(res => {
                    if(res.success){
                        this.table_loading=false;
                        res.data.data.forEach(res => {
                            res.tagState = res.tagState==1?true:false;
                            res.tagType = `${res.tagClass1Name} - ${res.tagClass2Name}`
                        })
                        this.atom_data = res.data.data;
                        this.pageTotal = res.data.total;
                        if(cb) cb()
                        
                    }else{
                        this.commonAlert(res)
                    }
                    this.table_loading=false
                })
            }

        }
    }
</script>
<style lang="scss">
    .el-cascader-menu{
        min-width: 200px;
    }
    .common-button{
        background:#5A8CFF;
    }
    .vk-atom-ct {
        background: #fff;
        .top-floor {
            padding: 20px 28px;
            .casca,.search{
                width: 200px;
            }
        }
        .atom-table {
            border: 1px solid #e8e8e8;
            margin: 0 28px;
            .action-ct{
                .boe-btn{
                    margin: 0 7px 0 0;
                }
            }
            .bt-el-ct {
                .el-button {
                    background: #5a8cff;
                    margin: 5px 20px;
                }
            }
        }
        .vk-tr-dialog {
            .el-form-item__content {
            width: 60%;
            .el-cascader,
            .el-select {
                width: 100%;
            }
            }
        }
        .t-page{
            text-align: right;
            padding: 20px 20px 0px 0;
            .el-pagination.is-background .el-pager li:not(.disabled).active{
                background: rgb(90, 140, 255);
            }
        }
    }
</style>
