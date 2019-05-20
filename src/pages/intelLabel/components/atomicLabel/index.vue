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
            >
            </el-cascader>
            <el-input
                class="search"
                row-key="key"
                clearable
                placeholder="输入中/英标签名搜索"
                v-model="search_input"
                @change="inputChange"
                @keyup.enter.native="inputSubmit"
            >
                <i slot="prefix" class="el-input__icon el-icon-search"></i>
            </el-input>
            <el-button icon="el-icon-search" plain @click="inputSubmit" type="primary" style="height:31px;">搜索</el-button>
            <el-button class="common-button" style="float:right;" v-if="labelAdd" type="primary" @click="atomLabelAction('new')">新增原子标签</el-button>
        </div>

        <div class="atom-table" v-loading="table_loading">
            <el-table
                ref="atomTable"
                :max-height="tableMaxHeight"
                tooltip-effect="dark"
                highlight-current-row
                :data="atom_data"
                @selection-change="atomChange"
            >
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop='tagName' label='标签名称' />
                <el-table-column prop='tagEnName' label='标签Code' />
                <el-table-column prop='tagType' label='标签类别' />
                <el-table-column prop='tagDesc' label='标签描述' />
                <el-table-column prop='objectName' label="业务域" />
                <el-table-column prop="calculateState" label="是否计算">
                    <template slot-scope="scope">
                        <div class="caculate-ct">
                            <div class="is-caculate" :style="{ backgroundColor: scope.row.calculateState=='计算'?'#36CBCB':'#C5C5C5'}"></div>
                            <span>{{scope.row.calculateState}}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="tagState" label="启用/禁用" v-if="labelSwitch">
                    <template slot-scope="scope">
                        <el-switch
                            v-model="scope.row.tagState"
                            active-color="#5A8CFF"
                            inactive-color="#dcdfe6"
                            @change="switchChange(scope.row,scope.$index)"
                        />
                    </template>
                </el-table-column>
                <el-table-column width='120' fixed="right" label="操作">
                    <template slot-scope="scope">
                        <div class="action-ct">
                            <span class="boe-btn" @click="atomLabelAction('watch',scope.row)">查看</span>
                            <span class="boe-btn" v-if="labelEdit" @click="atomLabelAction('edit',scope.row,scope.$index)">编辑</span>
                            <span class="boe-btn" v-if="labelDelete" @click="deleteAtomLabel(scope.row,scope.$index)">删除</span>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <div class="bt-el-ct" v-if="labelBatch">
                <el-button type="primary" @click="batchSwitch('start',1)">批量启动API</el-button>
                <el-button type="primary" @click="batchSwitch('close',0)">批量禁用API</el-button>
            </div>
        </div>
        <div class="t-page-atom">
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
            >
            </el-pagination>
        </div>
        <el-dialog 
            width="40%"
            :title="editType=='watch'?'查看原子标签':'编辑原子标签'" 
            :visible.sync="dialogFormVisible" 
            class="vk-tr-dialog"
            @close="closeDialog"
        >
            <el-form 
                :rules="rules" 
                :model="selectForm" 
                :name="selectForm" 
                ref="selectForm" 
                label-width="100px"
                v-loading="diaLoding" 
                element-loading-text="拼命加载中"
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(255, 255, 255, 0.8)"
            >
                <el-form-item label="标签名称：" prop="tagName" :label-width="formLabelWidth">
                    <el-input v-model="selectForm.tagName" :disabled="input_disable.objO"  placeholder="请输入标签名称"></el-input>
                </el-form-item> 
                <el-form-item label="标签类别：" prop="tagType" :label-width="formLabelWidth">
                    <el-cascader
                        :disabled="input_disable.objTh"
                        expand-trigger="hover"
                        :options="tagOption"
                        :props="cascaderProps"
                        v-model="selectForm.tagType"
                        placeholder="请选择标签类别"
                        @change="casChange"
                        :class="{'tag-type':editType=='watch'?true:false}"
                    >
                    </el-cascader>
                </el-form-item>
                <el-form-item label="标签描述：" prop="tagDesc" :label-width="formLabelWidth">
                    <el-input type="textarea" v-model="selectForm.tagDesc" :disabled="input_disable.objFi" autocomplete="off" placeholder="请输入标签描述，不超过30字"></el-input>
                </el-form-item>
                <el-form-item label="计算：" prop="calc" :label-width="formLabelWidth">
                    <el-switch
                        v-model="selectForm.calc"
                        :disabled="input_disable.objS"
                        active-color="#5A8CFF"
                        inactive-color="#dcdfe6"
                        @change="calcChange"
                    />
                </el-form-item>
                <el-form-item label="标签code：" prop="tagEnName" :label-width="formLabelWidth">
                    <span>{{selectForm.tagEnName}}</span>
                </el-form-item>
                <el-form-item label="绑定表：" prop="" :label-width="formLabelWidth">
                    <span>{{selectForm.sourceTable}}</span>
                </el-form-item>
                <el-form-item label="绑定字段：" prop="" :label-width="formLabelWidth">
                    <span>{{selectForm.sourceTableColumn}}</span>
                </el-form-item>
                <el-form-item label="字典值：" prop="" :label-width="formLabelWidth">
                    <span>{{selectForm.dictName}}</span>
                </el-form-item>
            </el-form>
            <div 
                slot="footer" 
                v-if="!input_disable.buttonType"
                class="dialog-footer"
            >
                <el-button @click="closeDialog">取 消</el-button>
                <el-button class="common-button" v-if="editType=='new'" :loading="addButtonLoad" type="primary" @click="setOk('new')">添 加</el-button>
                <el-button class="common-button" v-else type="primary" :loading="saveButtonLoad" @click="setOk('edit')">保 存</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import api from '@/api/';
