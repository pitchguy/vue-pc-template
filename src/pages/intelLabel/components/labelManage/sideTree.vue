<template>
    <el-aside width="30%;">
        <div v-if="labelAdd">
            <el-button v-if="mountedPageShow" type="primary" @click="addNewLabelType('new')">新增类目</el-button>
        </div>
        <el-tree
            ref="sideTree"
            class="lb-mn-table"
            :highlight-current="true"
            icon-class="el-icon-circle-plus"
            :props="treeProps"
            :data="tree_data"
            node-key="tagClass"
            :current-node-key="defaultSelectKey"
            :default-expanded-keys="defaultKey"
            :expand-on-click-node="false"
            @node-click="treeNodeClick"	
        >
            <span class="custom-tree-node" slot-scope="{ node, data }">
                <span>{{ node.label }}</span>
                <div class="action">
                    <span>
                        <i v-if="labelAdd" class="el-icon-circle-plus-outline icon-ct" @click.stop="() => addNewLabelType('new',node,data)"></i>
                    </span>
                    <span>
                        <i v-if="labelDelete" class="el-icon-remove-outline icon-ct" @click.stop="deleteRow(node,data)"></i>
                    </span>
                    <span>
                        <i v-if="labelEdit" class="el-icon-edit icon-ct" @click.stop="() => addNewLabelType('edit',node,data)"></i>
                    </span>
                </div>
            </span>
        </el-tree>
        <!-- dialog弹窗 -->
        <el-dialog 
            width="30%"
            :title="currentType=='new'?'新增类别':'编辑类目'" 
            :visible.sync="labelMnVisible" 
            class="vk-tr-dialog"
            @close="closeDialog"
        >
            <el-form :model="typeForm" :name="typeForm" ref="typeForm" :rules="rules" label-width="100px">
                <el-form-item label="级别：" prop="level">
                    <el-radio-group 
                        v-model="typeForm.level"
                        @change="radioChange"
                    >
                        <el-radio :disabled="radioDisable" label="typeOne">一级类别</el-radio>
                        <el-radio :disabled="radioTdisable" label="typeTwo">二级类目</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="类别名称：" prop="tagClassName">
                    <el-input v-model="typeForm.tagClassName"  placeholder="请输入类别名称"></el-input>
                </el-form-item>
                <el-form-item label="类别编码：" prop="tagCode">
                    <el-input :disabled="codeDisable" v-model="typeForm.tagCode"  placeholder="请输入类别编码"></el-input>
                </el-form-item>
                <el-form-item v-if="typeForm.level=='typeTwo'" label="选择类别：" prop="tagClass">
                    <el-select v-model="typeForm.tagClass" :disabled="selectDisable" placeholder="请选择类别" @change="selectChange">
                        <el-option
                            v-for="item in select_data"
                            :key="item.tagClass"
                            :label="item.tagClassName"
                            :value="item.tagClass"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="closeDialog">取 消</el-button>
                <el-button v-if="currentType=='new'" type="primary" :loading="saveLoading" @click="setOk('new')">确 定</el-button>
                <el-button v-else type="primary" :loading="saveLoading" @click="setOk('edit')">保 存</el-button>
            </div>
        </el-dialog>
    </el-aside>
</template>

<script>
import api from '@/api/';
import { mapState } from 'vuex';
import common from '@/constants/common';
import { findIndex, indexOf, isUndefined, isEmpty } from 'lodash';

