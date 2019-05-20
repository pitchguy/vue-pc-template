<template>
    <div 
        v-loading="isLoad"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        class="vk-tree-ct"
    >
            <el-aside class="l-tree" width="200px">
                <p>万科集团架构</p>
                <el-tree
                    :data="treeData"
                    :props="defaultTreeProps"
                    node-key="orgId"
                    :default-expanded-keys="expandedKey"
                    empty-text="暂无数据"
                    @node-click="treeNodeClick">
                </el-tree>
            </el-aside>
            <el-main>
                <div class="top-s-c">
                    <div>
                        <el-input
                            class="search"
                            placeholder="输入姓名/手机号/域账号"
                            v-model="search_input"
                            @change="inputChange"
                            @keyup.enter.native="inputSubmit"
                        >
                            <i slot="prefix" class="el-input__icon el-icon-search"></i>
                        </el-input>
                        <el-button icon="el-icon-search" plain @click="inputSubmit" type="primary" style="height:31px;">搜索</el-button>
                        <el-button style="float:right;background:#5A8CFF;" v-if="userAddPerm" type="primary" @click="addNewUser">新增人员</el-button>
                    </div>

                    <div class="t-table">
                        <el-table
                            highlight-current-row
                            :max-height="tableMaxHeight"
                            :data="tableData"
                        >
                            <el-table-column prop='userCn' label='姓名' width="80" />
                            <el-table-column prop='adAccount' label='域账号' width="100" />
                            <el-table-column prop='orgName' label='所在机构' width="110" />
                            <el-table-column prop='phone' label='联系电话' width="100" />
                            <el-table-column 
                                prop='roleVoList' 
                                label='所属角色' 
                            >
                                <template slot-scope="scope">
                                    <el-tag
                                        v-for="item of scope.row.roleVoList"
                                        :key="item.roleName"
                                        type="success"
                                        disable-transitions
                                        style="margin: 3px;"
                                    >{{item.roleName}}</el-tag>
                                </template>
                            </el-table-column>
                            <el-table-column prop="aliyunAccount" label="所属阿里云子账号" />
                            <el-table-column fixed="right" label="操作">
                                <template slot-scope="scope">
                                    <div v-if="scope.row.isCurrent==false" class="action-ct">
                                        <span v-if="userGrantPerm" class="boe-btn" @click="getAuthor(scope.row,scope.$index)">授权</span>
                                        <span v-if="userLockPerm" class="boe-btn">
                                            <span v-if="scope.row.locked==1" @click="setFrozen(scope.row,scope.$index)">取消冻结</span>
                                            <span v-else @click="setFrozen(scope.row,scope.$index)">冻结</span>
                                        </span>
                                        <span v-if="delPerm" class="boe-btn" @click="deleteUser(scope.row,scope.$index)">删除</span>
                                    </div>
                                    <div v-else></div>
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

            <!-- 授权dialog框 -->
            <el-dialog 
                title="角色授权" 
                :visible.sync="dialogFormVisible" 
                class="vk-tr-dialog"
                @close="clearAddForm"
            >
                <el-form :model="selectForm" :name="selectForm" ref="selectForm" :rules="rules" label-width="100px">
                    <el-form-item label="已选角色：" :label-width="formLabelWidth">
                        <el-tag
                            v-for="tag in selectedTags"
                            :key="tag.id"
                            closable
                            type="success"
                            @close="closeUserAction(tag)"
                            style="margin:0 5px;"
                        >
                            {{tag.roleName}}
                        </el-tag>
                    </el-form-item>
                    <el-form-item label="选择角色：" prop="user" :label-width="formLabelWidth">
                        <el-select 
                            v-model="selectForm.user" 
                            multiple 
                            placeholder="请选择" 
                            @change="multiSelectChange"
                        >
                            <el-option
                                v-for="item in selectData"
                                :key="item.id"
                                :label="item.roleName"
                                :value="item.id"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="closeDialog">取 消</el-button>
                    <el-button type="primary" @click="setOk('selectForm')" :loading="assistLoading" style="background:#5A8CFF;">授 权</el-button>
                </div>
            </el-dialog>

            <!-- 新增dialog -->
            <el-dialog 
                title="新增人员" 
                :visible.sync="newAddVisible" 
                class="vk-tr-dialog"
                @close="clearNewAddForm"
            >
                <el-form :model="newAddForm" :name="newAddForm" ref="newAddForm" :rules="addRules" label-width="100px">
                    <el-form-item label="域账号：" prop="account" :label-width="formLabelWidth">
                        <el-input v-model="newAddForm.account"  placeholder="请输入域账号"></el-input>
                    </el-form-item>
                    <el-form-item label="选择所在机构：" prop="orgCode" :label-width="formLabelWidth">
                        <el-cascader
                            v-model="newAddForm.orgCode"
                            placeholder="搜索"
                            :options="treeData"
                            :props="defaultSearchProps"
                            filterable
                            change-on-select
                            @change="cascaderChange"
                        ></el-cascader>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="closeAddDialog">取 消</el-button>
                    <el-button type="primary" @click="addSetOk()" :loading="sureLoading" style="background:#5A8CFF;">确 定</el-button>
                </div>
            </el-dialog>
        </div>