import common from '@/constants/common';
import mixins from '@/constants/mixins';
import { findIndex, isNull, isEmpty, dropRightWhile, dropWhile } from 'lodash';


export default {
    mixins: [mixins],
    data(){
        return{
            editType: 'edit',
            diaLoding: false,
            addButtonLoad: false,
            saveButtonLoad: false,
            table_loading: true,
            changeId: '',
            switch_value: '',
            search_input:'',
            editData: {},
            casValue: [],//类目查询值
            checkboxSelected: [],
            input_disable: {
                objO: false,
                objT: false,
                objTh: false,
                objFi: false,
                objS: false,
                buttonType: false
            },
            pageTotal: 0,
            currentPage: 1,
            pageSize: 10,
            cascaderProps: {
                value: 'tagClass',
                children: 'children',
                label: 'tagClassName'
            },
            atom_data:[],
            tagOption: [],
            formLabelWidth: '140px',
            dialogFormVisible: false,
            selectForm: {
                tagName: '',//标签名称
                tagEnName: '',//标签code
                tagType: [],//标签类型
                tagDesc: '',//标签描述
                calc: false,//计算值
                sourceTable: '',//绑定表
                sourceTableColumn: '',//绑定字段
                dictName: ''//字典值
            },
            tagClass1Id: '',//一级类目ID
            tagClass2Id: '',//二级类目ID
            rules: {
                tagName: [
                    { required: true, validator: this.nameValidate, trigger: 'blur' },
                ],
                tagType: [
                    { required: true, message: '请选择标签类别', trigger: 'blur' }
                ],
                tagDesc: [
                    { required: false, validator: this.descValidate }
                ]
            }
        }
    },
    mounted(){
        const { currentPage, pageSize } = this;

        this.getTagTypeTree();//标签类别
        this.tagByCategory('','',1,10,2,'',1);
    }, 
    computed: {
        tableMaxHeight(){
            return window.innerHeight - 250
        },
        labelDelete(){
            return common.permCheck('origin_label_del');//标签删除
        },
        labelEdit(){
            return common.permCheck('origin_label_edit');//标签编辑
        },
        labelAdd(){
            return common.permCheck('origin_label_add');//标签新增
        },
        labelBatch(){
            return common.permCheck('origin_label_batch');//标签批量处理
        },
        labelSwitch(){
            return common.permCheck('api_switch');//api管理
        }
        
    },
    methods: {
        //获取列表&&标签类别进行筛选&&模糊查询tag信息
        tagByCategory(class1Id,class2Id,pageNo,pageSize,sortType,tagName,tagType){
            api.queryTagByCategory({
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
                        res.tagType = `${res.tagClass1Name} - ${res.tagClass2Name}`
                        res.calculateState = res.calculateState==1?'计算':'未计算';
                    })
                    this.atom_data = res.data.data;
                    this.pageTotal = res.data.total;
                }else{
                    this.commonAlert(res)
                    this.table_loading=false;
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
         /* 获取原子标签详情(已经绑定) */
        getAtomTagWatch(id){
            this.diaLoding = true;
            api.atomTagWatch({},id).then(res => {
                if(res.success){
                    console.log(res)
                    const { tagCode,calc,sourceTable,sourceTableColumn,tagDesc,dictName } = res.data;

                    this.selectForm = Object.assign({}, this.selectForm, {
                        calc,
                        tagDesc,
                        dictName,
                        sourceTable,
                        sourceTableColumn,
                        tagEnName: tagCode,
                    })
                }else{
                    this.commonAlert(res);
                }
                this.diaLoding = false;
            })
        },
        //更新标签
        tagUpdateAction(calc,id,tagClass1Id,tagClass2Id,tagDesc,tagName){
            api.atomUpdateNew({
                calc,
                id,
                tagClass1Id,
                tagClass2Id,
                tagDesc,
                tagName
            }).then(res => {
                if(res.success){
                    const { currentPage, pageSize } = this;

                    this.clearForm();
                    this.currentPage = 1;
                    this.dialogFormVisible = false;
                    this.tagByCategory('','',1,pageSize,2,'',1);//获取原子标签列表
                }else{}
                this.commonAlert(res);
                this.saveButtonLoad = false;//关闭保存按钮loading
            })
        },
        //类目查询cas改变
        casSearchChange(val){
            const { search_input, currentPage, pageSize } = this;

            this.table_loading = true;
            this.currentPage = 1;//重置pn=1
            if(val.length == 0){
                this.tagByCategory('','',1,pageSize,2,search_input,1);//获取原子标签列表
            }else{
                this.tagByCategory(val[0],val[1],1,pageSize,2,search_input,1);//获取原子标签列表
            }
        },
        //清空form验证状态和数据
        clearForm(){
            this.input_disable = Object.assign({}, this.input_disable, {
                objO: false,objT: false,objTh: false,objFi: false,objS: false,buttonType: false
            })
            this.selectForm = Object.assign({}, this.selectForm, {
                tagName: '',//标签名称
                tagEnName: '',//标签英文名称
                tagType: [],//标签类型
                tagDesc: '',//标签描述
            })
            this.$refs.selectForm.clearValidate();
            this.$refs.selectForm.resetFields();
        },
        //input输入框change事件
        inputChange(value){
            this.search_input = value;
        },
        //input输入框enter事件
        inputSubmit(e){
            const { casValue, search_input, currentPage, pageSize } = this;
            
            this.currentPage = 1;
            this.tagByCategory(casValue[0],casValue[1],1,pageSize,2,search_input,1);

        },
        calcChange(val){
            this.selectForm.calc = val;
        },
        //选择table checkbox
        atomChange(val){
            this.checkboxSelected = val;
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
        //批量开启开关
        batchSwitch(type, status){
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
                            this.$refs.atomTable.data[findIndex(this.atom_data,['id',res.id])].tagState = type=='start'?true:false;
                        })
                    }else{}
                    this.commonAlert(res);
                })
            }
        },
        //分页器size大小
        pnSizeChange(val){
            const { casValue, currentPage, search_input } = this;

            this.table_loading = true;
            this.pageSize = val;
            this.currentPage = 1;
            this.tagByCategory(casValue[0],casValue[1],1,val,2,search_input,1);
        },
        //分页器页码改变
        pnCurrentChange(val){
            const { casValue, pageSize, search_input } = this;

            this.table_loading = true;
            this.currentPage = val;
            this.tagByCategory(casValue[0],casValue[1],val,pageSize,2,search_input,1)
        },
        //新增打开弹窗
        atomLabelAction(type,row){
            this.editData = row;//数据

            if(type == 'new'){
                //新增标签打开弹窗
                // this.editType = type;//当前修改类型
                this.$router.push({name: 'atom-label-add'});
            }else if(type == 'edit'){
                //编辑标签打开弹窗
                this.dialogFormVisible = true;
                this.editType = type;//当前修改类型
                this.changeId = row.id;//当前修改id
                this.getAtomTagWatch(row.id);//获取标签详情
                this.selectForm = Object.assign({}, this.selectForm, {
                    tagName: row.tagName,//标签名称
                    tagType: [row.tagClass1Id,row.tagClass2Id],//标签类型
                    tagDesc: row.tagDesc,//标签描述
                })
                if(row.arg2==null){this.input_disable.objS = true;}
            }else if(type == 'watch'){
                this.editType = type;//当前修改类型
                this.dialogFormVisible = true;
                this.getAtomTagWatch(row.id);//获取标签详情
                this.selectForm = Object.assign({}, this.selectForm, {
                    tagName: row.tagName,//标签名称
                    tagType: [row.tagClass1Id,row.tagClass2Id],//标签类型
                    tagDesc: row.tagDesc,//标签描述
                })
                this.input_disable = Object.assign({}, this.input_disable, {
                    objO: true,objT: true,objTh: true,objFi: true,objS: true,buttonType: true
                })
            }
        },
        //删除原子标签
        deleteAtomLabel(row,index){
            if(row.calculateState == '计算'){
                this.$message({
                    type: 'error',
                    message: '已计算的原子标签不可被删除'
                })
            }else{
                this.$confirm('确认删除该标签, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    api.tagDelete({},row.id).then(res => {
                        if(res.success){
                            const { pageTotal, casValue, currentPage, pageSize, sortType, search_input } = this;

                            this.currentPage = common.checkJumpLastPage(pageTotal,pageSize,currentPage);
                            this.tagByCategory('','',common.checkJumpLastPage(pageTotal,pageSize,currentPage),10,2,'',1);//获取自定义标签列表
                        }else{}

                        this.commonAlert(res)
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });          
                });
            }
        },
        //联级选择改变
        casChange(value,index){
            console.log('当前选择',value)
        },
        //取消按钮关闭弹窗
        closeDialog(){
            this.clearForm();
            this.dialogFormVisible = false;
        },
        //原子标签名称验证
        nameValidate(rule, value, callback){
            let reg = /^[\u4E00-\u9FA5A-Za-z0-9~!@#$%^&*()_+{}|:"<>?/～！@#¥%……&*（）——+—「」|：“《》？\x22]+$/;

            api.judgeTagName({
                tagName: value,
                tagType: 1,
                id: this.editType=='new'?'':this.editData.id
            }).then(res => {
                if(res.data){
                    callback(new Error('标签名称不可重名'));
                }else{
                    if(!reg.test(value)){
                        callback(new Error('名称由中文、英文、数字或常用符号组成'));
                    }else if(value.length == 0){
                        callback(new Error('请输入标签名称'));
                    }else if(value.length > 10){
                        callback(new Error('标签中文名称不超过10字'));
                    }else{
                        callback();
                    }      
                }
            })
        },
        //原子标签英文名称
        enNameValidate(rule, value, callback){
            let reg = /^[a-z_]+$/;
            let reg2 = /[a-z]+/;

            if(!reg.test(value)){
                callback(new Error('只支持小写英文字母或下划线'))
            }else if(value.length == 0){
                callback(new Error('请输入标签英文名称'));
            }else if(value.length > 16){
                callback(new Error('标签英文名称不超过16位'));
            }else if(!reg2.test(value)){
                callback(new Error('必须含有至少一位小写英文'));
            }else{
                callback();
            }
        },
        //标签描述验证
        descValidate(rule, value, callback){
            if(isNull(value)){
                callback()
            }else if (value.length > 30) { 
                callback('描述信息不超过30字')
            } else {
                callback()
            }
        },
        //新增或编辑方法
        setOk(type){
            this.editType = type;
            this.$refs['selectForm'].validate((valid) => {
                const { tagName, tagType, tagDesc, calc } = this.selectForm;

                if (valid) {
                    this.saveButtonLoad = true;//开启保存按钮loading
                    
                    this.tagUpdateAction(calc,this.changeId,tagType[0],tagType[1],tagDesc,tagName);
                    //编辑原子标签
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        }

    }
}
</script>
<style lang="scss">
    .common-button{
        background:#5A8CFF;
    }
    .vk-atom-ct{
        height: 100%;
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
            .caculate-ct{
                display: flex;
                align-items: center;
                .is-caculate{
                    width: 8px;
                    height: 8px;
                    border-radius: 8px;
                    margin-right: 8px;
                }
            }
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
        .t-page-atom{
            text-align: right;
            padding: 20px 20px 20px 0;
            .el-pagination.is-background .el-pager li:not(.disabled).active{
                background: rgb(90, 140, 255);
            }
        }
    }
    .tag-type{
        .el-cascader__label{
            span{
                color:#e5dcdc !important;
            }
        }
    }
</style>
