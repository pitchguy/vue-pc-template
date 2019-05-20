<template>
    <el-container>
        <!-- table主体 -->
        <el-main class="vk-drag-ct">
            <el-row class="tp-fl">
                <el-row class="bt-ct">
                    <el-button v-if="appAddPerm" type="primary" class="bt-o" @click="openAppDialog('new','')">新增应用</el-button>
                </el-row>
            </el-row>
            <el-row class="tp-fl-tw" :gutter="20">
                    <!-- <div>    -->
                        <el-col 
                            :span="6"
                            class=""
                            :key="item.id"
                            v-for="item in itemList" v-dragging="{ item: item, list: itemList, group: 'color' }"
                        >
                            <el-card 
                                shadow="always"
                                style="height:130px"
                                :body-style="{ padding: '0px' }"
                            >
                                <div class="vk-clearfix">
                                    <img :src="item.appIcon" style="width:40px;height:40px;margin: -5px 0 0 5% ;" />
                                    <ul> 
                                        <li>{{item.appName}}</li>
                                        <li>{{item.desc}}</li>
                                    </ul>
                                </div>
                                <div class="vk-bt">
                                    <el-button v-if="appEditPerm" style="float: right; padding: 3px 0" type="text" @click="openAppDialog('edit',item)">编辑</el-button>
                                    <div class="divide"></div>
                                    <el-button v-if="appDelPerm" style="float: right; padding: 3px 0" type="text" @click="deleteItem(item)">删除</el-button>
                                </div>
                            </el-card>
                        </el-col>
                    <!-- </div> -->
            </el-row>
        </el-main>
        <!-- 弹出框表单 -->
        <el-dialog 
            :title="nowType=='new'?'新增应用':'编辑应用'" 
            width="30%" 
            :visible.sync="dialogFormVisible" 
            class="vk-rp-dialog"
            @close="closeDialog"
        >
            <el-form status-icon :model="ruleForm" :name="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="应用图标" prop="imageUrl" :label-width="formLabelWidth">
                    <el-upload
                        class="avatar-uploader"
                        action="https://jsonplaceholder.typicode.com/posts/"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload"
                        :on-change="uploadChange"
                        :on-remove="uploadRemove"
                    >
                        <img style="width:64px;height:64px;" v-if="ruleForm.imageUrl" :src="ruleForm.imageUrl" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item label="应用名称" prop="name" :label-width="formLabelWidth">
                    <el-input v-model="ruleForm.name" placeholder="请输应用名称"></el-input>
                </el-form-item>
                <el-form-item label="应用地址" prop="address" :label-width="formLabelWidth">
                    <el-input v-model="ruleForm.address" placeholder="请输入应用地址"></el-input>
                </el-form-item>
                <el-form-item label="应用介绍" prop="desc" :label-width="formLabelWidth">
                    <el-input type="textarea" v-model="ruleForm.desc" placeholder="请输入应用介绍"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="closeDialog">取 消</el-button>
                <el-button class="common-button" type="primary" @click="addNewReport('ruleForm')">{{nowType=='new'?'添 加':'保 存'}}</el-button>
            </div>
        </el-dialog>
    </el-container>
</template>

<script>
import api from '@/api';
import common from '@/constants/common';
import mixins from '@/constants/mixins';

import labelCenterIcon from '@public/assets/imgs/home/label_center.png';//标签中心
import userDrawIcon from '@public/assets/imgs/home/user_draw.png';//用户画像   
import cusgroupAnalyseIcon from '@public/assets/imgs/home/cusgroup_analyse.png';//客群分析
import keyCusIcon from '@public/assets/imgs/home/key_cus.png';//重点客户
import reportCenterIcon from '@public/assets/imgs/home/report_center.png';//报表中心
import globalSearchIcon from '@public/assets/imgs/home/global_search.png';//全局搜索
import apiFactoryIcon from '@public/assets/imgs/home/api_factory.png';//api工厂
import platManageIcon from '@public/assets/imgs/home/plat_manage.png';//平台管理