</template>
<script>
import moment from "moment";
import api from "@/api/index.js";
import localDb from '@/utils/localDb';
import common from '@/constants/common';
import { mapState } from 'vuex';
import { isEmpty, isNull, findIndex, remove, cloneDeep } from 'lodash';

export default {
    data(){
        return{
            isLoad: true,
            userGrantPerm: true,
            userLockPerm: true,
            delPerm: true,
            userAddPerm: true,
            selectedTags: [],//已选标签tags
            orgId: '',
            search_input: '',
            tableData: [],
            treeData: [],
            expandedKey: [],
            changeUser: '',
            currentPage: 1,
            currentPageSize: 10,
            totalPages: 100,
            sureLoading: false,
            assistLoading: false,
            newAddVisible: false,
            dialogFormVisible: false,
            formLabelWidth: '150px',
            selectForm: {
                user: []
            },
            newAddForm: {
                account: '',
                orgCode: []
            },
            rules: {
                user: [
                    { required: false, message: '请选择至少一个角色', trigger: 'change' },
                ],
            },
            addRules: {
                account: [
                    { required: true, message: '请输入域账号', trigger: 'trigger' },
                ],
                orgCode: [
                    { required: true, message: '请选择所在机构', trigger: 'trgger' }
                ]
            },
            selectData: [],
            alwayData: [],
            defaultTreeProps: {
                children: 'childOrgs',
                label: 'orgName'
            },
            defaultSearchProps: {
                children: 'childOrgs',
                label: 'orgName',
                value: 'orgId'
            },
        }   
    },
    computed: {
        tableMaxHeight(){
            return window.innerHeight - 250
        },
        userInfo(newVal){
            return this.$store.state.home.userInfo;
        },
    },
    created(){
        const { currentPage, currentPageSize, search_input, userInfo } = this;

        this.userGrantPerm = common.permCheck('user_grant');
        this.userLockPerm = common.permCheck('user_lock');
        this.delPerm = common.permCheck('user_del');
        this.userAddPerm = common.permCheck('user_add');
        


        this.orgId = localDb.get('orgId')?localDb.get('orgId'):this.userInfo.orgId;
        this.expandedKey = localDb.get('orgId')?[localDb.get('orgId')]:[this.userInfo.orgId];
        this.getOrgTree();
        this.getUserList(localDb.get('orgId'),currentPage,currentPageSize,search_input);
        this.getUserListT(localDb.get('orgId'),currentPage,currentPageSize,search_input);
    },
    mounted(){
    },
    methods: {
        //清除授权form
        clearAddForm(){
            this.$set(this,'selectData', this.alwayData);
            this.selectForm = Object.assign({}, this.selectForm, {
                user: [],
            })
            this.$refs.selectForm.resetFields();
        },
        //清除新增人员form
        clearNewAddForm(){
            this.newAddForm = Object.assign({}, this.newAddForm, {
                account: '',
                orgCode: []
            })
            this.$refs.newAddForm.resetFields();
        },
        //获取角色组织树
        getOrgTree(){
            api.constructTree({}).then(res => {
                if(res.success){
                    this.treeData = res.data;
                }else{
                    this.$message.error(message);
                }
            })
        },
        //联级选择
        cascaderChange(val){
            this.newAddForm.orgCode = val;
        },
        //下拉角色列表
        getUserList(){
            api.userDropDownlist({}).then(ret => {
                if(ret.success){
                    this.selectData = ret.data;
                    this.alwayData = _.cloneDeep(ret.data);
                    
                }else{
                    this.$notify({
                        title: ret.success?'成功':'错误',
                        message: ret.message,
                        type: ret.success?'success':'error'
                    });
                }
            })
        },
        //获取人员列表
        getUserListT(orgId,pageNo,pageSize,search){
            api.getUserListT({
                orgId,
                pageNo,
                pageSize,
                search
            }).then(ret => {
                if(ret.success){
                    const { total, data } = ret.data;

                    data.forEach(res => {if(isNull(res.aliyunAccount)){res.aliyunAccount = '—'}})
                    this.isLoad = false;
                    this.tableData = data
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
        //新增人员
        addNewUser(){
            this.newAddVisible = true;
        },
        //input输入框change事件
        inputChange(val){
            this.search_input = val;
        },
        //input输入框enter事件
        inputSubmit(e){
            const { orgId, currentPage, currentPageSize, search_input, userInfo } = this;

            this.isLoad = true;
            this.currentPage = 1;
            this.getUserListT(orgId,1,currentPageSize,search_input);

        },
        //树点击
        treeNodeClick(data) {
            this.orgId = data.orgId;

            const { orgId, currentPage, currentPageSize, search_input } = this;

            this.getUserListT(data.orgId, currentPage, currentPageSize, search_input)
        },
        //授权打开dialog
        getAuthor(row){
            const { orgId, currentPage, currentPageSize, search_input } = this;
            let intersectionSet = this.selectData.filter(x => _.findIndex(row.roleVoList,x)<0);

            this.$set(this,'selectData',intersectionSet);
            this.$set(this,'selectedTags',row.roleVoList);
            this.$set(this,'changeUser',row.username);
            this.dialogFormVisible = true;
        },
        //冻结&解冻
        setFrozen(item,index){
            this.$confirm(item.locked==0?'确认冻结'+item.userCn+'\n\r(冻结后该人员将无法登陆系统)?':'确认解冻'+item.userCn+'\n\r(解冻后该人员可正常登陆系统)?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                api.toggleLockUser({
                    username: item.username,
                    lockStatus: item.locked==0?1:0
                }).then(res => {
                    if(res.success){
                        const { orgId, currentPage, currentPageSize, search_input} = this;

                        this.getUserListT(orgId,1,currentPageSize,search_input)
                        this.$message({
                            type: 'success',
                            message: '操作成功!'
                        });

                    }else{
                        this.$message({
                            type: 'error',
                            message: ret.message
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
        //删除人员
        deleteUser(row,index){
            this.$confirm('确认删除人员?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.isLoad = true;
                api.deleteUserJS({},row.username).then(res => {
                    if(res.success){
                        const { orgId, currentPage, currentPageSize, search_input} = this;

                        this.$message({
                            type: 'success',
                            message: '操作成功!'
                        });

                        this.getUserListT(localDb.get('orgId'),1,currentPageSize,search_input);
                    }else{
                        this.$message({
                            type: 'error',
                            message: ret.message
                        });
                        this.isLoad = false;
                    }
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消操作'
                });
            })
        },
        //分页器大小变化
        pnSizeChange(val){
            this.currentPageSize = val;

            const { orgId, currentPage, currentPageSize, search_input } = this;
            
            this.isLoad = true;
            this.getUserListT(orgId,currentPage,val,search_input);
        },
        //分页器页码改变
        pnCurrentChange(val){
            this.currentPage = val;

            const { orgId, currentPage, currentPageSize, search_input } = this;
            
            this.isLoad = true;
            this.getUserListT(orgId,val,currentPageSize,search_input);
        },
        // 关闭弹窗
        closeDialog(){
            this.clearAddForm();
            this.dialogFormVisible=false;
        },
        //关系新增弹窗
        closeAddDialog(){
            this.clearNewAddForm();
            this.newAddVisible=false;
        },
        //橘色授权框选值改变
        multiSelectChange(val){
            this.selectForm.user = val;
        },
        //删除已有角色
        closeUserAction(val){
            //删除时增加option到已选角色数组中
            const deleteObj = [{id: val.id, roleName: val.roleName}];
            let intersectionSet = this.selectedTags.filter(x => x.id!=val.id)
            
            this.$set(this,'selectedTags',intersectionSet);
            this.$set(this,'selectData',this.selectData.concat(deleteObj));
        },
        //授权
        setOk(name){
            this.$refs['selectForm'].validate((valid) => {
                if (valid) {
                    const { user } = this.selectForm;

                    this.assistLoading = true;
                    api.relUser({
                        roleIds: user.concat(this.selectedTags.map(res => res.id)),
                        username: this.changeUser
                    }).then(res => {
                        if(res.success){
                            const { orgId, currentPage, currentPageSize, search_input } = this;

                            this.isLoad = true;
                            this.dialogFormVisible = false;
                            this.getUserListT(orgId,currentPage,currentPageSize,search_input);
                        }else{}
                        this.assistLoading=false;
                        this.$notify({
                            title: res.success?'成功':'错误',
                            message: res.message,
                            type: res.success?'success':'error'
                        });
                    })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        //新增角色授权确定
        addSetOk(){
            this.$refs['newAddForm'].validate((valid) => {

                if(valid){
                    this.sureLoading = true;
                    const  { account, orgCode } = this.newAddForm;
                    
                    api.addNewUserT({
                        adName: account,
                        orgCode: orgCode[orgCode.length - 1],
                    }).then(res => {
                        if(res.success){
                            const { orgId, currentPage, currentPageSize, search_input } = this;

                            this.isLoad = true;
                            this.newAddVisible = false;
                            this.sureLoading = false;
                            this.getUserListT(orgId,currentPage,currentPageSize,search_input);
                        }else{
                            this.sureLoading = false;
                        }
                        this.$notify({
                            title: res.success?'成功':'错误',
                            message: res.message,
                            type: res.success?'success':'error'
                        });
                    })
                }
            })
        }
    }
}
</script>
<style lang="scss">
    .vk-tree-ct{
        display: flex;
        width: 100%;
        margin: 20px;
        background: #FFF;
        .l-tree{
            border-right: 1px solid #E8E8E8;
            p{
                font-size: 14px;
                color: #333333;
                padding: 20px 12px;
            }
            .el-tree{
                padding: 0 5px;
                margin: 10px 0;
                .is-current{
                    color: #6292FF;
                    font-weight: bold;
                    background-color: #F0F5FF;
                }
            }
        }
        .top-s-c{
            padding: 10px 20px 0 20px;
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
                    padding: 20px 0 x 0;
                    .el-pagination.is-background .el-pager li:not(.disabled).active{
                        background: rgb(90, 140, 255);
                    }
                }
            }
        }
        .vk-tr-dialog{
            .el-select{
                width: 90%;
            }
            .el-cascader{
                width: 100%;
            }
        }
    }
</style>
