<template>
    <div class="vk-peopleLists">
        <el-table
            :data="tableData"
            class="vk-table"
            v-loading="tableLoading"
        >
            <el-table-column
                prop="custName"
                align="center"
                label="客户名称">
            </el-table-column>
            <el-table-column
                prop="custGender"
                align="center"
                label="性别">
            </el-table-column>
            <el-table-column
                prop="custPhone"
                align="center"
                label="联系电话">
            </el-table-column>
            <el-table-column
                prop="custAddress"
                align="center"
                label="现居地">
            </el-table-column>
             <el-table-column
                align="center"
                label="操作">
                <template slot-scope="scope">
                    <router-link 
                        target="_blank" 
                        :to="'/userPotrait?custId=' + scope.row.custId"
                    >
                        <el-button type="text" size="small">查看画像</el-button>
                    </router-link>  
                </template>
            </el-table-column>
        </el-table>
        <div class="footer-page clearfix">
            <div class="fr">
                <el-pagination
                    v-if="total"
                    background
                    :current-page.sync="pagation.pageNo"
                    :page-size="pagation.pageSize"
                    @current-change="handlePageChange"
                    layout="total, prev, pager, next"
                    :total="total">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
import api from '@/api/';
import { isEmpty } from 'lodash';

export default {
    data () {
        return {
            buttonLoading: false,
            tableLoading: false,
            pagation:{
                pageNo:1,
                pageSize:10,
            }
        }
    },
    props:['data','tableData','total'],
    created(){
        
    },
    mounted () {
        
    },
    watch: {
        data(newVal){
            this.data = newVal;
            
            this.$nextTick(function(){
                setTimeout(() => {this.tableLoading = false},1000)
            })
        }
    },
    methods: {
        /* 导出 */
        handleExport(){
            this.buttonLoading = true;
            const { data, tableData } = this;

            if(isEmpty(tableData)){
                this.$message.warning('当前人员列表没有人员');
                this.buttonLoading = false;
            }else{
                api.getCusExportXcl(
                    data.map(res => {
                        return {
                            class1Id: res.class1Id,
                            class2Id: res.refCode,
                            tagId: res.id
                        }
                    })
                ).then(res => {
                    var blob = new Blob([res], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
                    var objectUrl = URL.createObjectURL(blob);
                    var a = document.createElement("a");
                    document.body.appendChild(a);
                    a.style = "display: none";
                    a.download = '客群人员';
                    a.href = objectUrl;
                    a.click();
                    document.body.removeChild(a);
                    this.buttonLoading = false;
                })
            }
            //TODO
        },
        /* 分页 */
        handlePageChange(){
            this.$emit('pageChange',this.pagation)
        },
        /* 查看画像 */
        handleCheck(item){
            //TODO
            this.$router.push('/userPotrait/detail/' + item.custId);
        }
    }
}
</script>

<style lang="scss" scoped>
    .vk-peopleLists{
        width:100%;

        .vk-toolGroup{
            padding:0 30px;
            text-align: right;
            margin-bottom:15px;
            .vk-export{
                background: #5A8CFF;
            }
        }
        .vk-table{
            border-top:1px solid #dddddd;
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
        }
        .footer-page{
            padding:10px 0;
            .el-pagination.is-background{
                button.btn-prev,button.btn-next{
                    background-color:#fff;
                }
                .el-pager li:not(.active){
                    background-color:#fff;
                }
            }
        }
    }
</style>
