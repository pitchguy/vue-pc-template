<template>
    <div class="vk-keycus-ct" 
        v-loading="page_loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
    >
        <div class="vk-keycus-search">
            <el-form>
                <el-form-item>
                    <el-input
                        placeholder="请输入姓名/手机号码"
                        v-model.trim="search_data"
                        class="search">
                        <el-button class="el-icon-search" circle @click.native.prevent="iconSearch"  slot="suffix" native-type="submit"></el-button>
                    </el-input>
                </el-form-item>
            </el-form>
        </div> 
        <div class="panel-ct">
            <div v-for="item in panel_data" :key="item.class1Code" class="panel-floor">
                <p class="title">{{ item.class1Name }}</p>
                <el-row :gutter="24" class="panel-row">
                    <el-col 
                        :span="6"
                        v-for="child in item.level2VOS" 
                        :key="child.class2Code" 
                    >
                        <div @click="child.use?goSearchList(child,item):''">
                        <el-card shadow="hover" :class="{ 'isDefeat': !child.use }">
                            <img :src="child.icon" :alt="child.class2Name+'图标'" style="width:52px;" />
                            <ul class="ul-ct">
                                <li class="v-title">{{child.class2Name}}
                                    <el-tooltip v-if="textList[child.class2Name]" class="item" effect="dark"  placement="right">
                                        <div slot="content" v-html="textList[child.class2Name]"></div>
                                        <img class="img" src="/question.svg" alt="问号icon" />
                                    </el-tooltip>
                                </li>
                                <li class="detail">{{`共${child.count}人`}}</li>
                            </ul>
                        </el-card>
                        </div>
                    </el-col>
                </el-row>
            </div>
        </div>
    </div>  
</template>
<script>
import api from '@/api';
import { isEmpty } from 'lodash';
import common from '@/constants/common';
import hvIcon from '@public/assets/imgs/keyCustom/icon_highvalue.png';//高交易价值
import ptIcon from '@public/assets/imgs/keyCustom/icon_potential.png';//高潜在价值
import rmIcon from '@public/assets/imgs/keyCustom/icon_recommend.png';//高推荐价值 
import gvIcon from '@public/assets/imgs/keyCustom/icon_government.png';//政府影响力
import opIcon from '@public/assets/imgs/keyCustom/icon_opinion.png';//舆论影响力
import epIcon from '@public/assets/imgs/keyCustom/icon_enterprise.png';//企业影响力
import cnIcon from '@public/assets/imgs/keyCustom/icon_community.png';//社区影响力
import ctIcon from '@public/assets/imgs/keyCustom/icon_cost.png';//高成本
import ncIcon from '@public/assets/imgs/keyCustom/icon_negativecomment.png';//负推荐
import nfIcon from  '@public/assets/imgs/keyCustom/icon_negativeconfluence.png';//负面影响传播



export default {
    data(){
        return{
            page_loading: false,
            search_data: '',
            panel_data: [],
            textList:{
                '政府影响力':'所在行业为政府的客户',
                '高交易价值':'满足以下条件之一，即为高交易价值：<br>1、购房3套或以上；<br>2、购买房屋类型是别墅或大平层洋房。<br>3、购买办公或商业的，且面积大于1000平米。<br>4、个人回迁房大于或等于5套的人。',
                '高潜在价值 ':'同时满足以下2个条件，即为高潜在价值：<br>1、销售家的意向等级标为4（最高级）；<br>2、近三个月新增的客户。',
                '高推荐价值':'同时满足以下2个条件，即为高推荐价值：<br>1、客户必须有推荐过3位客户；<br>2、被推荐的客户至少有30%与万科发生过交易。'
            }
        }
    },
    created(){
        this.page_loading = true;
    },
    mounted(){
        if(common.permCheck('imp_user_view')){}else{this.$router.push('/403')} 
        this.getPanelSummary();
    },
    methods: {
        //通用提醒
        commonAlert(res){
            this.$notify({
                title: res.success?'成功':'错误',
                message: res.message,
                type: res.success?'success':'error'
            });
        },
        //获取首页面板数据
        getPanelSummary(){
            api.importPanelSum().then(res => {
                if(res.success){
                    this.page_loading = false;
                    this.panel_data = res.data;
                }else{
                    this.commonAlert(res);
                }
            })
        },
        iconSearch(){
            const { search_data } = this;

            this.$router.push({name:'key-customer-search',query:{title:'重点客户',search_data,type:'global'}})
            // if(isEmpty(search_data)){
            //     //为空时不操作
            // }else{
            //     //不为空时带参数跳转
            //     this.$router.push({name:'key-customer-search',query:{title:'重点客户',search_data,type:'global'}})
            // }
        },
        //面板进入list
        goSearchList(val,item){
            this.$router.push({name:'key-customer-search',query:{
                title:val.class2Name,
                search_data:'',
                type:'panel',
                code1: item.class1Code,
                code2: val.class2Code
            }})
        }
    }
}
</script>
<style lang="scss">
    .vk-keycus-ct{
        padding: 20px;
        .vk-keycus-search{
            margin-bottom:15px;
            .search{
                width:280px;
                .el-icon-search{
                    background-color:transparent;
                    border:none;
                }
            }
        }
        .panel-ct{
        .panel-floor{
            margin-bottom: 24px;
            .title{
                padding: 16px 0;
                font-size: 16px;
                color: #333333;
            }
            .panel-row{
                .el-col{
                    max-width: 280px;
                    .isDefeat{
                        background: #eee;
                    }
                    .el-card{
                        min-height: 120px;
                        cursor: pointer;
                        box-shadow: 0 2px 4px 0 rgba(0,0,0,0.08);
                        .el-card__body{
                            height: 100%;
                            display: flex;
                            min-height: 120px;
                            align-items: center;
                        }
                    }
                    .el-card:hover{
                            box-shadow: 0 2px 14px 0 rgba(0,0,0,.1)!important;
                        }
                }
                .ul-ct{
                    float: left;
                    margin-left: 16px;
                    .v-title{
                        font-size: 14px;
                        color: #333333;
                        .img{
                            width:16px;
                            height:16px;
                            position:relative;
                            top:3px;
                        }
                    }
                    .detail{
                        font-size: 12px;
                        color: #999999;
                        margin-top: 12px;
                    }
                }
            }
        }
    }
    }
</style>
