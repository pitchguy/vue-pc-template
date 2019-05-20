<template>
    <div class="vk-unauth-ct">
        <el-row :gutter="24">
            <el-col 
                v-for="(item,index) in userInfo.apps" 
                :key="item.url + index" 
                :span="6" 
                class="vk-icon"
            >
            <div class="img-ct" style="cursor: pointer;" @click="redirectTo(item.url,item.appName)">
                <img :src="item.appIcon" style="width:50px;">
                <p>{{item.appName}}</p>
            </div>
            </el-col>
        </el-row>
    </div>
</template>
<script>
import api from '@/api/';
import { mapState } from 'vuex';
import common from '@/constants/common';

export default {
    data(){
        return{
            res: ''
        }
    },
    computed: mapState({
        userInfo: state => state.home.userInfo
    }),
    methods: {
        redirectTo(path,name) {
            if(path.indexOf('http')>=0||path.indexOf('www')>=0){
                var newTab=window.open('about:blank');
                
                newTab.location.href='//'+path;
            }else{
                if (path) {
                    this.$router.push(path);
                } else {
                    console.log("无效url", path);
                }
            }
            
        }
    }
}
</script>
<style lang="scss">
    .vk-unauth-ct{
        width: 100%;
        height: 45rem;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        .el-row{
            width: 60%;
            text-align: center;
            background-color: #fff;    
            .el-col{
                padding: 20px;
                min-height: 170px;
            }
        }
        .img-ct{
            padding: 15px;
            p{
                font-size: 13px;
            }
        }
    }
</style>
