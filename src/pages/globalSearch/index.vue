<template>
    <div class="dt-sc-ct">
        <div class="fl-o">
            <img class="banner-img" :src="scBanner" alt="banner图" />
            <div class="banner-div">
                <p class="main-title">全局搜索</p>
                <p class="pain-des">基于数据中台为各前端业务系统/终端提供海量数据检索能力，消除一线业务人员长期面临数据孤岛的困局。</p>
            </div>
        </div>
        <div class="fl-t">
            <p class="title">功能介绍</p>
            <div class="func-c">
                <ul v-for="item in flt_data" :key="item.url">
                    <li class="img-ct"><img :src="item.url" alt="多样搜索" /></li>
                    <li class="name-ct">{{item.name}}</li>
                    <li class="des-ct">{{item.des}}</li>
                </ul>
            </div>
        </div>
        <div class="fl-th">
            <p class="title">应用价值</p>
            <div class="div-ct">
                <el-card class="box-card" v-for="item in value_data" :key="item.url">
                    <div class="img-ct"><img :src="item.url" alt="业务图片" /></div>
                    <ul class="ul-ct">
                        <li class="title1">{{item.title}}</li>
                        <li class="title2">{{item.des}}</li>
                    </ul>
                </el-card>
            </div>
        </div>
        <div class="fl-fo">
            <p class="title">上线案例</p>
            <div class="main-ct">
                <img :src="phoneIcon" alt="手机图片" />
                <ul class="des-ct">
                    <li class="des-title">服务家</li>
                    <li class="des-main">服务家上线全局搜索，一站式检索包括售后（投诉、维修、索赔）、通讯记录、房客关系、维修工人、承建商、房屋、施工部品等各领域海量数据</li>
                </ul>
            </div>
        </div>
        <div class="fl-fi">
            <p>万科企业股份有限公司 版权所有   法律声明深圳市市场监督管理局企业主体身份公示</p>
            <p>粤ICP备05098314</p>
        </div>
    </div>
</template>
<script>
import scBanner from '@public/assets/imgs/globalSearch/banner.png';
import funOIcon from '@public/assets/imgs/globalSearch/function_1.png';
import funTIcon from '@public/assets/imgs/globalSearch/function_2.png';
import funThIcon from '@public/assets/imgs/globalSearch/function_3.png';
import valueOIcon from '@public/assets/imgs/globalSearch/value_1.png';
import valueTIcon from '@public/assets/imgs/globalSearch/value_2.png';
import phoneIcon from '@public/assets/imgs/globalSearch/phone.png';

