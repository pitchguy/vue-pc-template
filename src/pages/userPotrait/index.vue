<template>
    <el-container>
        <!-- 左边用户列表 -->
        <el-aside style="width:257px;min-height:700px;" v-show="isSideShow">
            <p>客户列表</p>
            <el-input
                v-model="input_search1" 
                placeholder="姓名/电话"
                @change="inputChange1"
                @keyup.enter.native="button1Click">
                <i slot="suffix" class="el-input__icon el-icon-search" @click="button1Click"></i>
            </el-input>
            <div style="max-height:1200px;" v-loading="list_loading">
                <el-card  v-for="(item,index) in custList" :key="index" >
                    <div class="user-card" :class="{active:isActive[index]}" @click="getDetail(item.custId,index)">
                        <div class="user-card-o">
                            <span class="user-name">{{item.custName}}</span>
                            <img :src="item.genderImg" />
                        </div>
                        <div class="user-card-t">
                            <span style="font-size:12px;"><i class="user-icon icon-phone"></i>{{item.custPhone}}</span>
                        </div>
                        <div v-if="isActive[index]" class="active-box"></div>
                    </div>
                </el-card>
                <el-pagination
                    :small="true"	
                    layout="prev, next"
                    :total="total"
                    @current-change="pageChange"
                    style="padding:20px 5px;text-align:center;"
                >
                </el-pagination>
            </div>
        </el-aside>
        <a href="javascript:;" class="sideShow" @click="sideShowChange()" :class="{'unactive':!isSideShow}"></a>
        <!-- 右边用户详情 -->
        <el-main>
            <!-- <router-view :custid="searchId"></router-view> -->
            <user-detail :custId="custId" :total="total"></user-detail>  
        </el-main>
    </el-container>
</template>
<script>
import api from '@/api/';
import mixins from '@/constants/mixins';
import UserDetail from "./components/userDetail";

import iconsMale from "@public/assets/imgs/userInfo/icon_male.png";
import iconsFemale from "@public/assets/imgs/userInfo/icon_female.png";

