<template>
    <div class="vk-cus-search-list-ct">
        <div class="fl-o">
            <img 
                :src="backIcon" 
                alt="返回icon" 
                @click="() => this.$router.go(-1)"
                style="position:relative;width:17px;height:17px;top:3px;cursor:pointer;"
             />
            <span>{{title}}</span>
        </div>
        <div class="fl-t">
            <div class="header">
                <el-form>
                    <el-form-item>
                        <el-input
                            placeholder="输入姓名/手机号码"
                            v-model.trim="search_data"
                            class="search">
                            <el-button class="el-icon-search" circle @click.native.prevent="iconSearch"  slot="suffix" native-type="submit"></el-button>
                        </el-input>
                    </el-form-item>
                </el-form>
                <!-- <template v-if="componentType=='panel'">
                    <el-button 
                        v-if="exportButton"
                        type="primary"
                        @click="exportPeople"
                        style="widthy:88px;height:30px;background: #5A8CFF;border-radius: 4px;"
                    >导出人员</el-button>
                </template> -->
            </div> 
            <el-table
                ref="customTable"
                class="vk-table"
                :max-height="tableMaxHeight"
                tooltip-effect="dark"
                highlight-current-row
                v-loading="table_loading"
                :data="table_data"
            >
                <el-table-column prop='custName' label='姓名' width="120" />
                <el-table-column prop='gender' label='性别' width="120" />
                <el-table-column prop='phone' label="联系电话" width="180" />
                <el-table-column prop='address' label='居住地' />
                <el-table-column v-if="componentType=='panel'" prop='impCat' label="客户分类" width="120" />
                <el-table-column prop="products" label="购买产品" />
                <el-table-column prop="reason" label="匹配依据" />
                <el-table-column fixed="right" label="操作" width="80">
                    <template slot-scope="scope">
                        <router-link 
                            target="_blank" 
                            :to="'/userPotrait?custId=' + scope.row.custId"
                        >
                            <span style="color:#3491E0;cursor:pointer;">查看画像</span>
                        </router-link>
                    </template>
                </el-table-column>
                <template slot="empty" v-if="componentType=='global'">
                    <div class="vk-empty-div">
                        <p style="line-height:280px">该客户不存在，请重新搜索</p>
                    </div>
                </template>
                <template slot="empty" v-else>
                    <span>暂无数据</span>
                </template>
            </el-table>
            <div class="footer">
                <span class="footer-span"> 
                    <i class="el-icon-info"></i>如果找不到你想找的客户，可以到
                    <router-link to="/userPotrait" style="color:#3491E0;">客户画像</router-link>
                    试试
                </span>
                <el-pagination
                    v-if="pagination.total"
                    class="footer-pagination"
                    background
                    :page-sizes="[10, 20, 30, 40]"
                    layout="total, prev, pager, next, sizes, jumper"
                    :total="pagination.total"
                    :page-size="pagination.pageSize"
                    :current-page.sync="pagination.currentPage"
                    @size-change="pnSizeChange"
                    @current-change="pnCurrentChange"
                >
                </el-pagination>
            </div>
        </div>
    </div>
</template>
<script>
import api from '@/api';
import backIcon from '@public/assets/imgs/back.png';
import { isEmpty, isUndefined } from 'lodash';
import common from '@/constants/common';

