<template>
    <div class="content vk-groupManage">
        <div class="vk-toolGroup">
            <el-form>
                <el-form-item>
                    <el-input
                        placeholder="输入客群包名/姓名/域账号搜索"
                        v-model.trim="searchKey"
                        class="search">
                        <!-- <el-button class="el-icon-search" circle @click.native.prevent="handleIconClick"  slot="suffix" native-type="submit"></el-button> -->
                    </el-input>
                </el-form-item>
            </el-form>
            <el-button icon="el-icon-search" plain @click="handleIconClick" type="primary" style="height:31px;margin-left:20px;">搜索</el-button>
        </div>
        <el-table
            v-loading="tableLoading"
            :data="tableData"
            class="vk-table"
        >
            <el-table-column
                prop="customerTagName"
                align="center"
                label="客群包名称">
                <template slot-scope="scope">
                    <boe-btn @click="showPeopleList(scope.row)">{{scope.row.customerTagName}}</boe-btn>
                </template>
            </el-table-column>
            <el-table-column
                prop="usercn"
                align="center"
                label="创建人">
            </el-table-column>
            <el-table-column
                prop="adAccount"
                align="center"
                label="域账号">
            </el-table-column>
            <el-table-column
                prop="gmtCreate"
                align="center"
                label="创建时间">
            </el-table-column>
             <el-table-column
                align="center"
                label="操作">
                <template slot-scope="scope">
                    <el-button v-if="eidtPerm" @click="handleEdit(scope.row)" type="text" size="small">编辑</el-button>
                    <i v-if="eidtPerm&&deletePerm" class="iconfont icon-split" style="color:#6292FF"></i>
                    <el-button v-if="deletePerm" @click="handleDelete(scope.row)" type="text" size="small">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="footer-page clearfix">
            <div class="fr">
                <el-pagination
                    v-if="pagation.total"
                    background
                    :page-sizes="[10, 20, 30, 40]"
                    layout="total, sizes, prev, pager, next, jumper"
                    :current-page.sync="pagation.pageNo"
                    :page-size="pagation.pageSize"
                    @current-change="pnCurrentChange"
                    @size-change="pnSizeChange"
                    :total="pagation.total">
                </el-pagination>
            </div>
        </div>
        <transition name="slide-fade">
            <div class="vk-people" v-if="showFlag">
                <div class="iconClose" @click="closePeopleList">
                    <i class="el-icon-d-arrow-right"></i>
                </div>
                <people-list 
                    :tableData="peopleList" 
                    :peoplePagination="peoplePagination" 
                    :packageId="packageId" 
                    :customerTagName="customerTagName" 
                    @pageChange="handlePageChange"
                    @nameUpdate="handleNameUpdate"
                ></people-list>
            </div>
        </transition>
    </div>
</template>

<script>
import api from '@/api/';
import moment from 'moment';
import common from '@/constants/common';
import mixins from '@/constants/mixins';
import PeopleList from './component/peopleList';

