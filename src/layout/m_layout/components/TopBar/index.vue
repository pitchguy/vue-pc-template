<template>
    <div class="vk-home-ct">
        <div class="left" @click="returnHome()">
            <!-- <span class="en-title">Vanke&nbsp;</span>  -->
            <span class="ch-title">万科数据中台</span>
        </div>
        <div class="middle">
            <el-menu
                :default-active="menuActive"
                mode="horizontal"
                @select="menuSelect"
                background-color="#21274E"
                text-color="#fff"
                active-text-color="#fff"
            >
                
                <el-menu-item 
                    v-for="item in menuData"  
                    :key="item.index"
                    :index="item.index"
                    @click="redirectTo(item.index)"
                >
                    {{item.name}}
                </el-menu-item>
            </el-menu>
        </div>
        <div class="right">
            <el-popover
                    placement="bottom-start"
                    width="400"
                    trigger="hover">
                    <el-row :gutter="20" class="row-ct-m">
                        <el-col style="padding:10px;" :span="6" v-for="item in userInfo.apps" :key="item.appName">
                            <!-- <router-link :to="item.url">    -->
                                <div class="grid-content bg-purple" @click="pageTo(item.url,item.appName,item)">
                                    <img style="width:50px;height:50px;" :src="item.appIcon">
                                    <p style="width:auto;font-size:12.16px;color:#333;">{{item.appName}}</p>
                                </div>
                            <!-- </router-link> -->
                        </el-col>
                    </el-row>
                    <img class="classify-icon" slot="reference" :src="classifyIcon" alt="分类图标"/>
            </el-popover>

            <el-dropdown @command="dropdownAction">
                <span class="el-dropdown-link">
                    {{userInfo.username}}
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item v-if="isAdmin" command="switch">切换用户</el-dropdown-item>
                    <el-dropdown-item v-if="isSwitchUser"><span command="logout" @click="loginOut">登出</span></el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>

            <el-dialog
                title="人员列表" 
                :visible.sync="switchDialog"
            >
                <div>
                    <el-input
                        placeholder="输入姓名/手机号/域账号"
                        v-model="search_input"
                        @change="inputChange"
                        @keyup.enter.native="inputSubmit"
                        style="width:220px;"
                    >
                        <i slot="prefix" class="el-input__icon el-icon-search"></i>
                    </el-input>
                    <el-button icon="el-icon-search" plain @click="inputSubmit" type="primary" style="margin-left:10px;height:31px;">搜索</el-button>
                </div>
                <el-table :data="gridData" :border='true' v-loading="tableLoading">
                    <el-table-column prop='userCn' label='姓名' />
                    <el-table-column prop='adAccount' label='域账号' />
                    <el-table-column prop='orgName' label='所在机构' />
                    <el-table-column prop='phone' label='联系电话' />
                    <el-table-column fixed="right" label="操作">
                        <template slot-scope="scope">
                            <el-button @click="swichUserAc(scope.row)" type="text" size="small">切换</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination
                    v-if="paginagtion.totalPages"
                    background
                    :page-size="5"
                    highlight-current-row
                    @current-change="pnCurrentChange"
                    :current-page.sync="paginagtion.currentPage"
                    layout="total, prev, pager, next, jumper"
                    :total="paginagtion.totalPages"
                    style="text-align:right;position:relative;top:30px;"
                />
            </el-dialog>
        </div>
    </div>
</template>

<script>
import api from '@/api/';
import mixins from '@/constants/mixins';
import { mapState } from 'vuex';
import { includes, compact } from 'lodash';
import localDb from '@/utils/localDb';
import { navData } from "@/constants/jurisdicJson";
import classifyIcon from '@public/assets/imgs/home/classification.svg';