export default {
    data(){
        return{
            scBanner,//banner图
            phoneIcon,
            flt_data: [{
                name: '多样搜索',
                url: funOIcon,
                des: '支持文本、文件、图像、视频等多种数据格式搜索'
            },{
                name: '搜索结果分类',
                url: funTIcon,
                des: '可按业务域、业务环节、业务类型、用户群体对搜索结果分类'
            },{
                name: '按权限开放',
                url: funThIcon,
                des: '支持对数据搜索结果进行按权限开放'
            }],
            value_data: [{
                url: valueOIcon,
                title: '业务关联',
                des: '为用户打破数据孤岛，以业务关联链呈现各项信息',
            },{
                url: valueTIcon,
                title: '快速检索',
                des: '一站式快速检索海量数据，提升信息获取的效益',
            }]
        }
    }
}
</script>
<style lang="scss">
    .dt-sc-ct{
        font-family: PingFangSC-Regular;
        .fl-o{
            width: 100%;
            height: 280px;
            display: flex;
            align-items: center;
            background-image: linear-gradient(0deg, #0043A2 0%, #152775 100%);
            .banner-img{
                width: 422px;
                margin-left: 10%;
                margin: 27px 0 27px 20%;
            }
            .banner-div{
                width: 500px;
                .main-title{
                    font-size: 32px;
                    color: #DCF5FF;
                    letter-spacing: 1.78px;
                    margin: 9px 0;
                }
                .pain-des{
                    opacity: 0.78;
                    font-family: PingFangSC-Light;
                    font-size: 16px;
                    color: #ACDFFF;
                    letter-spacing: 0.89px;
                    margin: 16px 0;
                    .des{
                        font-size: 14px;
                        color: #5AEDFF;
                    }
                }
                .main-button{
                    font-family: PingFangSC-Regular;
                    font-size: 16px;
                    color: #57EDFF;
                    letter-spacing: 0.89px;
                    background: #0043A2;
                    border: 1px solid #57EDFF;
                }
            }
        }
        .fl-t{
            width: 100%;
            background: #fff;
            .title{
                padding: 50px 0;
                text-align: center;
                font-size: 20px;
                color: #333333;
                letter-spacing: 1.11px;
            }
            .func-c{
                display: flex;
                justify-content: center;
                padding-bottom: 44px;
                ul{
                    width: 333px;
                    text-align: center;
                    text-align: -webkit-center;
                    .img-ct{
                        text-align: center;
                        img{
                            width: 114px;
                        }
                    }
                    .name-ct{
                        font-size: 16px;
                        color: #333333;
                        letter-spacing: 0.89px;
                        text-align: center;
                    }
                    .des-ct{
                        width: 178px;
                        font-size: 12px;
                        color: #999999;
                        letter-spacing: 0.67px;
                        text-align: center;
                        margin: 6px 0;
                        line-height: 20px;
                    }
                }
                ul:hover{
                    background: #E8EEFA;
                }
            }
        }
        .fl-th{
            .title{
                font-size: 20px;
                color: #333333;
                text-align: center;
                letter-spacing: 1.11px;
                padding: 50px 0 30px 0;
            }
            .div-ct{
                display: flex;
                justify-content: center;    
                margin-bottom: 69px;
                .box-card{
                    width: 485px;
                    margin: 0 15px;
                    .el-card__body{
                        display: flex;
                        .img-ct{
                            margin: 13px 0 0 50px;
                            img{
                                width: 120px;
                            }
                        }
                        .ul-ct{
                            padding: 30px 0;
                            margin: 0 0 0 20px;
                            .title1{
                                font-size: 18px;
                                color: #333333;
                                padding: 5px 0;
                                letter-spacing: 0.49px;
                            }
                            .title2{
                                font-size: 14px;
                                color: #999999;
                                padding: 10px 0;
                                letter-spacing: 0.54px;
                            }
                            .title3{
                                font-size: 14px;
                                color: #6292FF;
                                letter-spacing: 0.54px;
                            }
                        }
                    }
                }
                .box-card:hover{
                    box-shadow: 0 2px 12px 0 rgba(0,0,0,.2);
                }
            }
        }
        .fl-fo{
            width: 100%;
            // height: 123px;
            background-image: linear-gradient(90deg, #5BA5FF 0%, #4D84FF 99%);
            .title{
                text-align: center;
                padding: 49px 0 63px 0;
                font-size: 20px;
                color: #FFFFFF;
                letter-spacing: 1.11px;
            }
            .main-ct{
                display: flex;
                img{
                    width: 288px;
                    height: 181px;
                    margin-left: 25%;
                }
                .des-ct{
                    margin-left: 46px;
                    .des-title{
                        font-size: 20px;
                        color: #FFFFFF;
                        letter-spacing: 1.11px;
                    }
                    .des-main{
                        width: 444px;
                        font-size: 14px;
                        margin: 12px 0;
                        color: #FFFFFF;
                        line-height: 20px;
                        letter-spacing: 0.78px;
                    }
                }
            }
        }
        .fl-fi{
            font-size: 12px;
            color: #999999;
            letter-spacing: 0.67px;
            text-align: center;
            padding: 50px 0 45px 0;
            p{
                line-height: 15px;
            }
        }
    }
</style>