export default {
    mixins: [mixins],
    components:{
        'people-list':PeopleList,
    },
    data () {
        return {
            pagation:{
                pageNo:1,
                pageSize:10,
                total:0,
            },
            peoplePagination:{/* 人员列表 */
                pageNo: 1,
                pageSize: 10,
                total: 0
            },
            packageId: '',/* 客群包id */
            customerTagName: '',/* 客群包名称 */
            searchKey:'',/* 搜索关键字 */
            tableLoading:false,
            tableData:[],
            showFlag:false,/* 人员列表展开 */
            total:0,/* 人员列表 */
            peopleList:[],/* 人员列表 */
        }
    },
    created(){
        //客群包管理入口判断
        if(common.permCheck('user_package_view')){}
        else{this.$router.push({name: 'label-group-auth'})}
        
        this.tableLoading = true;
        this.getTableData('',10,1)
    },
    computed: {
        eidtPerm(){//编辑权限
            return common.permCheck('user_package_edit')
        },
        deletePerm(){//删除权限
            return common.permCheck('user_package_del')
        }
    },
    methods: {
        //获取客群包列表
        getTableData(name,offset,pages){
            api.cusPackageSearch({
                name,
                offset,
                pages
            }).then(res => {
                if(res.success){
                    res.data.data.forEach(res => {
                        res.gmtCreate = moment(res.gmtCreate).format('YYYY-MM-DD HH:mm:ss')
                    })
                    this.pagation.total = res.data.total;
                    this.tableData = res.data.data;
                    this.tableLoading = false;
                }else{
                    this.commonAlert(res)
                    this.pagation.total = 0;
                    this.pagation.pageNo = 1;
                    this.pagation.pageSize = 10;
                    this.tableData = [];
                    this.tableLoading = false;
                }
            })
        },
        //删除客群包
        deletePackage(id){
            api.cusPackageDelete({},id).then(res => {
                if(res.success){
                    const { searchKey } = this;
                    const { pageNo,pageSize,total } = this.pagation
                    const currentPageNo = common.checkJumpLastPage(total,pageSize,pageNo);

                    this.getTableData(searchKey,pageSize,currentPageNo);
                }else{
                    this.tableLoading = false;
                }
                this.commonAlert(res)
            })
        },
        //输入搜索
        inputSubmit(e){
            const { pageNo,pageSize } = this.pagation

            this.searchKey = e.target.value;
            this.getTableData(e.target.value,pageSize,pageNo)
        },
        //分页器大小变化
        pnSizeChange(val){
            const { searchKey } = this;
            const { pageNo } = this.pagation;
            
            this.pagation.pageSize = val;
            this.getTableData(searchKey,val,pageNo);
        },
        //分页器页码改变
        pnCurrentChange(val){
            const { searchKey } = this;
            const { pageSize } = this.pagation;

            this.pagation.pageNo = val;
            this.getTableData(searchKey,pageSize,val);
        },
        handleEdit(item){
            console.log('编辑:',item);
            this.$router.push({name:'label-whole-tags',query:{packageId: item.id,packageName: item.customerTagName}})
        },
        handleDelete(item){
            this.$confirm('确定删除该标签类别？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.tableLoading = true;
                this.deletePackage(item.id)
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
        },
        /* 搜索 */
        handleIconClick(){
            const { searchKey } = this;
            const { pageNo,pageSize } = this.pagation

            this.pagation.pageNo = 1;
            this.tableLoading = true;
            this.getTableData(searchKey,pageSize,1);
        },
        /* 人员列表分页 */
        handlePageChange(page){
            const { packageId } = this;
            const { pageNo, pageSize } = this.peoplePagination;
            console.log('page:',page);
            this.getPeopleList(packageId,page,pageSize)
        },
        /* 关闭人员列表 */
        closePeopleList(){
            this.showFlag = false;
        },
        showPeopleList(item){
            //TODO 获取人员列表数据
            const { pageNo, pageSize } = this.peoplePagination;

            this.packageId = item.id;
            this.customerTagName = item.customerTagName;
            this.getPeopleList(item.id,pageNo,pageSize);
            this.showFlag = true;
        },
        /* 人员列表 */
        getPeopleList(item,pageNo,pageSize){
            api.cusPackageList({
                pageNo,
                pageSize
            },item).then(res => {
                if(res.success){
                    res.data.data.forEach(res => {
                        res.custGender = res.custGender==1?'男':res.custGender==2?'女':'未知'
                    })
                    this.peopleList = res.data.data;
                    this.peoplePagination.total = res.data.total;
                }else{
                    this.commonAlert(res);
                }
            })
        },
        handleNameUpdate(val){
            const { searchKey } = this;
            const { pageNo,pageSize,total } = this.pagation

            if(val=='reload'){
                this.getTableData(searchKey,pageSize,pageNo)
            }
        }
    }
}
</script>

<style lang="scss">
    .vk-groupManage{
        width:100%;
        background-color:#fff;
        min-height:780px;
        height:100%;
        padding:20px 30px;
        position: relative;
        .vk-toolGroup{
            display: flex;
            margin-bottom:15px;
            .search{
                width:260px;
                .el-icon-search{
                    background-color:transparent;
                    border:none;
                }
            }
        }
        .vk-table{
            border-bottom:0;
            overflow: scroll;
            max-height: 600px;
            border:1px solid #dddddd;
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
                    *{
                        font-size:inherit;
                    }
                }
            }
        }
        .footer-page{
            padding:10px 0;
            .el-pagination.is-background .el-pager li:not(.disabled).active{
                background: rgb(90, 140, 255);
            }
            .el-pagination.is-background{
                button.btn-prev,button.btn-next{
                    background-color:#fff;
                }
                .el-pager li:not(.active){
                    background-color:#fff;
                }
            }
        }

        /* 人员列表 */
        .vk-people{
            position: absolute;
            right:0;
            top:0;
            width:80%;
            background-color:#fff;
            z-index: 1000;
            height: 100%;
            padding:15px 40px;
            box-shadow: 0 2px 6px 0 rgba(0,0,0,0.14);

            .iconClose{
                position: absolute;
                left: 0;
                top: 50%;
                background: #EEEEEE;
                border: 1px solid #DDDDDD;
                height: 50px;
                line-height: 50px;
                color: #999999;
                cursor: pointer;
            }
        }
        /* 可以设置不同的进入和离开动画 */
        /* 设置持续时间和动画函数 */
        .slide-fade-enter-active {
            transition: all .3s ease;
        }
        .slide-fade-leave-active {
            transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
        }
        .slide-fade-enter, .slide-fade-leave-to
            /* .slide-fade-leave-active for below version 2.1.8 */ {
            transform: translateX(100px);
            // opacity: 0;
        }
    }
</style>
