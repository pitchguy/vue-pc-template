<template>
    <el-container
        v-loading="isLoad"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
    >
        <el-main>
            <div class="top-s-c">
                <el-input
                    class="search"
                    placeholder="输入角色模板名称/创建人/域账号"
                    v-model="search_input"
                    @change="inputChange"
                    @keyup.enter.native="inputSubmit"
                >
                    <i slot="prefix" class="el-input__icon el-icon-search"></i>
                </el-input>
                <el-button icon="el-icon-search" plain @click="inputSubmit" type="primary" style="height:31px;">搜索</el-button>
                <el-button v-if="roleConfAddPerm" type="primary" @click="jumptoAddPage" style="float:right;background:#5A8CFF;">新建角色模版</el-button>

                <div class="t-table">
                    <el-table
                        ref="multipleTable"
                        highlight-current-row
                        :data="user_t_data"
                    >
                        <el-table-column prop='configRoleName' label='模版名称' />
                        <el-table-column prop='configRoleDesc' label='角色模版描述' />
                        <el-table-column prop='userCn' label='创建人' />
                        <el-table-column prop='adAccount' label='域账号' />
                        <el-table-column prop='gmtCreate' label='创建时间' />
                        <el-table-column fixed="right" label="操作">
                            <template slot-scope="scope">
                                <div class="action-ct"> 
                                    <span v-if="roleConfEditPerm" class="boe-btn" @click="editRow(scope.row,scope.$index)">编辑</span>
                                    <span v-if="roleConfDelPerm" class="boe-btn" @click="deleteRow(scope.row,scope.$index)">删除</span>
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
            </div>
        </el-main>
    </el-container>
</template>

<script>
import moment from "moment";
import { remove } from 'lodash';
import api from "@/api/index.js";
import common from '@/constants/common';

export default {
    data(){
        return{
            roleConfAddPerm: true,
            roleConfEditPerm: true,
            isLoad: true,
            currentPage: 1,
            currentPageSize: 10,
            totalPages: 1,
            search_input: '',
            user_t_data: [],
        }
    },
    created(){
        this.roleConfEditPerm = common.permCheck('role_config_edit');//角色模版编辑
        this.roleConfAddPerm = common.permCheck('role_config_add');//角色模版新增
        this.roleConfDelPerm = common.permCheck('role_config_del');//角色模版删除
    },
    mounted(){
        const { currentPage, currentPageSize, search_input } = this;

        this.getList(currentPage,currentPageSize,search_input)
    },
    methods: {
        //获取列表数据
        getList(pageNo,pageSize,search){
            api.getUserTempList({
                pageNo,
                pageSize,
                search
            }).then(ret => {
                if(ret.success){
                    const { total, data } = ret.data;

                    data.forEach(res => {
                        res.gmtCreate = moment(res.gmtCreate).format('YYYY-MM-DD HH:mm:ss');
                    })
                    this.user_t_data = data;
                    this.totalPages = total;
                    this.isLoad = false;
                }else{
                    this.$notify({
                        title: ret.success?'成功':'错误',
                        message: ret.message,
                        type: ret.success?'success':'error'
                    });
                }
            })
        },
        //编辑角色模版
        editRow(row, index){
            this.$router.push('/userjuri/newUserTemp/' + row.id)
        },
        //跳转到新增模版页面
        jumptoAddPage(){
            this.$router.push('/userjuri/newUserTemp')
        },
        //分页器大小变化
        pnSizeChange(val){
            this.currentPageSize = val;

            const { currentPage, search_input } = this;
            
            this.getList(currentPage,val,search_input)
        },
        //分页器页码改变
        pnCurrentChange(val){
            this.currentPage = val;

            const { currentPageSize, search_input } = this;

            this.getList(val,currentPageSize,search_input)
        },
        //input输入框change事件
        inputChange(val){
            this.search_input = val;
        },
        //input输入框enter事件
        inputSubmit(e){
            const { currentPage, currentPageSize, search_input } = this;

            this.currentPage = 1;
            this.getList(1,currentPageSize,search_input)

        },
        //冻结&解冻
        deleteRow(row,index){

            this.$confirm('确认删除'+row.configRoleName+'?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                api.deleteUserTemp({},row.id).then(res => {
                    if(res.success){

                        this.$message({
                            type: 'success',
                            message: '操作成功!'
                        });
                        //之后优化为本地删除
                        const { totalPages, currentPage, currentPageSize, search_input } = this;
                        const currentPageNo = common.checkJumpLastPage(totalPages,currentPageSize,currentPage);

                        this.getList(currentPageNo,currentPageSize,search_input)
                    }else{
                        this.$message({
                            type: 'error',
                            message: res.message
                        });
                    }
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消操作'
                });
            });
        },
    }
}
</script>

<style lang="scss">
    .top-s-c{
        padding: 0px 30px;
        .search{
            width: 250px;
        }
        .t-table{
            .el-table{
                margin-top: 14px;
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
    }
</style>
