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
                    v-for="(item,index) in labelData"
                    :key="item.id+index"
                    :index="item.id"
                >
                    <span v-if="item.show">{{item.labelName}}</span>
                </el-menu-item>
            </el-menu>
        </el-aside>
        <!-- 右侧主结构变换 -->
        <el-main>
            <router-view></router-view>
        </el-main>
    </el-container>
</template>
<script>
import { mapState } from 'vuex';
import { isEmpty, findIndex, compact } from 'lodash';
import common from '@/constants/common';
import { jusisData } from "@/constants/jurisdicJson";

export default {
    data(){
        return{
            default_menu: '标签总览',
            labelData: []
        }
    },
    created(){},
    mounted(){
        let nav_data = [],pageName = this.$router.history.current.name;//当前组件name
        const cuPageName = this.$router.history.current.path.split('/');//当前路由名
        (this.commonPermData.length==0?jusisData:this.commonPermData).filter(res => {
            if(res.entryUrl == cuPageName[1]){nav_data = res.child}
        })
        const menuList = nav_data.map(res => {if(res.show){return res.id}});//有权限的导航项

        this.labelData = compact(nav_data.map(res => {if(res.show){return res}}));
        //原子标签新增特殊处理
        if(pageName == 'atom-label-add')pageName = 'atom-label';
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
        menuSelect(val){
            this.default_menu = val;
            this.$router.push({name: val});
        }
    }
}
</script>
<style lang="scss">
    .el-main{
        padding: 10px 20px;
    }
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
