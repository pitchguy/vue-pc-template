<template>
    <el-container>
        <el-header class="vk-add-header">
            <p v-if="showType">新建角色模版</p>
            <p v-else>编辑角色模版</p>
        </el-header>
        <el-main class="vk-add-main">
            <el-form :model="tempForm" :name="tempForm" status-icon :rules="rules" ref="tempForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="模版名称：" prop="name" :label-width="formLabelWidth">
                    <el-input type="text" v-model="tempForm.name" autocomplete="off" placeholder="请输入角色名称"></el-input>
                </el-form-item>
                <el-form-item label="角色描述：" prop="desc" :label-width="formLabelWidth">
                    <el-input type="textarea" v-model="tempForm.desc" autocomplete="off" placeholder="请输入角色描述，不超过30字"></el-input>
                </el-form-item>
                <el-form-item label="功能权限分配：" prop="functions" :label-width="formLabelWidth">
                    <el-tree
                        :data="treeData"
                        :props="treeProps"
                        node-key="permId"
                        ref="tree"
                        show-checkbox
                        highlight-current
                        v-model="tempForm.functions"
                        :default-checked-keys="tempForm.functions"
                        @check-change="treeCheckChange">
                    </el-tree>
                </el-form-item>
                <el-form-item>
                    <el-button class="common-button" v-if="showType" type="primary" @click="submitForm('tempForm')">提交</el-button>
                    <el-button class="common-button" v-else type="primary" @click="updateForm('tempForm')">更新</el-button>
                    <el-button @click="goBackHome">返回</el-button>
                </el-form-item>
            </el-form>
        </el-main>
    </el-container>
</template>

<script>
import { mapState } from 'vuex';
import api from "@/api/index.js";
import { isUndefined, findIndex } from 'lodash';
import common from '@/constants/common';

export default {
    data(){
        return{
            editId: '',
            showType: '',
            treeProps: {
                label: 'permLabel',
                children: 'childFunPerms'
            },
            treeData: [],
            allParentNode: [],
            formLabelWidth: '150px',
            tempForm: {
                name: '',
                desc: '',
                functions: []
            },
            rules: {
                name: [
                    { required: true, message: '请输入角色名称', trigger: 'blur' },
                ],
                desc: [
                    { validator: this.descValid, message: '描述信息不超过30字', trigger: 'blur' }
                ],
                functions: [
                    { required: true, message: '请至少选择一个功能权限', trigger: 'change' }
                ],
            }
        }
    },
    created(){
        const editId = this.$route.params.id;//编辑角色模版的id

        this.showType = isUndefined(editId);
    },
    mounted(){
        const editId = this.$route.params.id;//编辑角色模版的id

        api.getJurisTree().then(response => {
            const { success, data, message } = response;

            if (success) {
                let allParentNode=[];
                let loop = res => {
                    res.forEach(item => {
                        if (item.childFunPerms.length != 0) {
                            allParentNode.push(item.permId);
                            loop(item.childFunPerms);
                            return;
                        }

                        if (item.childFunPerms == 0) {
                            loop(item.childFunPerms);
                            return;
                        }
                    });
                };
                loop(data);
                this.treeData = data;
                this.allParentNode = allParentNode;//取得所有父节点
            } else {
                this.$message.error(message);
            }
        })

        if(isUndefined(editId)){
            //新建
            return false
        }else{
            // 编辑
            this.seeUserTemp(editId)
        }
        // this.$store.dispatch('getJurisTrees');
        // console.log(this.jurisData)
    },
    computed: mapState({
       jurisData: state => state.addNew.jurisData
    }),
    methods: {
        goBackHome(){
            this.$router.push({name: 'user-role', params: {cuPage: 'userTmplate'}});
        },
        //通用提醒
        commonAlert(res){
            this.$notify({
                title: res.success?'成功':'错误',
                message: res.message,
                type: res.success?'success':'error'
            });
        },
        //查看编辑的角色模板
        seeUserTemp(roleConfigId){
            api.seeUserTemp({
                roleConfigId
            }).then(res => {
                if(res.success){
                    const {configRoleDesc,configRoleName,funPermIds,id} = res.data;
                    
                    this.editId = id;
                    this.tempForm.name = configRoleName;
                    this.tempForm.desc = configRoleDesc;
                    this.tempForm.functions = funPermIds;
                }
            })
        },
        //树选择改变
        treeCheckChange(node,status){
            this.tempForm.functions = this.$refs.tree.getCheckedKeys();
            // console.log(this.$refs.tree.getCheckedKeys())
        },
        //提交表单
        submitForm(name){
            this.$refs[name].validate((valid) => {
                const { allParentNode } = this;
                const { name, desc , functions } = this.tempForm;
                const uploadNodes = functions.filter(res => {
                    if(allParentNode.indexOf(res)<0){
                        return res
                    }else{
                        return
                    }
                })
                
                if (valid) {
                    api.addNewUserTemp({
                        permIds: uploadNodes,
                        roleConfigDesc: desc,
                        roleConfigName: name
                    }).then(res => {
                        if(res.success){
                            this.$router.push({name: 'user-role', params: {cuPage: 'userTmplate'}});
                        }else{
                        }
                        this.commonAlert(res);
                    })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        //更新表单
        updateForm(name){
            this.$refs[name].validate((valid) => {
                const { allParentNode } = this;
                const { name, desc, functions } = this.tempForm;
                const uploadNodes = functions.filter(res => {
                    if(allParentNode.indexOf(res)<0){
                        return res
                    }else{
                        return
                    }
                })

                if (valid) {
                    api.updateUserTemp({
                        id: this.editId,
                        permIds: uploadNodes,
                        roleConfigDesc: desc,
                        roleConfigName: name
                    }).then(res => {
                        if(res.success){
                            this.$router.push({name: 'user-role', params: {cuPage: 'userTmplate'}});
                        }else{}
                        this.commonAlert(res);
                    })
                }else{
                    console.log('error submit!!');
                    return false;
                }
            })
            
        },
        //自定义验证描述
        descValid(rule, value, callback){
            if(value.length>30){
                callback('描述信息不超过30字')
            }else{
                callback()
            }
        }
    }
}
</script>

<style lang="scss">
    .common-button{
        background:#5A8CFF;
    }
    .vk-add-header{
        height: auto!important;
        padding: 20px 0 0 20px;
        p{
            font-size: 16px;
            color: #333333;
        }
    }
    .vk-add-main{
        background: #fff;
        margin: 20px;
        .el-form-item__content{
            width: 25%;
        }
    }
</style>
