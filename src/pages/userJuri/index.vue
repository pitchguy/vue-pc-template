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
                <el-menu-item
                    v-for="(item,index) in nav_data"
                    :key="item+index"
                    :index="item.id"
                    v-if="item.show"
                >
                {{item.labelName}}
                </el-menu-item>
            </el-menu>
        </el-aside>
        <router-view></router-view>
    </el-container>
</template>
<script>
import { isEmpty, findIndex } from 'lodash';
import common from '@/constants/common';
import TreeTable from "./components/treeTable";
import UserManage from "./components/userManage";
import { jusisData } from "@/constants/jurisdicJson";

export default {
    components: {
        'tree-table': TreeTable,
        'user-manage': UserManage
    },
    data(){
        return{
            default_menu: '',
            nav_data: []
        }
    },
    created(){
    },
    mounted(){
        var nav_data = [];
        const pageName = this.$router.history.current.name;
        const cuPageName = this.$router.history.current.path.split('/');
        
        (this.commonPermData.length==0?jusisData:this.commonPermData).filter(res => {
            if(res.entryUrl == cuPageName[1]){
                nav_data = res.child
            }
        })
        const menuList = nav_data.map(res => {if(res.show){return res.id}});//有权限的导航项

        this.nav_data = nav_data;//导航栏
        if(findIndex(menuList,pageName)){
            //初始加载时如果当前路由存在于权限数组中，则展示当前截取的路由（刷新）
            this.default_menu = pageName;
        }else{
            //否则就按照有权限数组的第一项（初始加载）
            this.default_menu = menuList[0];
        }
    },
    watch: {
        $route: function(to, from) {
            this.default_menu = to.name;
        }
    },
    computed: {
        bodyHeight(){
            return window.innerHeight - 60
        },
        commonPermData(){
            return this.$store.state.home.commonPermData;
        }
    },
    methods: {
        //菜单选择
        menuSelect(val){
            this.default_menu = val;
            this.$router.push({name: val});
        },
        pageSwitch(){
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
            li{
                text-align: center;
            }
            .is-active{
                background: #409EFF!important;
            }
        }
    }
    
</style>
