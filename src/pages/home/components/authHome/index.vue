<template>
    <div class="vk-home-ct">
        <div class="v-h-n">
            <div class="vk-home-nav">
                <el-row>
                    <el-col 
                        v-for="(item,index) in userInfo.apps" 
                        :key="item.url+index" 
                        :span="3" 
                        class="vk-icons"
                    >
                    <div class="mt-c" style="cursor: pointer;" @click="redirectTo(item.url,item.appName,item)">
                        <img :src="item.appIcon">
                        <p>{{item.appName}}</p>
                    </div>
                    </el-col>
                </el-row>
            </div>
        </div>
        <div :class="{'vk-tab': true,'navStyle': navStyleType}">
            <el-tabs 
                class="vk-tab-item"
                v-model="activeName" 
                @tab-click="TabClick"
            >
                <el-tab-pane v-for="item in tabList" :key="item.code" :label="item.name" :name="item.code" />
            </el-tabs>
        </div>
        <ChartFloor :businessCode="activeName" />
    </div>
</template>

<script>
import api from '@/api/';
import { mapState } from 'vuex';
import { isEmpty, compact } from 'lodash';
import common from '@/constants/common';
import mixins from '@/constants/mixins';
import ChartFloor from '../chartFloor';
import localDb from '@/utils/localDb';

export default {
    mixins: [mixins],
    components: {
        ChartFloor
    },
    data(){
        return{
            navStyleType: false,
            tabList: [],
            saml:'',
            relay:'',
            link: {
                url: '',
            },
            url: '',
            activeName: '',
        }
    },
    mounted(){
        this.getBoardTopNav();
        window.addEventListener('scroll', this.windowScrollFun);
    },
    computed: {
        userInfo(newVal){
            return this.$store.state.home.userInfo;
        },
        commonPermData(){
            return this.$store.state.home.commonPermData;
        }
    },
    beforeDestroy() {
        window.removeEventListener('scroll', this.windowScrollFun);
    },
    methods: {
        //顶部tab
        getBoardTopNav(){
            api.getBoardTopNav().then(res => {
                if(res.success){
                    this.activeName = res.data[0].code;
                    this.tabList = res.data;
                    this.$store.dispatch('changeBsCode',{ businessCode: res.data[0].code });
                }else{
                    this.$message.error(res.message);
                }
            })
        },
        //scroll高度变化
        windowScrollFun(val){
            if(window.scrollY>250){
                this.navStyleType = true;
            }else{
                this.navStyleType = false;
            }
        },
        TabClick(tab) {
            this.$store.dispatch('changeBsCode',{ businessCode: tab.name });
            this.activeName = tab.name;
        },
        redirectTo(path,name,item) {
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
            
        }
    }
}
</script>

<style lang="scss">
    .vk-home-ct{
        .v-h-n{
            background-color: #fff;
            .vk-home-nav{
                width: 62%;
                margin: auto;
                .vk-icons{
                    height: 100px;
                    text-align: center;
                    padding: 20px 0;
                    img{
                        width: 50px;
                        height: 50px;
                    }
                    p{
                        font-family: PingFangSC-Regular;
                        font-size: 12.16px;
                        color: #333333;
                        letter-spacing: 0.84px;
                        line-height: 30px;
                    }
                    .mt-c:hover{
                        background: #E8EEFA;
                    }
                }
                // .vk-icons:hover{
                //     background: #E8EEFA;
                // }
            }
        }   
        .vk-home-banner{
            width: 100%;
            height: 335px;
            background-image: linear-gradient(0deg, #2F2674 0%, #080E5E 100%);
            img{
                width: 100%;
                height: 100%;
            }
        }
        .navStyle{
            width: 100%;
            position: fixed;
            top: 0px;
            z-index: 999;
        }
        .vk-tab{
            background-color: #fff;
            .vk-tab-item{
                padding: 20px 26px;
                .el-tabs__header{
                    margin: 0px;
                }
                .el-tabs__nav-wrap::after{
                    height: 0px;
                }
                .el-tabs__item{
                    color: #999;
                }
                .el-tabs__item.is-active{
                    font-family: PingFang TC;
                    font-size: 18px;
                    color: #000000;
                }
                .el-tabs__active-bar{
                    width: 20px!important;
                    left: 5px;
                }
            }
        }
    }
</style>