export default {
    mixins: [mixins],
    data () {
        return {
            appAddPerm: true,
            appDelPerm: true,
            appEditPerm: true,
            dialogFormVisible: false,
            formLabelWidth: '120px',
            nowType: 'new',
            imgFile: '',
            changeId: '',
            ruleForm: {
                imageUrl: '',
                name: '',
                address: '',
                desc: '',
            },
            rules: {
                imageUrl: [
                    { required: true, message: '请上传应用图标', trigger: 'blur'}
                ],
                name: [
                    { required: true, validator: this.nameValidate, trigger: 'blur' },
                ],
                address: [
                    { required: true, message: '请输入应用地址', trigger: 'blur' },
                ],
                desc: [
                    { required: false, min: 0, max: 30, message: '描述长度在 0 到 30 个文字', trigger: 'blur' },
                ],
            },
            itemList: []
        }
    },
    created(){
        this.appAddPerm = common.permCheck('app_add');//应用新增
        this.appDelPerm = common.permCheck('app_del');//应用删除
        this.appEditPerm = common.permCheck('app_edit');//应用编辑
    },
    mounted () {
        this.getAppList();

        this.$dragging.$on('dragged', ({ value }) => {
            const idArr = value.list.map(res => {
                return res.id
            })
        
            this.appSort(idArr);
        })
    },
    methods: {
            //清空form验证状态和数据
            clearForm(){
                this.ruleForm = Object.assign({}, this.ruleForm, {
                    imageUrl: '',name: '',address: '',desc: '',
                })
                this.$refs.ruleForm.resetFields();
                this.dialogFormVisible = false;
            },
            //获取应用列表
            getAppList(){
                api.appList({}).then(res => {
                    if(res.success){
                        this.itemList = res.data;
                    }else{
                        this.$message.error(res.message);
                    }
                })
            },
            //新增应用方法
            addAppAction(icon,appName,url,desc){
                api.appAdd({
                    icon,appName,url,desc
                }).then(res => {
                    if(res.success){
                        this.clearForm();
                        this.getAppList();
                    }else{}
                    this.commonAlert(res)
                })
            },
            //更新编辑应用
            appUpdateAction(id,icon,appName,url,desc){
                api.appUpdate({
                    id,icon,appName,url,desc
                }).then(res => {
                    if(res.success){
                        this.clearForm();
                        this.getAppList();
                    }else{}
                    this.commonAlert(res)
                })
            },
            //打开报表
            openAppDialog(type,item){
                this.nowType = type;//当前编辑状态
                if(type == 'new'){
                }else{
                    this.changeId = item.id;//编辑的id

                    this.ruleForm = Object.assign({}, this.ruleForm, {
                        imageUrl: item.appIcon,
                        name: item.appName,
                        address: item.url,
                        desc: item.desc
                    })
                }
                this.dialogFormVisible = true;
            },
            //关闭dialog清空
            closeDialog(){
                this.clearForm();
            },
            //新增&编辑提交
            addNewReport(){
                this.$refs['ruleForm'].validate((valid) => {
                    const { imgFile, changeId } = this;
                    const { imageUrl, name, address, desc } = this.ruleForm;

                    if (valid) {
                        if(this.nowType == 'new'){
                            this.addAppAction(imgFile,name,address,desc);//新增
                        }else{
                            //编辑
                            this.appUpdateAction(changeId,imgFile,name,address,desc)
                        }
                    } else {
                        this.$message.error('请正确输入表单信息')
                        return false;
                    }
                });
                //   dialogFormVisible = false
            },
            //应用排序
            appSort(ids){
                api.appSort({
                    ids
                }).then(res => {
                    if(res.success){
                    }else{
                        this.commonAlert(res)
                    }
                })
            },
            //上传改变图片监听
            uploadChange(file){
                this.imgFile = file.raw;
                this.ruleForm.imageUrl = URL.createObjectURL(file.raw);
            },
            //上传移除图片监听
            uploadRemove(val){
                this.ruleForm.imageUrl = '';
            },
            //上传头像前验证
            beforeAvatarUpload(file) {
                const isLt2M = file.size / 1024 / 1024 < 2;

                if (!isLt2M) {
                    this.$message.error('上传头像图片大小不能超过 2MB!');
                }
                return isLt2M;
            },
            handleAvatarSuccess(res, file){
                this.imgFile = file.raw;
                this.ruleForm.imageUrl = URL.createObjectURL(file.raw);
            },
            //删除应用
            deleteItem(val){
                this.$confirm('确认删除该应用, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    api.appDelete({},val.id).then(res => {
                        if(res.success){
                            this.getAppList();
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
            //应用名称验证
            nameValidate(rule, value, callback){
                const len = value.length;

                if(len == 0){
                    callback(new Error('请输入应用名称'));
                }else if(len>20){
                    callback(new Error('应用名称最多20字'));
                }else{
                    callback();
                }
            }
    }
}
</script>

<style lang="scss">
    .common-button{
        background:#5A8CFF;
    }
    .avatar-uploader .el-upload{
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 50px;
        height: 50px;
        line-height: 50px;
        text-align: center;
    }
    .avatar {
        width: auto;
        // height: 50px;
        display: block;
    }
    
    .vk-drag-ct{
        padding: 0 30px;
        .tp-fl{
            padding: 10px 0 23px 0;
            .bt-ct{
                float: right;
                .bt-o{
                    color: #fff;
                    border-radius: 4px;
                    background-color: #5A8CFF;
                }
            }
        }
        .tp-fl-tw{
            .el-col{
                min-height: 180px;
            }
        }
        .el-card{
            margin-bottom: 20px;
        }
        .vk-clearfix{
            display: flex;
            padding: 24px 20px;
            ul{
                font-family: PingFangSC-Regular;
                margin-left: 5%;
                li:nth-child(1){
                    font-size: 14px;
                    color: #333333;
                    padding: 0 0 10px 0;
                }
                li:nth-child(2){
                    font-size: 12px;
                    color: #999999;
                }
            }
        }
        .vk-bt{
            display: flex;
            border-top: 1px solid #EDEDED;
            .divide{
                width: 1px;
                height: 24px;
                margin-top: 9px;
                background-color: #E8E8E8;
            }
            button{
                width: 50%;
                font-size: 14px;
                color: #6292FF;
                font-weight: 400;
                padding: 13px 0!important;
            }
        }
    }
    .vk-rp-dialog{
        .el-input,.el-textarea{
            width: 80%;
        }
    }
</style>
