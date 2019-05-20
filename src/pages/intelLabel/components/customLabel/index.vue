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
            <el-input
                clearable
                class="search"
                placeholder="输入标签名称搜索"
                v-model="search_input"
                @change="inputChange"
                @keyup.enter.native="inputSubmit"
            >
                <i slot="prefix" class="el-input__icon el-icon-search"></i>
            </el-input>
            <el-button icon="el-icon-search" plain @click="inputSubmit" type="primary" style="height:31px;">搜索</el-button>
            <el-button class="common-button" v-if="labelAdd" style="float:right;margin-left:10px;" type="primary" @click="customLabel('new')">新增自定义标签</el-button>
            <el-button class="common-button" v-if="labelCombine" style="float:right;" type="primary" @click="fixedLabel('new')">合并标签</el-button>
        </div>

        <div class="atom-table" v-loading="table_loading">
            <el-table
                ref="customTable"
                :max-height="tableMaxHeight"
                tooltip-effect="dark"
                highlight-current-row
                :data="custom_data"
                @selection-change="customChange"
            >
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop='tagName' label='标签名称' />
                <el-table-column prop='tagDesc' label='标签描述' />
                <el-table-column prop='tagType' label='标签类别' />
                <el-table-column prop='orgName' label='使用范围' />
                <el-table-column prop='objectName' label="业务域" />
                <el-table-column prop="userCn" label="创建人" />
                <el-table-column prop="adAccount" label="域账号" />
                <el-table-column prop="gmtModified"
                    label="修改时间" 
                    width="150"
                />
                <el-table-column prop="tagState" label="启用/禁用" v-if="labelSwitch">
                    <template slot-scope="scope">
                        <el-switch
                            v-model="scope.row.tagState"
                            active-color="#5A8CFF"
                            inactive-color="#dcdfe6"
                            @change="switchChange(scope.row,scope.$index)"
                        >
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="120">
                    <template slot-scope="scope">
                        <div class="action-ct">
                            <span class="boe-btn" @click="customLabel('watch',scope.row)">查看</span>
                            <span class="boe-btn" v-if="labelEdit" @click="customLabel('edit',scope.row,scope.$index)">编辑</span>
                            <span class="boe-btn" v-if="labelDelete" @click="deleteRow(scope.row,scope.$index)">删除</span>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <div class="bt-el-ct" v-if="labelBatch">
                <el-button type="primary" @click="batchSwitch('start',1)">批量启动API</el-button>
                <el-button type="primary" @click="batchSwitch('close',0)">批量禁用API</el-button>
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
                :current-page.sync="currentPage"
                @size-change="pnSizeChange"
                @current-change="pnCurrentChange"
            />
        </div>
        <!-- 新增&编辑dialog框 -->
        <add-label-dialog 
            :actionType="actionType"
            :editData="editData"
            :tagOption="tagOption"
            :selectOption="selectOption" 
            :addFormVisible="addFormVisible" 
            @headCallBack="newAddCall" 
        />
        <!-- 组合标签框 -->
        <fixed-label-dialog 
            :tagOption="tagOption"
            :selectOption="selectOption" 
            :fixedFormVisible="fixedFormVisible" 
            @headCallBack="fixedCall" 
        />
    </div>
</template>
<script>
import api from '@/api/';
import moment from 'moment';
import common from '@/constants/common';
import mixins from '@/constants/mixins';
import { findIndex, isEmpty } from 'lodash';
import addLabelDialog from './addLabelDialog';
import fixedLabelDialog from './fixedLabelDialog';