export default {
    mixins: [mixins],
    components: {
        'user-detail': UserDetail,
    },
    data(){
        return{
            custList:[],
            custId :'',
            input_search1:'',
            isActive:[],
            default_menu: '',
            nav_data: [],
            total: 0,
            isSideShow:true, //左边列表是否显示 
            list_loading: false
        }
    },
    created(){
        const query = this.$router.history.current.query;
        
        if(query){
            //查看画像时 获取custid请求对应人员
            this.copyGetUserPortraitList(query.custId,'',1,15)
        }else{
            //默认无custid
            this.getUserPortraitList('',1,15)
        }
    },
    mounted(){},
    watch: {
        $route: function(to, from) {
            this.default_menu = to.name;
        },
        custList(newVal){
            if(newVal.length==0){return false}
            this.getDetail(newVal[0].custId,0);
        }
    },
    methods: {
        //初始化数据
        init(){
            for(var i=0;i<this.custList.length;i++){
                this.isActive[i] = false;
            }
        },
        //请求左侧人员列表，判断人员性别
        copyGetUserPortraitList(custId,searchCondition,pageNo,pageSize){
            this.list_loading = true;
            api.elasticSearch({
                custId,searchCondition,
                pageNo,pageSize
            }).then(res => {
                if(res.success){
                    res.data.data.forEach(res => {
                        if(res.custGender=='男'){
                            res.genderImg = '../icon_male.png';
                        }else if(res.custGender=='女'){
                            res.genderImg = '../icon_female.png';
                        }else{
                            res.genderImg = '';
                        }
                    })

                    this.total = res.data.total;
                    this.custList = res.data.data;
                }else{
                    this.commonAlert(res);
                }
                this.list_loading = false;
            })
        },
        //获取列表数据
        getUserPortraitList(searchCondition,pageNo,pageSize){
            this.list_loading = true;
            api.elasticSearch({
                searchCondition,pageNo,pageSize
            }).then(res => {
                if(res.success){
                    res.data.data.forEach(res => {
                        if(res.custGender=='男'){
                            res.genderImg = '../icon_male.png';
                        }else if(res.custGender=='女'){
                            res.genderImg = '../icon_female.png';
                        }else{
                            res.genderImg = '';
                        }
                    })

                    this.total = res.data.total;
                    this.custList = res.data.data;
                }else{
                    this.commonAlert(res);
                }
                this.list_loading = false;
            })
        },
        //点击获取用户id，并传给子组件
        getDetail(custId,active){
            this.init();
            this.custId = custId;
            this.isActive[active] = true;
        },
        pageChange(val){
            const { input_search1 } = this;
            this.getUserPortraitList(input_search1,val,15)
        },
        //左边列表栏隐藏
        sideShowChange(){
            this.isSideShow = !this.isSideShow
        },
        //搜索框输入改变
        inputChange1(val){
            this.input_search1 = val;
        },
        //大搜索框按钮
        button1Click(){
            const { input_search1 } = this;
            this.getUserPortraitList(input_search1,1,15);
        },
    }
}
</script>
<style lang="scss">
    .el-aside{
        // position:relative;
        background:#fff;
        width:257px;
        overflow:hidden;
        border-right:1px solid #ebeef5;
        &>p{
            margin:37px 0 20px 20px;
            font-weight:bold;
            font-size:18px;
        }
        .el-input{
            margin:0 0 8px 20px;
            width:210px;
            input{
                height:40px;
            }
            .el-input__suffix{
                border-left:1px solid #ebeef5;
            }
        }
        .el-card{border:0;}
        .el-card__body{padding:0}
        .user-card{
            cursor:pointer;
            height:76px;
            padding:20px;
            position:relative;
            .user-card-o{
                .user-name{
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    width: 200px;
                    display: block;
                }
            }
            .user-card-t{
                float:left;
            }
            &.active{
                background:#f4f7ff;
            }
            div:first-child>img,div>span:last-child{
                float:right;
            }
            div:first-child{
                color:#000;
                font-size:14px;
                margin-bottom:8px;
            }
            div:last-child span{
                font-size:12px;
                color:#999;
            }
            div.active-box{
                position:absolute;
                top:0;
                right:0;
                width:4px;
                height:100%;
                background-color:#397bff;
                z-index:10;
            }
        }
    }
    a.sideShow{
        position:absolute;
        height:100px;
        width:40px;
        // right:0;
        left:217px;
        top:50%;
        // border:solid 1px red;
        background:url("../../public/assets/imgs/userInfo/icon_show.png") no-repeat;
        z-index: 100;
        &.unactive{
            transform: rotate(180deg);
            left:0;
        }
    }
    .el-main{
        padding:0;
    }
    .user-icon{
        display:inline-block;
        width:16px;
        height:15px;
        margin-right:5px;
        vertical-align:text-top;
        &.icon-id{
            background:url("../../public/assets/imgs/userInfo/icon_id.png") no-repeat;
        }
        &.icon-phone{
            width:11px;
            background:url("../../public/assets/imgs/userInfo/icon_phone.png") no-repeat;
        }
        &.icon-gender{
            background:url("../../public/assets/imgs/userInfo/icon_male.png") no-repeat;
        }
        &.icon-age{
            background:url("../../public/assets/imgs/userInfo/icon_age.png") no-repeat;
        }
        &.icon-xz{
            background:url("../../public/assets/imgs/userInfo/icon_xz.png") no-repeat;
        }
        &.icon-edu{
            background:url("../../public/assets/imgs/userInfo/icon_edu.png") no-repeat;
        }
        &.icon-addr{
            background:url("../../public/assets/imgs/userInfo/icon_addr.png") no-repeat;
        }
        &.icon-birth{
            background:url("../../public/assets/imgs/userInfo/icon_birth.png") no-repeat;
        }
        &.icon-marry{
            background:url("../../public/assets/imgs/userInfo/icon_marry.png") no-repeat;
        }
        &.icon_regist{
            background:url("../../public/assets/imgs/userInfo/icon_regist.png") no-repeat;
        }
    }
</style>