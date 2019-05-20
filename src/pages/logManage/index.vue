<template>
    <el-container class="vk-log-ct">
        <el-header>
            <el-input
                clearable
                class="search"
                row-key="key"
                placeholder="请输入用户名/域账号过滤"
                v-model="search_input"
                @change="inputChange"
                @keyup.enter.native="inputSubmit"
            >
                <i slot="prefix" class="el-input__icon el-icon-search"></i>
            </el-input>
            <el-button 
                plain
                type="primary"
                icon="el-icon-search" 
                style="height:31px;"
                @click="inputSubmit"
            >搜索</el-button>
            <el-date-picker
                class="date-range"
                v-model="dateValue"
                type="daterange"
                align="right"
                :clearable="false"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="pickerOptions"
                @change="pickerChange"
            >
            </el-date-picker>
        </el-header>
        <el-main>
            <el-table
                ref="logTable"
                :max-height="tableMaxHeight"
                tooltip-effect="dark"
                highlight-current-row
                v-loading="table_loading"
                :data="log_table_data"
            >
                <el-table-column prop='usercn' label='用户名' />
                <el-table-column prop='adaccount' label='域账号' />
                <el-table-column prop='orgName' label='所属机构' />
                <el-table-column prop='action' label="操作类型" />
                <el-table-column prop="actionResult" label="操作结果">
                    <template slot-scope="scope">
                        <el-tag type="success">{{scope.row.actionResult?'成功':'失败'}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="opTime" label="操作时间" />
                <el-table-column fixed="right" label="操作">
                    <template slot-scope="scope">
                        <el-button
                            size="mini"
                            type="primary"
                            plain
                            @click="seeDetail(scope.row,scope.$index)"
                        >
                        详情
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="t-page">
                <el-pagination
                    background
                    :page-sizes="[10, 20, 30, 40]"
                    layout="total, prev, pager, next, sizes, jumper"
                    :total="pageTotal"
                    :page-size="pageSize"
                    :current-page.sync="currentPage"
                    @size-change="pnSizeChange"
                    @current-change="pnCurrentChange"
                >
                </el-pagination>
            </div>
        </el-main>
        <!-- 详情页面 -->
        <log-detail @close="dialogClose" :message="showMessage" :dialogVisible="dialogVisible" />
    </el-container>
</template>

<script>
import api from '@/api/';
import moment from 'moment';
import { findIndex, indexOf, isNull } from 'lodash';
import logDetail from './logDetail';//log详情窗口

export default {
    components: {
        "log-detail": logDetail,
    },
    data(){
        return{
            search_input: '',
            showMessage: {},
            table_loading: false,
            dateValue: [moment().format('YYYY-MM-DD'),moment().format('YYYY-MM-DD')],
            dialogVisible: false,
            log_table_data: [],
            pageTotal: 0,
            pageSize: 10,
            currentPage: 1,
            pickerOptions: {
                disabledDate: (time) => {
                    return time.getTime() > Date.now();
                },
                shortcuts: [{
                    text: '最近一周',
                    onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                    picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近一个月',
                    onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                    picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近三个月',
                    onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                    picker.$emit('pick', [start, end]);
                    }
                }]
            }
        }
    },
    mounted(){
        const { dateValue } = this;

        this.getDtLogList(dateValue[0],dateValue[1],'',1,10);
    },
    computed: {
        tableMaxHeight(){
            return window.innerHeight - 270
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
        //获取log列表
        getDtLogList(stime,etime,search,pageNo,pageSize){
            api.dtLogList({
                stime,
                etime,
                search,
                pageNo,
                pageSize
            }).then(res => {
                if(res.success){
                    this.log_table_data = res.data.data;
                    this.pageTotal = res.data.total;
                    this.table_loading = false;
                }else{
                    this.table_loading = false;
                    this.commonAlert(res); 
                }
            })
        },
        /** 
         * 关闭下级弹窗
        */
        dialogClose(val){
            this.dialogVisible = false;
        },
        /** 
         * 搜索框变化
        */
        inputChange(val){
            this.search_input = val;
        },
        /** 
         * 搜索框输入变化
        */
        inputSubmit(e){
            const { dateValue, search_input, currentPage, pageSize } = this;

            this.table_loading = true;
            this.currentPage = 1;
            this.getDtLogList(dateValue[0],dateValue[1],search_input,1,pageSize);
        },
        /** 
         * 时间选择器变化
        */
        pickerChange(val){
            this.table_loading = true;
            this.dateValue = [moment(val[0]).format('YYYY-MM-DD'),moment(val[1]).format('YYYY-MM-DD')]
            this.getDtLogList(moment(val[0]).format('YYYY-MM-DD'),moment(val[1]).format('YYYY-MM-DD'),'',1,10);
        },
        /** 
         * 列表详情
        */
        seeDetail(row,index){
            this.dialogVisible = true;
            this.showMessage = row;
        },
        /** 
         * 分页size改变
        */
        pnSizeChange(val){
            const { dateValue, search_input, currentPage, pageSize } = this;
            
            this.table_loading = true;
            this.pageSize = val;
            this.currentPage = 1;
            this.getDtLogList(dateValue[0],dateValue[1],search_input,1,val);
        },
        /** 
         * 分页页码改变
        */
        pnCurrentChange(val){
            const { dateValue, search_input, currentPage, pageSize } = this;

            this.table_loading = true;
            this.currentPage = val;
            this.getDtLogList(dateValue[0],dateValue[1],search_input,val,pageSize);
        }
    }   
}
</script>

<style lang="scss">
    .vk-log-ct{
        margin: 20px;
        background: #fff;
        .el-header{
            padding: 20px 28px;
            .search{
                width: 220px;
            }
            .date-range{
                float: right;
            }
        }
        .el-main{
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