export default {
    mixins: [mixins],
    components:{
        'add-label-dialog': addLabelDialog,
        'fixed-label-dialog': fixedLabelDialog
    },
    data(){
        return{
            search_input:'',
            table_loading: true,
            addFormVisible: false,
            fixedFormVisible: false,
            sortType: 2,
            tagOption: [],
            pageTotal: 0,
            currentPage: 1,
            pageSize: 10,
            casValue: [],
            custom_data:[],
            selectOption: [],
            checkboxSelected: [],
            actionType: 'new',
            editData: {},
            tagClass1Id: '',//一级类目ID
            tagClass2Id: '',//二级类目ID
            cascaderProps: {
                value: 'tagClass',
                children: 'children',
                label: 'tagClassName'
            },
        }
    },
    mounted(){
        const { currentPage, pageSize, sortType } = this;

        this.getTagTypeTree();//标签类别
        this.getTagObject();//获取业务域数据
        this.tagByCategory('','',1,10,2,'',3);//获取自定义标签列表
    },
    computed: {
        tableMaxHeight(){
            return window.innerHeight - 250
        },
        labelAdd(){
            return common.permCheck('def_label_add');//标签新增
        },
        labelEdit(){
            return common.permCheck('def_label_edit');//标签编辑
        },
        labelDelete(){
            return common.permCheck('def_label_del');//标签删除
        },
        labelBatch(){
            return common.permCheck('def_label_batch');//标签批量操作
        },
        labelCombine(){
            return common.permCheck('def_label_comb');//合并标签
        },
        labelSwitch(){
            return common.permCheck('def_label_switch');//api管理
        }
        
    },
    methods: {
        //获取业务域数据
        getTagObject(){
            api.tagObject({}).then(res => {
                if(res.success){
                    this.selectOption = res.data;
                }else{
                    this.commonAlert(res);
                }

            })
        },
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
        //获取列表&&标签类别进行筛选&&模糊查询tag信息
        tagByCategory(class1Id,class2Id,pageNo,pageSize,sortType,tagName,tagType){
            api.tagCustomByCate({
                class1Id,
                class2Id,
                pageNo,
                pageSize,
                sortType,
                tagName,
                tagType
            }).then(res => {
                if(res.success){
                    this.table_loading=false;
                    res.data.data.forEach(res => {
                        res.tagState = res.tagState==1?true:false;
                        // res.tagType = res.tagType==1?'原子标签':res.tagType==2?'衍生标签':'自定义标签';
                        res.tagType = `${res.tagClass1Name} - ${res.tagClass2Name}`;
                        res.orgName = res.orgName==null?'公有':res.orgName;
                        res.gmtModified = moment(res.gmtModified).format('YYYY-MM-DD HH:mm:ss')
                        
                    })
                    this.custom_data = res.data.data;
                    this.pageTotal = res.data.total;
                }else{
                    this.commonAlert(res)
                    this.table_loading=false;
                }
            })
        },
        //删除标签
        deleteRow(row,index){
            this.$confirm('确认删除该标签, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                api.tagDelete({},row.id).then(res => {
                    if(res.success){
                        const { pageTotal, casValue, currentPage, pageSize, sortType, search_input } = this;
                        
                        this.currentPage = common.checkJumpLastPage(pageTotal,pageSize,currentPage);
                        this.tagByCategory(casValue[0],casValue[1],common.checkJumpLastPage(pageTotal,pageSize,currentPage),pageSize,sortType,search_input,3);//获取自定义标签列表
                    }else{}

                    this.commonAlert(res)
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
        },
        //类目查询cas改变
        casSearchChange(val){
            const { search_input, currentPage, pageSize } = this;

            this.table_loading = true;
            api.tagCustomByCate({
                class1Id: val[0],
                class2Id: val[1],
                pageNo: 1,
                pageSize,
                sortType: 2,
                tagName: search_input,
                tagType: 3
            }).then(res => {
                if(res.success){
                    this.currentPage = 1;
                    this.table_loading=false;
                    res.data.data.forEach(res => {
                        res.tagState = res.tagState==1?true:false;
                        // res.tagType = res.tagType==1?'原子标签':res.tagType==2?'衍生标签':'自定义标签';
                        res.tagType = `${res.tagClass1Name} - ${res.tagClass2Name}`;
                        res.orgName = res.orgName==null?'公有':res.orgName;
                        
                    })
                    this.custom_data = res.data.data;
                    this.pageTotal = res.data.total;
                }else{
                    this.commonAlert(res)
                    this.table_loading=false;
                }
            })
        },
        //新增标签
        addNewTagAction(){
            api.tagCustomAdd({
                objectId,//业务域id
                tagClass1Id,//一级类目ID
                tagClass2Id,//二级类目ID
                tagDesc,//标签描述
                tagName,//标签名称
                tagType,//标签类型
                useRange,//使用范围
            }).then(res => {
                if(res.success){

                }else{}

                this.commonAlert(res)
            })
        },
        //新增弹窗子组件反馈
        newAddCall(msg){
            const { casValue, currentPage, pageSize, sortType } = this;
            
            if(msg == 'action'){
                this.currentPage = 1;
                this.pageSize = 10;
                this.sortType = 2;
                this.search_input = '';
                this.casValue = [];//新增后清空原有的类别查询条件
                this.addFormVisible = false;
                this.tagByCategory('','',1,10,2,'',3);//获取自定义标签列表
            }else{
                this.addFormVisible = false;
            }
            
        },
        //组合标签子组件反馈
        fixedCall(msg){
            if(msg == 'action'){
                this.currentPage = 1;
                this.sortType = 2;
                this.pageSize = 10;
                this.search_input = '';
                this.casValue = [];//新增后清空原有的类别查询条件
                this.fixedFormVisible = false;
                this.tagByCategory('','',1,10,2,'',3);//获取自定义标签列表
            }else{
                this.fixedFormVisible = false;
            }
        },
        //input输入框change事件
        inputChange(value){
            this.search_input = value;
        },
        //input输入框enter事件
        inputSubmit(e){
            const { casValue, currentPage, pageSize, sortType, search_input } = this;

            this.currentPage = 1;
            this.pageSize = 10;
            this.table_loading = true;
            // this.search_input = e.target.value;

            this.tagByCategory(casValue[0],casValue[1],1,10,sortType,search_input,3);//获取自定义标签列表

        },
        //checkbox选择
        customChange(val){
            this.checkboxSelected = val;
        },
        //分页器size大小
        pnSizeChange(val){
            const { casValue, currentPage, pageSize, sortType, search_input } = this;

            this.pageSize = val;
            this.currentPage = 1;
            this.table_loading = true;
            this.tagByCategory(casValue[0],casValue[1],1,val,sortType,search_input,3);//获取自定义标签列表
        },
        //分页器页码改变
        pnCurrentChange(val){
            const { casValue, currentPage, pageSize, sortType, search_input } = this;

            this.currentPage = val;
            this.table_loading = true;
            this.tagByCategory(casValue[0],casValue[1],val,pageSize,sortType,search_input,3);//获取自定义标签列表
        },
        //开关改变
        switchChange(val){
            api.tagStatuSingle({
                tagId: val.id,
                status: val.tagState?1:0,
            }).then(res => {
                this.commonAlert(res);
            })
        },
        //批量开启开关&&批量关闭开关
        batchSwitch(type,status){
            const tagIds = this.checkboxSelected.map(res => {
                return res.id
            })//批量开始的id

            if(isEmpty(tagIds)){
                this.$message.error('请选择标签')
            }else{
                api.tagStatubatch({
                    tagIds,
                    status: status,
                }).then(res => {
                    if(res.success){
                        this.checkboxSelected.forEach(res => {
                            this.$refs.customTable.data[findIndex(this.custom_data,['id',res.id])].tagState = type=='start'?true:false;
                        })
                    }else{}
                    this.commonAlert(res);
                })
            }

        },
        //新增&编辑自定义标签
        customLabel(type,row,index){
            this.addFormVisible = true;
            this.actionType = type;//状态
            
            if(type == 'new'){
                //新增原子标签
            }else{
                //编辑&查看原子标签
                this.editData = Object.assign({}, this.editData, {
                    id: row.id,tagName: row.tagName, orgName: row.orgName=='公有'?'公有':'私有',
                    objectId: row.objectId,tagDesc: row.tagDesc,tagClass1Id: row.tagClass1Id,
                    tagClass2Id: row.tagClass2Id,
                })
            }
        },
        //新增组合标签
        fixedLabel(type){
            this.fixedFormVisible = true;
            if(type == 'new'){
                //新增原子标签
            }else{
                //编辑原子标签
            }
        }
    }
}
</script>
<style lang="scss" scoped>
    .vk-atom-ct{
        background: #FFF;
        .top-floor{
            padding: 10px 25px;
            .casca,.search{
                width: 200px;
            }
        }
        .atom-table{
            border: 1px solid #E8E8E8;
            margin: 0 25px;
            .action-ct{
                .boe-btn{
                    margin: 0 7px 0 0;
                }
            }
            .bt-el-ct{
                .el-button{
                    background: #5A8CFF;
                    margin: 5px 20px;
                }
            }
        }
        .vk-tr-dialog{
            .el-form-item__content{
                width: 60%;
                .el-cascader,.el-select{
                    width: 100%;
                }
            }
        }
        .t-page{
            text-align: right;
            padding: 20px 20px 10px 0;
            .el-pagination.is-background .el-pager li:not(.disabled).active{
                background: rgb(90, 140, 255);
            }
        }
    }
</style>
