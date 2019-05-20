<template>
    <el-container :style="{minHeight: bodyHeight + 'px'}">
        <!-- 左侧导航栏 -->
        <el-aside class="vk-l-aside" width="200px">
            <el-menu
                :default-active="default_menu"	
                background-color="#161D38"
                text-color="#fff"
                active-text-color="#fff"
                @select="menuSelect"
            >
                <el-tooltip 
                    v-for="item in left_menu_data"
                    :key="item.id"
                    class="item" 
                    effect="dark" placement="right-start"
                >
                    <div slot="content" class="slot-content">{{item.reportName}}</div>
                    <el-menu-item
                        :index="item.reportName+'|'+item.id"
                    >
                        {{item.reportName}}
                    </el-menu-item>
                </el-tooltip> 
            </el-menu>
        </el-aside>
        <!-- 自定义报表 table主体 -->
        <el-main class="vk-drag-ct" v-if="default_menu=='自定义报表|0'">
            <el-row class="tp-fl">
                <p class="title">自定义报表</p>
                <el-row class="bt-ct">
                    <el-button v-if="defReportAddPerm" type="primary" class="bt-o" @click="openDialog('new','ruleForm')">新增报表</el-button>
                    <el-button v-if="defReportSetPerm" class="bt-t" @click="getSsoLink">设置报表</el-button>
                </el-row>
            </el-row>
            <el-row class="tp-fl-tw" :gutter="20" v-if="report_data.length!=0">
                    <el-col 
                        :span="6"
                        :key="item.id"
                        v-for="item in report_data" 
                        v-dragging="{ item: item, list: report_data, group: 'color' }"
                    >
                        <el-card 
                            shadow="always"
                            :body-style="{ padding: '0px' }"
                        >
                            <div class="vk-clearfix">
                                <img :src="fileIcon" style="width:20px;height:20px;margin-left:10%;" />
                                <ul>
                                    <li>{{item.reportName}}</li>
                                    <li>{{item.desc}}</li>
                                </ul>
                            </div>
                            <div class="vk-bt">
                                <el-button v-if="defReportEditPerm" style="float: right; padding: 3px 0" type="text" @click="openDialog('edit',item)">编辑</el-button>
                                <div class="divide"></div>
                                <el-button v-if="defReportDelPerm" style="float: right; padding: 3px 0" type="text" @click="deleteItem(item)">删除</el-button>
                            </div>
                        </el-card>
                    </el-col>
            </el-row>
            <div v-else class="empty-ct">
                <img :src="emptyIcon" alt="暂无数据" style="width:250px;" />
                <p style="position: relative;left: 20px;top: 15px;font-size: 14px;color: #666666;margin: 24px 0;">暂无数据，去新增报表试试吧~~</p>
            </div>
        </el-main>
        <!-- iframe主体 -->
        <el-main class="vk-drag-ct" v-else>
            <iframe :src="iframeUrl" frameborder="0" :height="windowHeight" style="width:100%;"></iframe>
        </el-main>
        <!-- 弹出框表单 -->
        <el-dialog 
            :title="nowType=='new'?'新增报表':'编辑报表'" 
            width="30%" 
            :visible.sync="dialogFormVisible" 
            class="vk-rp-dialog"
            @close="closeDialog"
        >
            <el-form :model="ruleForm" :name="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="报表名称" prop="name" :label-width="formLabelWidth">
                    <el-input v-model="ruleForm.name" placeholder="请输入报表名称"></el-input>
                </el-form-item>
                <el-form-item label="报表PageId" prop="address" :label-width="formLabelWidth">
                    <el-input v-model="ruleForm.address" placeholder="请输入报表地址"></el-input>
                </el-form-item>
                <el-form-item label="报表描述" prop="desc" :label-width="formLabelWidth">
                    <el-input type="textarea" v-model="ruleForm.desc" placeholder="请输入报表描述，不超过30字"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="closeDialog">取 消</el-button>
                <el-button type="primary" @click="editReport()">{{nowType=='new'?'添 加':'保 存'}}</el-button>
            </div>
        </el-dialog>
    </el-container>
