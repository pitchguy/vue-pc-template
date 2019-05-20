<template>
    <el-container class="vk-bind-ct">
        <div class="up-fl">
            <el-input
                class="search"
                style="width:50%;"
                placeholder="输入姓名/账号搜索"
                v-model="search_input"
                @change="inputChange"
                @keyup.enter.native="inputSubmit"
            >
                <i slot="prefix" class="el-input__icon el-icon-search"></i>
            </el-input>
            <el-button class="common-button" type="primary" icon="el-icon-search" style="float:right;" @click="buttonSubmit">搜索</el-button>
        </div>
        <div class="down-tb">
            <el-table
                highlight-current-row
                :data="tableData"
            >
                <el-table-column prop='userCn' label='姓名' />
                <el-table-column prop='adAccount' label='域账号' />
                <el-table-column fixed="right" label="操作">
                    <template slot-scope="scope">
                        <span class="boe-btn" @click="rebindAct(scope.row,scope.$index)">解绑</span>
                    </template>
                </el-table-column>
            </el-table>
            <div class="t-page">
                <el-pagination
                    v-if="totalPages"
                    background
                    @current-change="pnCurrentChange"
                    :current-page.sync="currentPage"
                    :page-size="currentPageSize"
                    layout="total, prev, pager, next"
                    :total="totalPages">
                </el-pagination>
            </div>
        </div> 

        
    </el-container>
</template>

<script>
import api from '@/api/';
import common from '@/constants/common';

export default {
    props:['visible','bindId'],
    data(){
        return{
            nowType: '',
            search_input: '',
            inside_search_input: '',
            currentPageSize: 10,
            tableData: [],
            currentPage: 1,
            insidePage: 2,
            totalPages: 0,
            insideTotal: 0,
            dialogFormVisible: false
        }
    },
    mounted(){
            const { search_input, currentPage } = this;
            
            this.getAliyunBindList(search_input,currentPage)
    },
    watch: {
        visible(newVal){
            if(newVal){
                const { search_input, currentPage } = this;

                this.tableData = [];
                this.totalPages = 1;
                this.getAliyunBindList(search_input,currentPage)
            }
        }
    },
    methods: {
        //清楚form默认数据
        clearForm(){
            this.ruleForm = Object.assign({}, this.ruleForm, {
                account: '',
                ackey: '',
                acsc: '',
                desc: ''
            })
            this.$refs.ruleForm.clearValidate();
        },
        //获取已绑定阿里云子账号列表
        getAliyunBindList(search,currentPage){
            api.aliyunBindList({
                aliyunId: this.bindId,
                pageNo: currentPage,
                pageSize: 10,
                search: search
            }).then(res => {
                if(res.success){
                    this.tableData = res.data.data;
                    this.totalPages = res.data.total;
                }else{
                    this.$message.error(res.message);
                }
            })
        },
        //子账号管理列表搜索
        inputChange(val){
            this.search_input = val;
        },
        //input输入框enter事件
        inputSubmit(e){
            const { currentPageSize, search_input } = this;

            this.currentPage = 1;
            this.search_input = e.target.value;
            this.getAliyunBindList(e.target.value,1);

        },
        //button输入框enter
        buttonSubmit(){
            const { currentPage, currentPageSize, search_input } = this;

            this.getAliyunBindList(search_input,currentPage);
        },
        //新建&编辑子账号
        openDialog(type,row,index){
            this.nowType = type;

            if(type == 'new'){
                this.clearForm();
            }else{
                this.$refs.ruleForm.clearValidate();
                this.ruleForm = Object.assign({}, this.ruleForm, {
                    account: row.account,
                    ackey: row.accessKey,
                    acsc: row.accessSecret,
                    desc: row.desc
                })
            }

            this.dialogFormVisible = true;
        },
        //解除绑定
        rebindAct(row,index){
            api.aliyunUnbindAction({},row.id).then(res => {
                if(res.success){
                    const { currentPage, currentPageSize, totalPages, search_input } = this;

                    this.getAliyunBindList(search_input,common.checkJumpLastPage(totalPages,10,currentPage));
                }else{
                }

                this.$notify({
                    title: res.success?'成功':'错误',
                    message: res.message,
                    type: res.success?'success':'error'
                });
            })
        },
        //分页器页码改变
        pnCurrentChange(val){
            const { search_input } = this;

            this.currentPage = val;
            this.getAliyunBindList(search_input,val)
        },
    }
}
</script>

<style lang="scss">
    .common-button{
        background:#5A8CFF;
    }
    .vk-bind-ct{
        margin: 20px;
        background: #fff;
        display: block;
        .up-fl{
            padding: 20px 30px;
        }
        .down-tb{
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
            }
            .t-page{
                text-align: right;
                padding: 26px 0 31px 0;
                .el-pagination.is-background .el-pager li:not(.disabled).active{
                    background: rgb(90, 140, 255);
                }
            }
        }
    }
</style>
