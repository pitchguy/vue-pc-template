<template>
    <div class="vk-peopleList" v-loading="table_loading">
        <div class="vk-toolGroup">
            <div>
                <i class="el-icon-edit" style="float:left;position:relative;top:9px;margin-right:10px;color:darkblue;"></i>
                <div v-show="flag" class="vk-title fl" @click="clickEdit">{{currentName}}</div>
                <el-input
                    v-show="!flag"
                    v-model="inputValue" 
                    placeholder="请输入内容" 
                    @blur="blurEdit" 
                    style="width:130px;float:left;"
                ></el-input>
            </div>
        </div>
        <el-table
            :data="tableData"
            class="vk-table"
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
                    background
                    :current-page.sync="peoplePagination.pageNo"
                    :page-size="peoplePagination.pageSize"
                    @current-change="handlePageChange"
                    layout="total, prev, pager, next, jumper"
                    :total="peoplePagination.total">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
import api from '@/api/';

export default {
    props:['tableData','peoplePagination','packageId','customerTagName'],
    data () {
        return {
            currentName: this.customerTagName,
            flag: true,
            inputValue: '',//input内容
            pageHref: window.location.origin,
            table_loading: false,
        }
    },
    created(){
    },
    mounted () {
    },
    watch: {
        customerTagName(newVal){
            this.currentName = newVal;
        },
        tableData(newVal){
            this.tableData = newVal
        },
        packageId(newVal){
            this.packageId = newVal;
        },
        peoplePagination(newVal){
            this.peoplePagination = newVal;
        }
    },
    methods: {
        /* 点击切换input */
        clickEdit(e){
            this.flag = false;
            
            this.inputValue = e.target.innerText;
        },
         /* 点击切换div */
        blurEdit(e){
            const { inputValue } = this;
            
            this.flag = true;
            
            // 这里加个判断，是否在1-16之间
            var pattern = /^[\u4E00-\u9FA5A-Za-z0-9_]{1,16}$/;
            if(inputValue==''){
                this.$message.error('请输入字符');
            }
            else {
                if(!pattern.test(inputValue)){
                    this.$message.error('请输入1-16位的中文、英文或数字')
                }
                else{
                    this.currentName = inputValue;
                    // 修改
                    api.editPackageName({
                        id: this.packageId,
                        tagName: inputValue
                    },this.packageId).then(res => {
                        if(res.success){
                            this.$message.success(res.message)
                            this.$emit('nameUpdate','reload')
                        }else{
                            this.$message.error(res.message)
                        }
                    })
                }
            }
            
        },
        /* 分页 */
        handlePageChange(val){
            this.$emit('pageChange',val)
        },
        /* 查看画像 */
        handleCheck(item){
            //TODO
            this.$router.push('/userPotrait/detail/' + item.custId)
        }
    }
}
</script>

<style lang="scss">
    .vk-peopleList{
        width:100%;

        .vk-toolGroup{
            text-align: right;
            margin-bottom:15px;
            padding: 0px;
            .vk-export{
                background: #5A8CFF;
            }
            .vk-title{
                padding: 0 5px;
                color: #5A8CFF;
                text-align:left;
                display: inline-block;
                line-height: 32px;
                // width:200px;
                // height:32px;
            }
            .vk-title:hover{
                cursor: pointer;
                background: var(--color-fill1-3,#ebecf0)!important;
                padding: 0 5px;
                // border: 1px solid transparent;
                width: 130px;
                border-radius: 5px;
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
