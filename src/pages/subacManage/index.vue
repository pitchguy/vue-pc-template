<template>
    <el-container class="vk-sub-m-ct">
        <router-view></router-view>
        <div class="top-s-c">
            <el-input
                clearable
                class="search"
                placeholder="输入创建人/子账号/域账号进行搜索"
                v-model="search_input"
                @change="inputChange"
                @keyup.enter.native="inputSubmit"
            >
                <i slot="prefix" class="el-input__icon el-icon-search"></i>
            </el-input>
            <el-button icon="el-icon-search" plain @click="inputSubmit" type="primary" style="height:31px;">搜索</el-button>
            <el-button class="common-button" type="primary" @click="openDialog('new')" style="float:right">新建子账号</el-button>
        </div>
        <div class="t-table">
            <el-table
                highlight-current-row
                :data="tableData"
                style=""
            >
                <el-table-column prop='aliyunAccount' label='子账号' />
                <el-table-column min-width="200" prop='desc' label='描述' />
                <el-table-column prop='creator' label='创建人' />
                <el-table-column prop='adAccount' label='域账号' />
                <el-table-column prop='createTime' label='创建时间' />
                <el-table-column fixed="right" label="操作" width="200">
                    <template slot-scope="scope">
                        <div class="action-ct">
                            <span v-if="bindPerm" class="boe-btn" @click="bindAct(scope.row,scope.$index)">绑定</span>
                            <span v-if="managePerm" class="boe-btn" @click="userManage(scope.row,scope.$index)">人员管理</span>
                            <span v-if="editPerm" class="boe-btn" @click="openDialog('edit',scope.row,scope.$index)">编辑</span>
                            <span v-if="deletPerm" class="boe-btn" @click="deleteAct(scope.row,scope.$index)">删除</span>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <div class="t-page">
                <el-pagination
                    v-if="totalPages"
                    background
                    @size-change="pnSizeChange"
                    @current-change="pnCurrentChange"
                    :current-page.sync="currentPage"
                    :page-sizes="[10, 20, 30, 40]"
                    :page-size="currentPageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="totalPages">
                </el-pagination>
            </div>
        </div>


        <el-dialog 
            title="绑定人员" 
            width="50%" 
            :visible.sync="bindDialogVisible" 
            class="vk-rp-dialog"
            @close="closeNextDialog('newBind')"
        >
            <new-bind ref="newBind" :bindId="bindId"></new-bind>
        </el-dialog>
        <!-- 人员管里弹出框 -->
        <el-dialog 
            title="人员管理" 
            width="50%" 
            :visible.sync="userManageDialogVisible" 
            class="vk-rp-dialog"
            @close="closeNextDialog('managePeople')"
        >
            <manage-people ref="managePeople" :visible="userManageDialogVisible" :bindId="bindId"></manage-people>
        </el-dialog>
        <!-- 弹出框表单 -->
        <el-dialog 
            :title="nowType=='new'?'阿里云子账号':'编辑子账号'" 
            width="40%" 
            :visible.sync="dialogFormVisible" 
            @close="closeDialog"
            class="vk-rp-dialog">
            <el-form status-icon :model="ruleForm" :name="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="阿里云子账号" prop="aliyunAccount" :label-width="formLabelWidth">
                    <el-input v-model="ruleForm.aliyunAccount" placeholder="请输入子账号名称"></el-input>
                </el-form-item>
                <el-form-item label="Quick BI Access ID：" prop="accessKey" :label-width="formLabelWidth">
                    <el-input v-model="ruleForm.accessKey" placeholder="请输入AccessKey"></el-input>
                </el-form-item>
                <el-form-item label="Quick BI Access Key：" prop="accessSecret" :label-width="formLabelWidth">
                    <el-input v-model="ruleForm.accessSecret" placeholder="请输入AccessSecret"></el-input>
                </el-form-item>
                <el-form-item label="子账号描述：" prop="desc" :label-width="formLabelWidth">
                    <el-input type="textarea" v-model="ruleForm.desc" placeholder="请输入子账号描述"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="closeDialog">取 消</el-button>
                <el-button type="primary" @click="addNewAccount('ruleForm')">{{nowType=='new'?'添 加':'保 存'}}</el-button>
            </div>
        </el-dialog>
    </el-container>
