<template>
    <el-container class="vk-user-m-ct">
        <el-header>
            <el-tabs v-if="roleAllViewPerm" v-model="activeName" @tab-click="tabClick">
                <el-tab-pane label="角色" name="user"></el-tab-pane>
                <el-tab-pane label="角色模版" name="userTmplate"></el-tab-pane>
            </el-tabs>
        </el-header>
        <div v-if="roleAllViewPerm">
            <template v-if="activeName=='user'">
                <manage-user />
            </template>

            <template v-else>
                <manage-temp />
            </template>
        </div>
    </el-container>
</template>

<script>
import api from "@/api/index.js";
import common from '@/constants/common';
import { isEmpty } from 'lodash'; 
import UserManageUser from '../userManageUser';
import UserManageTemp from '../userManageTemp';

export default {
    components: {
        'manage-user': UserManageUser,
        'manage-temp': UserManageTemp
    },
    data(){
        return{
            roleAllViewPerm: true,
            activeName: 'user',
        }
    },
    created(){
        const params = this.$router.history.current.params;//回跳值
        const rolAllView = common.permCheck('role_all_view');//角色tab权限
        const rolConf = common.permCheck('role_config_view');///角色模版tab权限

        this.roleAllViewPerm = rolAllView;//角色总权限
        if(isEmpty(params)){
            this.activeName = 'user';
        }else if(params.cuPage == 'user'){
            this.activeName = 'user'
        }else if(params.cuPage == 'userTmplate'){
            this.activeName = 'userTmplate'
        }
    },
    methods: {
        //tab页切换
        tabClick(tab, event){
            console.log(tab, event);
        },
    }
}
</script>

<style lang="scss">
    .vk-user-m-ct{
        margin: 20px;
        background-color: #fff;
        .el-header{
            width: 100%;
            padding: 0px;
            .el-tabs__nav{
                margin-left: 28px;
            }
        }
    }
</style>
