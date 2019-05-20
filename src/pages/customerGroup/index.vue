<template>
    <el-container :style="{minHeight: bodyHeight + 'px'}">
        <!-- 左侧导航栏 -->
        <el-aside class="vk-l-aside" width="200px">
            <el-menu
                :default-active="default_menu"	
                background-color="#161D38"
                text-color="#fff"
                active-text-color="#fff"
                @select="menuSelect"
            >
                <!-- @select="menuSelect" -->
                <el-menu-item
                    v-if="item.show"
                    v-for="(item,index) in report_data"
                    :key="item+index"
                    :index="item.id"
                >
                    {{item.navName}}
                </el-menu-item>
            </el-menu>
        </el-aside>
        <el-main>
            <router-view></router-view>
        </el-main>
    </el-container>
</template>

<script>
import { findIndex } from 'lodash';
import common from '@/constants/common';
export default {
    data () {
        return {
            report_data:[],
            default_menu:'',

        }
    },
    created(){
        const pageName = this.$router.history.current.name;
        const labelTagsPerm = common.permCheck('label_encircle_view');//标签圈群权限
        const labelTagsMgPerm = common.permCheck('user_package_view');//客群包管理

        const report_data = [{
            id: 'label-whole-tags',
            navName:'标签圈群',
            show: labelTagsPerm
        },{
            id: 'label-group-manage',
            navName:'客群包管理',
            show: labelTagsMgPerm
        }]
        const menuList = report_data.map(res => {if(res.show){return res.id}});//有权限的导航项
        
        this.report_data = report_data;
        if(findIndex(menuList,pageName)){
            //初始加载时如果当前路由存在于权限数组中，则展示当前截取的路由（刷新）
            this.default_menu = pageName;
        }else{
            //否则就按照有权限数组的第一项（初始加载）
            this.default_menu = menuList[0];
        }
    },
    mounted(){},
    watch:{
        $route( to , from ){ 
            this.default_menu = to.name;
         }
    },
    computed: {
        bodyHeight(){
            return window.innerHeight - 60
        }
    },
    methods: {
        //菜单选择
        menuSelect(val){
            this.default_menu = val;
            this.$router.push({name: val});
        }
    }
}
</script>

<style lang="scss">
    .vk-l-aside{
        overflow: -moz-hidden-unscrollable;
        .el-menu{
            min-height: 700px;
            height: 100%;
            padding-bottom: 9999px;
            margin-bottom: -9999px;
            overflow: hidden;
            .is-active{
                background: #409EFF!important;
            }
        }
    }
</style>