export default {
    data(){
        return{
            mountedPageShow: false,
            currentType: 'new',
            selectDisable: false,
            radioDisable: false,
            radioTdisable: false,
            codeDisable: false,
            saveLoading: false,
            tree_data: [],
            defaultSelectKey: '',
            currentTagId: '',
            defaultKey: [],
            select_data: [],//dialog下拉框数据
            select_data_arr: [],//外层树code组合
            labelMnVisible: false,
            treeProps: {
                label: 'tagClassName',
                value: 'tagClass',
                children: 'children',
            },
            typeForm: {
                level: 'typeOne',//级别
                tagClassName: '',//类别名称
                tagCode: '',//类目编码
                tagClass: '',//选择类别
            },
            rules: {
                level: [
                    { required: true, message: '请选择类目级别', trigger: 'change' },
                ],
                tagClassName: [
                    { required: true, min: 0, max: 10, message: '请输入类目名称(最多10字)', trigger: 'blur' }
                ],
                tagCode: [
                    { required: true, validator: this.codeValidate, trigger: 'blur' }
                ],
                tagClass: [
                    { required: true, message: '请选择类目类别', trigger: 'change' }
                ]
            },
        }
    },
    mounted(){
        this.getTagManageTree('','refresh','mounted');
    },
    watch: {
        labelValue(newVal){
            this.getTagManageTree(newVal,'refresh');
        }
    },
    computed: {
        labelValue(){
            return this.$store.state.home.labelValue
        },
        treeListLen(){
            return this.$store.state.home.treeListLen
        },
        labelDelete(){
            return common.permCheck('def_label_type_del');//标签删除 
        },
        labelAdd(){
            return common.permCheck('def_label_type_add');//标签新增
        },
        labelEdit(){
            return common.permCheck('def_label_type_edit');//标签编辑
        }
    },
    methods: {
        //通用提醒
        commonAlert(res){
            this.$notify({
                title: res.success?'成功':'错误',
                message: res.message,
                type: res.success?'success':'error'
            });
        },
        //清空form验证状态和数据
        clearForm(){
            this.typeForm = Object.assign({}, this.typeForm, {
                level: 'typeOne',//级别
                tagClassName: '',//类别名称
                tagCode: '',//类别编码
                tagClass: '',//选择类别
            })
            this.codeDisable = false;
            this.radioDisable = false;
            this.radioTdisable = false;
            this.selectDisable = false;
            this.$refs.typeForm.resetFields();
            this.$refs.typeForm.clearValidate();
        },
        //获取标签类别结构树
        getTagManageTree(tagName,time,showType){
            api.tagManageTree({tagName}).then(res => {
                let treeDataArr=[],treeData=[];

                if(res.success){
                    const treeData = res.data.map(res => {
                        return {
                            tagClass: res.tagClass,
                            tagClassName: res.tagClassName,
                            tagId: res.tagId
                        }
                    })
                    
                    const treeDataArr = res.data.map(res => {
                        return res.tagClass
                    })

                    // 刷新加载时触发
                    if(time == 'refresh'){
                        if(isUndefined(res.data)||isEmpty(res.data)){
                            this.$store.dispatch('getTreeIdObj',{class1Id: 'empty',class2Id: 'empty'});
                        }else{
                            this.$store.dispatch('getTreeIdObj',{class1Id: res.data[0].tagClass,class2Id: ''});
                        }
                    }

                    if(showType == 'mounted'&&isEmpty(res.data)){
                        this.mountedPageShow = true;
                    }else if(showType == 'mounted'){
                        this.defaultKey = [res.data[0].tagClass];
                        this.$nextTick(() => {
                            this.$refs.sideTree.setCurrentKey(res.data[0].tagClass);
                        })
                        
                    }
                    
                    this.tree_data = res.data;//外层树数据
                    this.select_data = treeData;//dialog下拉框数据
                    this.select_data_arr = treeDataArr;//外层树code组合
                    this.defaultSelectKey = treeData[0].tagClass;
                }else{
                    this.commonAlert(res);
                }
            })
        },
        //树节点被点击，记录当前选中节点位置
        treeNodeClick(item,node){
            this.defaultSelectKey = item.tagClass
            
            if(node.level == 2){
                //展开二级，记录一级tagClass
                this.$store.dispatch('getTreeIdObj',{class1Id: node.parent.data.tagClass,class2Id: node.data.tagClass});
            }else if(node.level == 1){
                //在一级，tagClass置空
                this.$store.dispatch('getTreeIdObj',{class1Id: node.data.tagClass,class2Id: ''});
            }
        },
        //下拉框改变
        selectChange(val){
            this.typeForm.tagClass = val;
        },
        //radio类目选择切换
        radioChange(val){
            this.typeForm.level= val;
        },
        //弹窗关闭监听
        closeDialog(){
            this.labelMnVisible = false;
            this.clearForm();
        },
        //code查重
        codeValidate(rule, value, callback){
            api.tagManageIsReapt({
                tagClassCode: value
            }).then(res => {
                if(value.length==0){
                    callback('请填写类别编码')
                }else if(res.data){
                    callback('类别编码不可重复')
                }else{
                    callback()
                }
            })
        },
        //新增类目
        tagAddAction(parentTagClass,tagClass,tagClassName,tagDesc){
            api.tagManageAdd({
                parentTagClass,//父类目classCode,若为一级类目,则传空
                tagClass,//类目CODE
                tagClassName,//类目名称
                tagDesc,//类目描述(不需要传)
            }).then(res => {
                if(res.success){
                    this.labelMnVisible = false;
                    this.getTagManageTree('');
                    this.clearForm();
                }else{}
                this.saveLoading = false;
                this.commonAlert(res)
            })
        },
        //编辑类目
        tagUpdateAction(parentTagClass,tagClass,tagClassName,tagDesc,tagId){
            api.tagManageUpdate({
                parentTagClass,
                tagClass,
                tagClassName,
                tagDesc,
                tagId
            }).then(res => {
                if(res.success){
                    this.labelMnVisible = false;
                    this.getTagManageTree('');
                    this.clearForm();
                }else{}
                this.saveLoading = false;
                this.commonAlert(res)
            })
        },
        //删除类目
        deleteRow(node,data){
                this.$confirm('确定删除该标签类别？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    api.tagManageDelete({},data.tagId).then(res => {
                        if(res.success){
                            if(node.level==1){
                                //一级类目
                                this.defaultKey = [node.data.tagClass]; 
                            }else if(node.level==2){
                                //二级类目
                                this.defaultKey = [node.parent.data.tagClass]; 
                            }
                            this.getTagManageTree('','refresh');
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
        //打开新增类目弹窗&编辑标签类目弹窗
        addNewLabelType(type,node,data){
            const { select_data, select_data_arr } = this;

            this.labelMnVisible = true;
            this.currentTagId = data.tagId;
            this.currentType = type;
            if(type=='new'){
                //新增打开弹窗
                this.rules.tagCode[0].validator = this.codeValidate;
                if(node.data.tagClass!=''){
                    if(node.parent.expanded){
                        //二级子节点
                        this.radioDisable = true;
                        this.selectDisable = true;
                        this.typeForm.level = 'typeTwo';
                        this.typeForm.tagClass = node.parent.data.tagClass;
                        this.defaultKey = [node.parent.data.tagClass]; 
                    }else{
                        // 一级子节点
                        this.typeForm.level = 'typeOne';
                        this.defaultKey = [node.data.tagClass]; 
                    }
                }
            }else{
                this.rules.tagCode[0].validator = ''
                // 编辑打开弹窗
                this.codeDisable = true;
                if(node.parent.expanded){
                    //二级子节点
                    this.radioDisable = true;
                    this.defaultKey = [node.parent.data.tagClass]; 
                    this.typeForm = Object.assign({}, this.typeForm, {
                        level: 'typeTwo',//级别
                        tagClassName: data.tagClassName,//类别名称
                        tagCode: data.tagClass,//类别编码
                        tagClass: node.parent.data.tagClass,//选择类别
                    })
                }else{
                    // 一级子节点   
                    this.radioTdisable = true;
                    this.defaultKey = [node.data.tagClass]; 
                    this.typeForm = Object.assign({}, this.typeForm, {
                        level: 'typeOne',//级别
                        tagClassName: data.tagClassName,//类别名称
                        tagCode: data.tagClass,//类别编码
                    })
                }
            }
        },
        //更新或新增
        setOk(type){
            this.$refs['typeForm'].validate((valid) => {
                const { select_data, select_data_arr, currentTagId} = this;
                const { level, tagClassName, tagClass, tagCode } = this.typeForm;

                if (valid) {
                    this.saveLoading = true;
                    if(type == 'new'){
                        //新增类目
                        if(this.typeForm.level == 'typeOne'){
                            //新增类目一级类目
                            this.tagAddAction('',tagCode,tagClassName,'');
                        }else{
                            //新增类目二级类目 
                            this.tagAddAction(tagClass,tagCode,tagClassName,'');
                        }
                    }else{
                        //编辑类目
                        if(this.typeForm.level == 'typeOne'){
                            //编辑类目一级类目
                            this.tagUpdateAction('',tagCode,tagClassName,'',currentTagId);
                        }else{
                            //编辑类目二级类目 
                            this.tagUpdateAction(tagClass,tagCode,tagClassName,'',currentTagId);
                        }
                    }
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
    }
}
</script>

<style lang="scss">
    .lb-mn-table{
        min-width: 330px;
        padding: 28px;
        .custom-tree-node {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 14px;
            padding-right: 8px;
            &:hover{
                .action{
                    opacity: 1;
                }
            }
            .action{
                opacity: 0;
                // &:hover{
                //     span{
                //         opacity: 1;
                //     }
                // }
                span{
                    margin: 0 5px;
                }
            }

        }
    }
</style>