export default {
    data(){
        return{
            backIcon,
            title: '',
            table_loading: false,
            componentType: '',//组件type
            search_data: '',//搜索框值
            table_data: [],
            class1code: '',
            class2code: '',
            pagination: {
                total: 0,
                pageSize: 10,
                currentPage: 1
            }
        }
    },
    created(){
        
    },
    mounted(){
        const query = this.$router.history.current.query;

        if(isEmpty(query)){
            this.$router.push('/404');
        }else if(query.type=='global'){
            this.title = query.title;
            this.search_data = query.search_data;
            this.componentType = query.type;//用于区分全局搜索进入和点击模块进入
        }else{
            this.title = query.title;
            this.componentType = query.type;//用于区分全局搜索进入和点击模块进入
        }
    },
    watch: {
        componentType(newVal){
            const query = this.$router.history.current.query;
            const { currentPage, pageSize } = this.pagination;
            
            this.table_loading = true;
            if(newVal=='global'){
                this.importCusSearchAction(query.search_data,currentPage,pageSize);
            }else if(newVal=='panel'){
                this.class1code = query.code1;
                this.class2code = query.code2;
                this.importPanelSearchAction(query.code1,query.code2,query.search_data,currentPage,pageSize)   
            }       
            
        }
    },
    computed: {
        tableMaxHeight(){
            return window.innerHeight - 270
        },
        exportButton(){
            return common.permCheck('imp_user_export')
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
        //重点客户搜索
        importCusSearchAction(keyword,pageNo,pageSize){
            api.importCusSearch({
                keyword,
                pageNo,
                pageSize
            }).then(res => {
                if(res.success){
                    this.table_loading = false;
                    this.table_data = res.data.data;
                    this.pagination.total = res.data.total;
                }else{
                    this.table_loading = false;
                    this.commonAlert(res);
                }
            })
        },
        //点击panel搜索
        importPanelSearchAction(class1code,class2code,keyword,pageNo,pageSize){
            api.importPanelSearch({
                class1code,
                class2code,
                keyword,
                pageNo,
                pageSize
            }).then(res => {
                if(res.success){
                    this.table_loading = false;
                    this.table_data = res.data.data;
                    this.pagination.total = res.data.total;
                }else{
                    this.table_loading = false;
                    this.commonAlert(res);
                }
            })
        },
        /** 
         * 搜索框
        */
        iconSearch(){
            const { currentPage, pageSize } = this.pagination;
            const { search_data, componentType, class1code, class2code } = this;
            
            this.pagination.currentPage = 1;
            if(componentType=='global'){
                //重点客户搜索
                this.importCusSearchAction(isUndefined(search_data)?'':search_data,1,pageSize);
            }else if(componentType=='panel'){
                //各纬度客户搜索
                this.importPanelSearchAction(class1code,class2code,isUndefined(search_data)?'':search_data,1,pageSize);
            }
        },
        /** 
         * 查看用户画像
        */
        seeUserPotrait(row,index){
            this.$router.push('/userPotrait/detail/' + row.custId)
        },
        /** 
         * 导出人员
        */
        exportPeople(){
            const { class1code, class2code } = this;

            api.importCusExport({
                class1code,
                class2code,
            }).then(res => {
                    var blob = new Blob([res], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
                    var objectUrl = URL.createObjectURL(blob);
                    var a = document.createElement("a");
                    document.body.appendChild(a);
                    a.style = "display: none";
                    a.href = objectUrl;
                    a.download = '人员列表';
                    a.click();
                    document.body.removeChild(a);
            })
        },
        /** 
         * 分页size改变
        */
        pnSizeChange(val){
            const { total, pageSize, currentPage } = this.pagination;
            const { search_data, componentType, class1code, class2code } = this;
            
            this.table_loading = true;
            this.pagination.pageSize = val;
            this.pagination.currentPage = 1;
            if(componentType=='global'){
                this.importCusSearchAction(isUndefined(search_data)?'':search_data,1,val);
            }else if(componentType == 'panel'){
                this.importPanelSearchAction(class1code,class2code,isUndefined(search_data)?'':search_data,1,val);
            }
        },
        /** 
         * 分页页码改变
        */
        pnCurrentChange(val){
            const { total, pageSize, currentPage } = this.pagination;
            const { search_data, componentType, class1code, class2code } = this;

            this.table_loading = true;
            this.pagination.currentPage = val;
            if(componentType=='global'){
                this.importCusSearchAction(isUndefined(search_data)?'':search_data,val,pageSize);
            }else if(componentType == 'panel'){
                this.importPanelSearchAction(class1code,class2code,isUndefined(search_data)?'':search_data,val,pageSize);
            }
        }
    }
}
</script>
<style lang="scss">
    .vk-cus-search-list-ct{
        padding: 10px 20px;
        .fl-o{
            padding-bottom: 10px;
        }
        .fl-t{
            padding: 15px 25px;
            background: #FFF;
            .header{
                display: flex;
                justify-content: space-between;
                .search{
                    width:263px;
                    .el-icon-search{
                        background-color:transparent;
                        border:none;
                    }
                }
            }
            .vk-table{
                border: 1px solid #dddddd;
                thead{
                    th{
                        background: #FAFAFA;
                        font-size: 14px;
                        color: #333333;
                        letter-spacing: 0;
                    }
                }
                tbody{
                    td{
                        font-size: 14px;
                        color:#333333;
                    }
                }
                .vk-empty-div{
                    height: 300px;
                    font-size: 14px;
                }
            }
            .footer{
                display: flex;
                justify-content: space-between;
                align-items: center;
                .footer-span{
                    font-size: 13px;
                    padding: 23px 0;
                }
                .footer-pagination{
                    text-align: right;
                    padding: 23px 0;
                    .el-pager{
                        li:not(.disabled).active{
                            background-color: #508aff;
                        }
                    }
                }
            }   
        }
    }
</style>