</template>

<script>
import api from '@/api/';
import moment from 'moment';
import common from '@/constants/common';
import ManagePeople from './components/managePeople';
import NewBind from './components/newBindDialog';

export default {
    components: {
        'manage-people': ManagePeople,
        'new-bind': NewBind
    },
    data(){
        return{
            deletPerm: true,
            editPerm: true,
            bindPerm: true,
            managePerm: true,
            bindId: '',
            search_input: '',
            nowType: 'new',
            totalPages: 1,
            currentPage: 1,
            currentPageSize: 10,
            formLabelWidth: '200px',
            userManageDialogVisible: false,
            bindDialogVisible: false,
            dialogFormVisible: false,
            ruleForm: {
                aliyunAccount: '',
                accessKey: '',
                accessSecret: '',
                desc: ''
            },
            rules: {
                aliyunAccount: [
                    { required: true, message: '请输入子账号名称', trigger: 'blur' },
                ],
                accessKey: [
                    { required: true, message: '请输入AccessKey', trigger: 'blur' },
                ],
                accessSecret: [
                    { required: true, message: '请输入AccessSecret', trigger: 'blur'},
                ],
                desc: [
                    { required: false, message: '请输入子账号描述', trigger: 'blur'},
                ],
            },
            columnData: [
                {prop: 'body', label: '创建人'},{prop: 'domain', label: '域账号'},
                {prop: 'phone', label: '手机号'},{prop: 'time', labl: '创建时间'}
            ],
            tableData: []
        }
    },
    created(){
        this.deletPerm = common.permCheck('ali_del');
        this.editPerm = common.permCheck('ali_edit');
        this.bindPerm = common.permCheck('bind_mem');
        this.managePerm = common.permCheck('mem_manage');
    },
    mounted(){
        const { currentPage, currentPageSize, search_input } = this;

        this.getAliyunList(currentPage,currentPageSize,search_input);
    },
    methods: {
        //清除form状态与值
        clearForm(){
            this.ruleForm = Object.assign({}, this.ruleForm, {
                aliyunAccount: '',
                accessKey: '',
                accessSecret: '',
                desc: ''
            })
            this.$refs.ruleForm.clearValidate();
        },
        //获取阿里云子账号列表
        getAliyunList(pageNo='',pageSize='',search=''){
            api.aliyunList({
                pageNo,
                pageSize,
                search
            }).then(res => {
                if(res.success){
                    const { data, total } = res.data;

                    data.forEach(item => {
                        item.createTime = moment(item.createTime).format('YYYY-MM-DD HH:mm:ss')
                    })

                    this.tableData = data;
                    this.totalPages = total;
                }else{
                    this.$notify({
                        title: res.success?'成功':'错误',
                        message: res.message,
                        type: res.success?'success':'error'
                    });
                }
            })
        },
        //新增阿里云子账号
        addAliyunAdd(accessKey,accessSecret,aliyunAccount,desc){
            api.aliyunAdd({
                accessKey,
                accessSecret,
                aliyunAccount,
                desc
            }).then(res => {
                if(res.success){
                    const { currentPage, currentPageSize, search_input } = this;

                    this.dialogFormVisible=false;
                    this.clearForm()
                    this.getAliyunList(currentPage,currentPageSize,search_input);
                }else{}

                this.$notify({
                    title: res.success?'成功':'错误',
                    message: res.message,
                    type: res.success?'success':'error'
                });
            })  
        },
        //子账号管理列表搜索
        inputChange(val){
            this.search_input = val;
        },
        //input输入框enter事件
        inputSubmit(e){
            const { currentPage, currentPageSize, search_input } = this;
            
            this.currentPage = 1;
            this.getAliyunList(1,currentPageSize,search_input);

        },
        //关闭下级弹窗并清楚对应的input值和table显示
        closeNextDialog(name){
            this.$refs[name].search_input = '';
            this.$refs[name].ifShow = false;
        },
        //关闭弹窗
        closeDialog(){
            this.clearForm()
            this.dialogFormVisible = false;
        },
        //新建&编辑子账号
        openDialog(type,row,index){
            this.nowType = type;

            if(type == 'edit'){
                this.bindId = row.id;
                this.ruleForm = Object.assign({}, this.ruleForm, {
                    aliyunAccount: row.aliyunAccount,
                    accessKey: row.accessKey,
                    accessSecret: row.accessSecret,
                    desc: row.desc
                })
            }

            this.dialogFormVisible = true;
        },
        //更新阿里云子账号
        aliyunUpdate(accessKey,accessSecret,aliyunAccount,desc,id){
            api.aliyunUpdate({
                accessKey,
                accessSecret,
                aliyunAccount,
                desc,
                id
            }).then(res => {
                if(res.success){
                    const { currentPage, currentPageSize, search_input } = this;

                    this.clearForm()
                    this.dialogFormVisible = false;
                    this.getAliyunList(currentPage,currentPageSize,search_input);
                }else{}

                this.$notify({
                    title: res.success?'成功':'错误',
                    message: res.message,
                    type: res.success?'success':'error'
                });
            })
        },
        //绑定人员
        bindAct(row, index){
            this.bindId = row.id;
            this.bindDialogVisible = true;
            // this.$router.push('/subac-manage/binder/121');
        },
        //删除子账号
        deleteAct(row, index){
            this.$confirm('确认删除该子账号, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                api.aliyunDelete({},row.id)
                .then(res => {
                    if(res.success){
                        const { totalPages, currentPage, currentPageSize, search_input } = this;
                        const currentPageNo = common.checkJumpLastPage(totalPages,currentPageSize,currentPage);

                        this.getAliyunList(currentPageNo,currentPageSize,search_input);

                        this.$message({
                            type: 'success',
                            message: res.message
                        });
                    }else{
                        throw new Error()
                    }

                })
                
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        //分页器大小变化
        pnSizeChange(val){
            const { currentPage, currentPageSize, search_input } = this;

            this.currentPageSize = val;
            this.getAliyunList(currentPage,val,search_input);
        },
        //分页器页码改变
        pnCurrentChange(val){
            const { currentPage, currentPageSize, search_input } = this;

            this.currentPage = val;
            this.getAliyunList(val,currentPageSize,search_input);
        },
        //新建子账号&编辑
        addNewAccount(){
            this.$refs['ruleForm'].validate((valid) => {
                if (valid) {
                    const { bindId } = this;
                    const { aliyunAccount,accessKey,accessSecret,desc } = this.ruleForm;

                    if(this.nowType == 'new'){
                        this.addAliyunAdd(accessKey,accessSecret,aliyunAccount,desc);
                    }else{
                        this.aliyunUpdate(accessKey,accessSecret,aliyunAccount,desc,bindId);
                    }
                    
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        userManage(row,index){
            this.bindId = row.id;
            this.userManageDialogVisible = true;
        }
    }

}
</script>

<style lang="scss">
    .common-button{
        background:#5A8CFF;
    }
    .vk-sub-m-ct{
        margin: 20px;
        background: #fff;
        display: block;
        .top-s-c{
            padding: 20px 30px;
            .search{
                width: 270px;
            }
        }
        .t-table{
            margin: 0 31px;
            .el-table{
                border: 1px solid #E8E8E8;
                thead{
                    tr{
                        th{
                            background-color: #FAFAFA;
                        }
                    }
                }
                .action-ct{
                    .boe-btn{
                        margin: 0 7px 0 0;
                    }
                }
            }
            .t-page{
                text-align: right;
                padding: 26px 0 0 0;
                .el-pagination.is-background .el-pager li:not(.disabled).active{
                    background: rgb(90, 140, 255);
                }
            }
        }
        .vk-rp-dialog{
            .el-input,.el-textarea{
                width: 80%;
            }
        }
    }
</style>
