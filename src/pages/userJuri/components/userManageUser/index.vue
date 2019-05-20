<template>
    <el-container 
        v-loading="isLoad"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
    >
        <el-aside class="l-tree" width="240px">
            <el-tree
                :data="treeData"
                :props="defaultTreeProps"
                empty-text="暂无数据"
                node-key="orgId"
                :default-expanded-keys="expandedKeys"
                @node-click="treeNodeClick">
            </el-tree>
        </el-aside>
        <el-main>
            <div class="top-s-c">
                <el-input
                    class="search"
                    placeholder="输入角色名称/域账号进行搜索"
                    v-model="search_input"
                    @change="inputChange"
                    @keyup.enter.native="inputSubmit"
                >
                    <i slot="prefix" class="el-input__icon el-icon-search"></i>
                </el-input>
                <el-button icon="el-icon-search" plain @click="inputSubmit" type="primary" style="height:31px;">搜索</el-button>
                <el-button class="common-button" v-if="roleAddPerm" type="primary" @click="jumptoAddPage" style="float:right;">新建角色</el-button>

                <div class="t-table">
                    <el-table
                        highlight-current-row
                        :data="user_t_data"
                    >
                        <el-table-column prop='roleName' label='角色名称' />
                        <el-table-column prop='roleDesc' label='角色描述' />
                        <el-table-column prop='creatorName' label='创建人' />
                        <el-table-column prop='adAccount' label='域账号' />
                        <el-table-column prop='gmtCreate' label='创建时间' />
                        <el-table-column fixed="right" label="操作">
                            <template slot-scope="scope">
                                <div class="action-ct">
                                    <span v-if="rolEditPerm" class="boe-btn" @click="editRow(scope.row,scope.$index)">编辑</span>
                                    <span v-if="roleDelPerm" class="boe-btn" @click="deleteRow(scope.row,scope.$index)">删除</span>
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
                            :page-size="currentPageSize"
                            :page-sizes="[10, 20, 30, 40]"
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
import api from "@/api/index.js";
import localDb from '@/utils/localDb';
import common from '@/constants/common';
import { mapState } from 'vuex';

export default {
    data(){
        return{
            roleAddPerm: true,
            rolEditPerm: true,
            roleDelPerm: true,
            isLoad: true,
            orgId: '',
            search_input: '',
            user_t_data: [],
            currentPage: 1,
            dialogFormVisible: false,
            currentPageSize: 10,
            totalPages: 1,
            formLabelWidth: '120px',
            defaultTreeProps: {
                children: 'childOrgs',
                label: 'orgName'
            },
            selectForm: {
                user: ''
            },
            expandedKeys: [],
            treeData: []
        }
    },
    computed: mapState({
        userInfo: state => state.home.userInfo
    }),
    mounted(){
        const { currentPage, currentPageSize, search_input, userInfo } = this;

        
        this.roleAddPerm = common.permCheck('role_add');//新增角色权限
        this.rolEditPerm = common.permCheck('role_edit');//角色编辑权限
        this.roleDelPerm = common.permCheck('role_del');//角色删除权限

        this.orgId = localDb.get('orgId')?localDb.get('orgId'):this.userInfo.orgId;
        this.expandedKeys = localDb.get('orgId')?[localDb.get('orgId')]:[this.userInfo.orgId];
        this.getUserList(userInfo.orgId||localDb.get('orgId'),currentPage,currentPageSize,search_input);
        this.getOrgTree();
    },
    methods: {
        //获取角色组织树
        getOrgTree(){
            api.constructTree({}).then(res => {
                if(res.success){
                    this.treeData = [res.data[0]];
                }else{
                    this._vm.$message.error(message);
                }
            })
        },
        //获取角色列表
        getUserList(orgId,pageNo,pageSize,search){
            api.getUserList({
                orgId,
                pageNo,
                pageSize,
                search
            }).then(ret => {
                if(ret.success){
                    const { total, data } = ret.data;

                    data.forEach(res => {
                        res.gmtCreate = moment(res.gmtCreate).format('YYYY-MM-DD HH:mm:ss');
                    })
                    this.isLoad = false;
                    this.user_t_data = data;
                    this.totalPages = total;
                }else{
                    this.$notify({
                        title: ret.success?'成功':'错误',
                        message: ret.message,
                        type: ret.success?'success':'error'
                    });
                }
            })
        },
        //input输入框change事件
        inputChange(val){
            this.search_input = val;
        },
        //input输入框enter事件
        inputSubmit(e){
            const { orgId, currentPage, currentPageSize, search_input, userInfo } = this;

            this.currentPage = 1;
            this.getUserList(orgId,1,currentPageSize,search_input);

        },
        //树点击事件
        treeNodeClick(data){
            this.orgId = data.orgId;

            const { orgId, currentPage, currentPageSize, search_input } = this;

            this.getUserList(data.orgId, currentPage, currentPageSize, search_input)
        },
        //分页器大小变化
        pnSizeChange(val){
            this.currentPageSize = val;

            const { orgId, currentPage, currentPageSize, search_input } = this;
            
            this.getUserList(orgId,currentPage,val,search_input);
        },
        //分页器页码改变
        pnCurrentChange(val){
            this.currentPage = val;

            const { orgId, currentPage, currentPageSize, search_input } = this;
            
            this.getUserList(orgId,val,currentPageSize,search_input);
        },
        //跳转至角色新建页面
        jumptoAddPage(){
            this.$router.push('/userjuri/newUser')
            console.log('跳转到新增页面')
        },
        //编辑角色模版
        editRow(row, index){
            this.$router.push('/userjuri/newUser/' + row.id)
        },
        //冻结&解冻
        deleteRow(item,index){
            this.$confirm('确认删除'+item.roleName+'?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
            .then(() => {
                api.deleteUser({},item.id).then(res => {
                    if(res.success){
                        this.$message({
                            type: 'success',
                            message: '操作成功!'
                        });
                        
                        const { orgId, currentPage, currentPageSize, search_input, userInfo, totalPages } = this;
                        const currentPageNo = common.checkJumpLastPage(totalPages,currentPageSize,currentPage);

                        this.getUserList(orgId,currentPageNo,currentPageSize,search_input);
                    }else{
                        this.$message({
                            type: 'erroe',
                            message: res.message
                        });
                    }
                })
            })
            .catch(() => {
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
    .common-button{
        background:#5A8CFF;
    }
    .l-tree{
        min-height: 100%;;
        border-right: 1px solid #E8E8E8;
        .el-tree{
            padding: 0 18px;
            margin: 10px 0;
            .is-current{
                color: #6292FF;
                font-weight: bold;
                background-color: #F0F5FF;
            }
        }
    }
    .top-s-c{
        padding: 0px 30px;
        .search{
            width: 220px;
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
