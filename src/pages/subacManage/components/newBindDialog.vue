<template>
    <!-- 绑定人员 -->
        <div>
            <div class="inside-ul">
                <el-input
                    class="search"
                    style="width:50%;"
                    placeholder="输入姓名/账号搜索/手机号搜索"
                    v-model="search_input"
                    @change="inputChange"
                    @keyup.enter.native="inputSubmit"
                >
                </el-input>
                <el-button class="common-button" type="primary" icon="el-icon-search" style="float:right;" @click="buttonSubmit">搜索</el-button>
            </div>
            <div class="t-table" v-if="ifShow">
                <el-table
                    highlight-current-row
                    :data="user_t_data"
                >
                    <el-table-column prop='userCn' label='姓名' />
                    <el-table-column prop='adAccount' label='域账号' />
                    <el-table-column prop='userPhone' label='联系电话' />
                    <el-table-column fixed="right" label="操作">
                        <template slot-scope="scope">
                            <span class="boe-btn" @click="bindAct(scope.row,scope.$index)">绑定</span>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="t-page">
                    <el-pagination
                        v-if="insideTotal"
                        background
                        @current-change="pnCurrentChange"
                        :current-page="currentPage"
                        layout="total, prev, pager, next"
                        :total="insideTotal">
                    </el-pagination>
                </div>
            </div>
        </div>
</template>
<script>
import api from '@/api/';
import common from '@/constants/common';

export default {
    props:{
        bindId: Number,
    },
    data(){
        return{
            ifShow: false,
            search_input: '',
            user_t_data: [],
            bindType: false,
            currentPage: 1,
            insideTotal: 1,
        }
    },
    methods: {
        //获取需要绑定人员列表
        getList(search,currentPage,type){
            api.aliyunUnbindList({
                aliyunId: this.bindId,
                pageNo: currentPage,
                pageSize: 10,
                search: search
            }).then(res => {
                if(res.success){
                    if(res.data.data.length == 0&&type=='unbind'){
                        this.$message.error('此用户不存在或已绑定其他子账号');
                    }
                    this.user_t_data = res.data.data;
                    this.insideTotal = res.data.total;
                }else{
                    this.$message.error(res.message);
                }
            })
        },
        //input输入框change事件
        inputChange(val){
            this.search_input = val;
        },
        //input输入框enter事件
        inputSubmit(e){
            this.ifShow = true;
            this.currentPage = 1;
            this.search_input = e.target.value;
            this.getList(e.target.value,1,'unbind');
        },
        //按钮点击搜索
        buttonSubmit(){
            const { search_input, currentPage } =this;

            this.ifShow = true;
            this.currentPage = 1;
            this.getList(search_input,1,'unbind');
        },
        //绑定操作
        bindAct(row,index){
            api.aliyunBindAction({
                aliyunId: this.bindId,
                username: row.userName
            }).then(res => {
                if(res.success){
                    const { search_input, currentPage, insideTotal } =this;

                    this.getList(search_input,common.checkJumpLastPage(insideTotal,10,currentPage));
                }else{}

                this.$notify({
                    title: res.success?'成功':'错误',
                    message: res.message,
                    type: res.success?'success':'error'
                });
            })
        },
        //表格页码改变
        pnCurrentChange(val){
            const { search_input } = this;

            this.currentPage = val;
            this.getList(search_input,val);
        }
    }
}
</script>
<style lang="scss">
    .common-button{
        background:#5A8CFF;
    }
    .vk-rp-dialog{
        .inside-ul{
            display: flex;
            padding: 15px 30px;
            justify-content: space-between;
            .search{
                width: 150%;
            }
            li:nth-child(1){
                position: relative;
                top: 10px;
            }
        }
    }
</style>