export default {
    mixins: [mixins],
    data(){
        return{ 
            classifyIcon,
            menuActive: '',
            menuData: [],
            gridData: [],
            search_input: '',//搜索框的值
            tableLoading: false,
            switchDialog: false,
            paginagtion: {
                currentPage: 1,
                totalPages: 0,
            }
        }
    },
    beforeCreate(){
        this.$store.dispatch('getUserInfo');
    },
    created(){
        const path = this.$router.history.current.name;

        if(path=='home'){
            this.menuData = [];
        }else{
            var menuData = [{name:"首页",index:"home"}];

            // navData.map(res => {
            //     if(res.index == path){
            //         menuData.push(res)
            //         this.menuActive = res.index;
            //     }
            // })
            this.menuActive = '';
            this.menuData = menuData
        }
    },
    mounted(){
        
    },
    watch: {
        '$route' (to, from) {
            if(to.name=='home'){
                this.menuData = [];
            }else{
                var menuData = [{name:"首页",index:"home"}];
                this.menuActive = '';
                this.menuData = menuData
            }
        }
    },
    computed: {
        userInfo(newVal){
            return this.$store.state.home.userInfo;
        },
        isAdmin(){
            return this.$store.state.home.userInfo.isAdmin;
        },
        isSwitchUser(){
            return this.$store.state.home.userInfo.isSwitchUser;
        },
        commonPermData(){
            return this.$store.state.home.commonPermData;
        }
    },
    methods: {
        //获取人员列表
        getUserListT(pageNo,pageSize,search){
            api.userIndexList({
                pageNo,
                pageSize,
                search
            }).then(ret => {
                if(ret.success){
                    const { total, data } = ret.data;

                    this.gridData = data;
                    this.paginagtion.totalPages = total;
                }
                this.tableLoading = false;
            })
        },
        //切换用户
        userSwitchAction(userId){
            api.userSwitch({userId}).then(res => {
                this.$notify({
                    title: res.success?'成功':'错误',
                    message: res.message,
                    type: res.success?'success':'error'
                });
                
                if(res.success){setTimeout(window.location.href =  '/',1000)}
            })
        },
        //下拉选项操作
        dropdownAction(command){
            const { search_input } = this;

            if(command=='switch'){
                this.switchDialog = true;
                this.tableLoading = true;
                this.getUserListT(this.paginagtion.currentPage,5,search_input);
            }else if(command=='logout'){
                this.loginOut();
            }
        },
        //切换用户
        swichUserAc(row){
            this.userSwitchAction(row.username)
        },
        //返回首页
        returnHome(){
            this.$router.push('/')
        },
        //菜单选择
        menuSelect(key, keyPath){
            this.menuActive = key;
        },
        //搜索框变化
        inputChange(val){
            this.search_input = val;
        },
        //切换页面
        redirectTo(name){
            this.$router.push({name})
        },
        pageTo(path,name,item){
            if(item.id == 32){
                //api工厂
                window.open(path);
            }else{
                if(path.indexOf('http')>=0){
                    var newTab=window.open('about:blank');
                    newTab.location.href=`${path}`;
                }else if(path.indexOf('www')>=0){
                    var newTab=window.open('about:blank');
                    newTab.location.href=`//${path}`;
                }else{
                    this.commonPermData.filter(res => {
                        if(res.entryUrl==path.split('/')[1]){
                            const menu = res.child.map(res => {if(res.show){return res.id}});//所有有权限的数组
                            
                            this.$router.push({name: compact(menu)[0]})
                        }
                    })
                }
            }
        },
        //页码切换
        pnCurrentChange(val){
            this.paginagtion.currentPage = val;
            const { search_input } = this;

            this.tableLoading = true;
            this.getUserListT(val,5,search_input);
        },
        //输入框enter
        inputSubmit(){
            const { search_input } = this;

            this.tableLoading = true;
            this.getUserListT(this.paginagtion.currentPage,5,search_input);
        },
        // 退出登录
        loginOut(){
            api.userLogout({}).then(res => {
                this.$notify({
                    title: res.success ? '成功' : '错误',
                    message: res.message,
                    type: res.success ? 'success' : 'error'
                })

                if(res.success){
                    setTimeout(window.location.reload(),1500)
                }
            })
        }
    },
}
</script>

<style lang="scss" scoped>
    .vk-home-ct{
        width: 100%;
        height: 60px;
        padding: 0 30px 0 15px;
        background-color: #21274E;
        .left{
            cursor: pointer;
            float: left;
            .en-title,.ch-title{
                float: left;
                font-size: 16px;
                font-weight: bold;
                color: #6BA6FF;
                line-height: 60px;
            }
            .ch-title{
                color: #FFF;
            }
        }
        .middle{
            float: left;
            margin-left: 7%;
            .el-menu{
                .is-active{
                    background: #409EFF!important;
                }
            }
        }
        .right{
            float: right;
            height: 60px;
            line-height: 60px;
            .classify-icon{
                position: relative;
                right: 16px;
                top: 7px;
                width: 22px;
                height: 22px;
            }
            .el-dropdown-link{
                color: #fff;
            }
            .el-dropdown{
                color: #fff;
            }
        }
        .en-title{
            font-size: 20px;
        }
    }
    .row-ct-m{
        text-align: center;
        .el-col:hover{
            background: #E8EEFA;
        }
    }
</style>