</template>

<script>
import api from '@/api';
import common from '@/constants/common';
import fileIcon from '@public/assets/imgs/reportForm/file.png';
import emptyIcon from '@public/assets/imgs/blank.png';//空白

export default {
    data () {
        return {
            defReportAddPerm: true,
            defReportEditPerm: true,
            defReportDelPerm: true,
            defReportSetPerm: true,
            windowHeight: window.innerHeight+'px',
            fileIcon,
            emptyIcon,
            nowType: 'new',
            iframeUrl: '',
            default_menu: '',
            change_id: '',
            dialogFormVisible: false,
            formLabelWidth: '120px',
            ruleForm: {
                name: '',
                address: '',
                desc: ''
            },
            rules: {
                name: [
                    { required: true, validator: this.nameValidate, trigger: 'blur' },
                ],
                address: [
                    { required: true, message: '请输入报表地址', trigger: 'blur' },
                ],
                desc: [
                    { required: false, min: 0, max: 30, message: '描述长度在 0 到 30 个文字', trigger: 'blur' },
                ],
            },
            left_menu_data: [],
            report_data: []
        }
    },
    created(){
        this.defReportAddPerm = common.permCheck('def_report_add');//报表新增
        this.defReportEditPerm = common.permCheck('def_report_edit');//报表编辑
        this.defReportDelPerm = common.permCheck('def_report_del');//报表删除
        this.defReportSetPerm = common.permCheck('def_report_setting');//报表设置
    },
    mounted () {
        this.getHasReportData();
        this.$dragging.$on('dragged', ({ value }) => {
            const idArr = value.list.map(res => {
                return res.id
            })

            this.reportSort(idArr)
        })
        this.$dragging.$on('dragend', ({ value }) => {
        })
    },
    computed: {
        bodyHeight(){
            return window.innerHeight - 60
        }
    },
    methods: {
        commonAlert(res){
            this.$notify({
                title: res.success?'成功':'错误',
                message: res.message,
                type: res.success?'success':'error'
            });
        },
        //清除默认信息
        clearForm(){
            this.ruleForm = Object.assign({}, this.ruleForm, {
                name: '',
                address: '',
                desc: ''
            })
            this.$refs.ruleForm.resetFields();
            this.$refs.ruleForm.clearValidate();
        },
        //获取有数据权限的列表
        getHasReportData(){
            api.reportHaslist({}).then(res => {
                if(res.success){
                    const menuList = res.data;
                    const topList = [
                        {
                            reportName: '自定义报表',
                            id: 0,
                            index: '0'
                        }].concat(menuList);

                    this.report_data = res.data;
                    
                    if(common.permCheck('def_report_view')){
                        this.default_menu = '自定义报表|0';
                        this.left_menu_data = topList;
                    }else{
                        this.default_menu = `${menuList[0].reportName}|${menuList[0].id}`
                        this.left_menu_data = menuList;
                        this.reportEmbedAction(menuList[0].id);//请求报表
                    }
                }else{
                    this.commonAlert(res)
                }
            })
        },
        //新增报表
        reportAdd(desc,pageId,reportName){
            api.reportAdd({
                desc,
                pageId,
                reportName
            }).then(res => {
                if(res.success){
                    this.getHasReportData();
                    this.dialogFormVisible = false;
                }else{
                }
                this.commonAlert(res);
            })
        },
        //更新报表
        updateReport(desc,id,reportName,pageId){
            api.reportUpdate({
                desc,
                id,
                reportName,
                pageId
            }).then(res => {
                if(res.success){
                    this.dialogFormVisible = false;
                    this.getHasReportData();
                }else{
                }
                this.commonAlert(res);
            })
        },
        //报表排序
        reportSort(ids){
            api.reportSort({
                ids
            }).then(res => {
                if(res.success){
                }else{
                    this.$message({
                        type: 'error',
                        message: res.message
                    }); 
                }
            })
        },
        //获取免登录url地址
        getSsoLink(){
            api.aliyunAccount({
                type: 1
            }).then(res => {
                if(res.success){
                    window.open(res.data);
                }else{
                    this.commonAlert(res)
                }
            })
        },
        //关闭重置弹窗
        closeDialog(){
            this.clearForm();
            this.dialogFormVisible = false
        },
        //打开报表
        openDialog(name,item){
            this.nowType = name;
            this.dialogFormVisible = true;

            if(name == 'new'){
                this.clearForm();
            }else{
                this.ruleForm = Object.assign({}, this.ruleForm, {
                    name: item.reportName,
                    address: item.url,
                    desc: item.desc
                })
                this.change_id = item.id;
            }

        },
        //新增报表&编辑报表
        editReport(type,item){
            this.dialogFormVisible = true;
            this.$refs['ruleForm'].validate((valid) => {

                if (valid) {
                    if(this.nowType == 'new'){
                        const { desc, address, name } = this.ruleForm;
                        
                        this.reportAdd(desc,address,name)
                    }else{
                        const { desc, address, name } = this.ruleForm;

                        this.updateReport(desc,this.change_id,name,address)
                    }

                } else {
                    console.log('error submit!!');
                    return false;
                }

            });
        },
        //设置报表
        setReport(){
            this.getSsoLink();
        },
        //菜单选择
        menuSelect(key, keyPath, e){
            this.default_menu = key;

            if(key.split('|')[1]==0){
                return false
            }else{
                this.reportEmbedAction(key.split('|')[1])
            }
        },
        //请求报表
        reportEmbedAction(id){
            api.reportEmbed({},id).then(res => {
                if(res.success){
                    this.iframeUrl = res.data;
                }else{
                    this.$notify({
                        title: res.success?'成功':'错误',
                        message: res.message,
                        type: res.success?'success':'error'
                    });
                }
            })
        },
        //删除报表
        deleteItem(val){
            this.$confirm('确认删除该报表, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                api.reportDelete({},val.id).then(res => {
                    if(res.success){
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.getHasReportData();
                    }else{
                        this.$message({
                            type: 'info',
                            message: res.message
                        }); 
                    }
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
        },
        nameValidate(rule, value, callback){
            const len = value.length;

            if(len == 0){
                callback(new Error('请输入报表名称'));
            }else if(len>20){
                callback(new Error('报表名称最多20字'));
            }else{
                callback();
            }
        }
    }
}
</script>

<style lang="scss">
    .slot-content{
        max-width: 200px;
    }
    .vk-l-aside{
        overflow: -moz-hidden-unscrollable;
        .el-menu{
            min-height: 700px;
            height: 100%;
            padding-bottom: 9999px;
            margin-bottom: -9999px;
            overflow: hidden;
            .el-menu-item{
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }
            .is-active{
                background: #409EFF!important;
            }
        }
    }
    .vk-drag-ct{
        max-height: 900px;
        overflow: scroll;
        .tp-fl{
            padding: 10px 0 23px 0;
            .title{
                float: left;
                font-size: 16px;
                color: #333333;
                font-weight: bold; 
                line-height: 32px;
            }
            .bt-ct{
                float: right;
                .bt-o{
                    color: #fff;
                    border-radius: 4px;
                    background-color: #5A8CFF;
                }
                .bt-t{
                    color: #6292FF;
                    background: #FFFFFF;
                    border: 1px solid #6292FF;
                    border-radius: 4px;
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
                margin-left: 10%;
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
        .empty-ct{
            width:100%;
            text-align:center;
            margin: 180px 0;
        }
    }
    .vk-rp-dialog{
        .el-input,.el-textarea{
            width: 80%;

        }
    }
</style>
