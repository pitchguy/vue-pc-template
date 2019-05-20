<template>
  <div class="user-p-ct">
    <template v-if="listTotalLen==0">
      <div class="head-fl-o-copy">
          <img :src="drawEmptyIcon" alt="暂无数据" style="width:150px;height:160px">
      </div>
    </template>
    <template v-else>
      <div class="head-fl-o">
        <el-row :gutter="24" class="row-o" style="width:100%;">
          <el-col :span="3">
            <img class="user-img" :src="detail_data.custImgUrl" alt="头像">
          </el-col>
          <el-col :span="21">
            <el-row>
              <div class="dt-mes">
                <p class="title">
                  <span>{{detail_data.custName}}</span>
                  <img v-if="genderShow" :src="detail_data.genderImg" alt="性别icon" style="height:16px;width:15px;">
                </p>
              </div>
            </el-row>
            <div :gutter="24" class="row-t">
              <div>
                <p>性别：{{detail_data.custGender || '-'}}</p>
              </div>
              <div>
                <p>年龄：{{detail_data.custAge || '-'}}</p>
              </div>
              <div>
                <p>生日：{{detail_data.custBirthday || '-'}}</p>
              </div>
              <!-- <div>
                <p>学历：{{detail_data.custEducation || '-'}}</p>
              </div> -->
              <div>
                <el-tooltip class="item" effect="dark" content="" placement="top-start">
                  <div slot="content">{{detail_data.custNativePlace || '-'}}</div>
                  <p style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">籍贯：{{detail_data.custNativePlace || '-'}}</p>
                </el-tooltip>

              </div>
              <!-- <div>
                <p>职业：{{detail_data.custJob || '-'}}</p>
              </div> -->
              <div>
                <p>星座：{{detail_data.custConstel || '-'}}</p>
              </div>
              <div>
                <p>客户建档时间：{{detail_data.custRegisterTime || '-'}}</p>
              </div>
              <!-- <div>
                <p>婚姻状态：{{detail_data.custMarriage || '-'}}</p>
              </div> -->
              <div>
                <p>城市公司：{{detail_data.compName || '-'}}</p>
              </div>
              <div style="width:auto!important;max-width:65%!important;">
                <el-tooltip class="item" effect="dark" placement="bottom">
                  <div slot="content">联系地址：{{detail_data.custAddress || '-'}}</div>
                  <p style="text-overflow: ellipsis;overflow: hidden;white-space: nowrap;">联系地址：{{detail_data.custAddress || '-'}}</p>
                </el-tooltip>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="head-fl-t" v-loading="tagLoading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255, 1)">
        <div v-if="showTag" class="blank">
          <img :src="emptyIcon" alt="暂无数据">
          <p>暂无数据</p>
        </div>
        <el-row v-else :gutter="24" class="user-tabs" style="margin:0;max-height:1083px;overflow-y:auto;">
          <el-col :span="12" style="padding:0;margin-bottom:20px" v-for="(item,index) in tags_data" :key="item+index">
            <div class="tab-r">
              <p>{{item.class1Cate}}</p>
              <div class="tab-list">
                <div class="tab-item" v-for="(child,index) in item.tagVOS" :key="child+index" :style="{background:item.backgroundColor,color:item.color}">{{`${child.tagName}`}}</div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="bottom-fl-th">
        <p>客户旅程图</p>
        <div class="fl-th-titlebar">
          <el-menu class="default-content" :default-active="businessCode" mode=" vertical" @select="navSelect">
            <el-menu-item v-for="(item,index) in nav_data" :key="item+index" :index="item.code">{{item.name}}</el-menu-item>
          </el-menu>
          <el-date-picker style="margin-left:10px;" v-model="dateValue" type="daterange" unlink-panels="true" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions" @change="dateRangeChange" />
          <div class="switch-show">
            <span>可视化展示</span>
            <el-switch v-model="ischartShow" active-color="#397bff" inactive-color="#ddd" @change="radioChange"></el-switch>
          </div>
        </div>
        <ul class="ul-ct">
          <li class="title-t">
            共有
            <span>{{pointCount}}</span>个触点，共成功完成
            <span>{{dealCount}}</span>次交易
            <el-checkbox v-if="radioCheck=='2'" v-model="transChecked">只看交易</el-checkbox>
          </li>
        </ul>
        <template>
          <user-po-view ref="userView" v-show="radioCheck=='1'" :custId="custId" :radioCheck="radioCheck" :businessCode="businessCode" :dateValue="dateValue" @countData="countDataAction"></user-po-view>
          <user-po-detail ref="userDetail" v-show="radioCheck=='2'" :custId="custId" :radioCheck="radioCheck" :businessCode="businessCode" :dateValue="dateValue" :transChecked="transChecked" @countData="countDataAction"></user-po-detail>
        </template>
      </div>
    </template>
  </div>
</template>
<script>
import api from '@/api/';
import moment from 'moment';
import common from '@/constants/common';
import mixins from '@/constants/mixins';
import { isNull, isEmpty, reverse } from 'lodash';
import userPotraitDetail from '../detailed';//明细
import userPotraitView from '../iview';//视图

import backIcon from '@public/assets/imgs/back.png';
import emptyIcon from '@public/assets/imgs/blank.png';//空白
import drawEmptyIcon from '@public/assets/imgs/draw_blank.png';//标签空白

import maleIcon from "@public/assets/imgs/pic_male.png";//
import femaleIcon from "@public/assets/imgs/pic_female.png";

export default {
  mixins: [mixins],
  props: ["custId","total"],
  components: {
    'user-po-detail': userPotraitDetail,
    'user-po-view': userPotraitView
  },
  data() {
    return {
      backIcon,
      emptyIcon,
      drawEmptyIcon,
      nav_data: [],
      businessCode: '',
      formLabelWidth: '120px',
      dateValue: ['', ''],
      tagLoading: false,
      transChecked: false,
      radioCheck: '1', //
      genderShow: true,
      detail_data: {
        custImgUrl: maleIcon,
        custName: "",
        custAge: '',
        custPhone: "",
        custConstel: "",
        custEducation: "",
        custAddress: "",
        hasChildren: "",
        custMarriage: "",
        genderImg: "",
        custRegisterTime: ""
      },
      tags_data: [],//客户标签数据
      pointCount: '',
      dealCount: '',
      pickerOptions: {
        disabledDate: (time) => {
          return time.getTime() > Date.now();
        },
      },
      ischartShow: true // 图表是否显示
    }
  }, 
  created() {
    this.tagLoading = true;
  },
  mounted() {
    
  },
  watch: {
    custId(val) {
      this.custUpdate(val);
    }
  },
  computed: {
    showTag() {
      return isEmpty(this.tags_data)
    },
    showDetail() {
      return !common.permCheck('user_trip_view');
    },
    listTotalLen(){
      return this.total||0
    }
  },
  methods: {
    //顶部menu选择
    getBoardNav() {
      api.getBoardTopNav().then(res => {
        if (res.success) {
          this.businessCode = res.data[0].code;
          this.nav_data = res.data;
        } else {
          this.commonAlert(res);
        }
      })
    },
    //查询客户信息详情
    getCustInfo(custId) {
      api.custInfo({ custId }).then(res => {
        if (res.success) {
          this.genderShow = true;
          if (isEmpty(res.data.custImgUrl)) {
            if (res.data.custGender == '男') {
              res.data.custImgUrl = maleIcon;
            } else if (res.data.custGender == '女') {
              res.data.custImgUrl = femaleIcon;
            } else {
              res.data.custImgUrl = maleIcon;
            }
          }
          if (res.data.custGender == '男') {
            res.data.genderImg = '../icon_male.png';
          } else if (res.data.custGender == '女') {
            res.data.genderImg = '../icon_female.png';
          } else {
            this.genderShow = false;
          }
          res.data.custRegisterTime = res.data.custRegisterTime ? moment(res.data.custRegisterTime).format('YYYY-MM-DD') : ''

          this.detail_data = Object.assign({}, this.detail_data, res.data);
          // 只显示生日月日，不现实年份
          if (this.detail_data.custBirthday) {
            this.detail_data.custBirthday = this.detail_data.custBirthday.substr(5)
          }
        } else {
          this.commonAlert(res);
        }
      })
    },
    //查询客户标签
    getCustTags(custId) {
      this.tagLoading = true;
      api.custTags({ custId }).then(res => {
        if (res.success) {
          this.tags_data = _.reverse(res.data);
          // 基本信息放在最前
          let d = null;
          this.tags_data.map((item) => {
            if (item.class1Cate === "基本信息") {
              d = item
            }
          })
          const idx = this.tags_data.indexOf(d)
          this.tags_data.unshift(this.tags_data.splice(idx, 1)[0])
        } else {
          this.commonAlert(res);
        }
        this.tagLoading = false;
      })
    },
    //导航栏点击切换事件
    navSelect(val) {
      this.businessCode = val;
    },
    //画像明细切换
    radioChange(val) {
      const { custId, businessCode, dateValue, transChecked } = this;
      const dateValue_later = isNull(dateValue) ? new Array('', '') : [moment(val[0]).format('YYYY-MM-DD'), moment(val[1]).format('YYYY-MM-DD')];
  
      this.radioCheck = val?'1':'2';
      if(val){
        //视图
        this.$refs.userView.getCustTrip(custId, businessCode, dateValue_later[0], dateValue_later[1]);
        this.$refs.userView.getCustEvalute(custId, businessCode, dateValue_later[0], dateValue_later[1]);
      }else{
        //明细
        this.$refs.userDetail.getCusTripDetail(custId, businessCode, dateValue_later[0], dateValue_later[1], transChecked);
      }
    },
    //时间选择期变化
    dateRangeChange(val) {
      const { custId, radioCheck, businessCode, transChecked } = this;
      const dateValue = isNull(val) ? new Array('', '') : [moment(val[0]).format('YYYY-MM-DD'), moment(val[1]).format('YYYY-MM-DD')];

      if (radioCheck == '1') {
        this.$refs.userView.getCustTrip(custId, businessCode, dateValue[0], dateValue[1]);
        this.$refs.userView.getCustEvalute(custId, businessCode, dateValue[0], dateValue[1]);
      } else if (radioCheck == '2') {
        this.$refs.userDetail.getCusTripDetail(custId, businessCode, dateValue[0], dateValue[1], transChecked);
      }
      this.dateValue = dateValue;
    },
    //自己渲染触点和交易数  
    countDataAction(data) {
      this.dealCount = data.dealCount;
      this.pointCount = data.pointCount;
    },
    //更新
    custUpdate(custId) {
      const { businessCode, dateValue } = this;

      this.getBoardNav();//获取nav
      this.getCustInfo(custId);//查询客户信息详情
      this.getCustTags(custId);//查询客户标签
      this.$refs.userView.getCustTrip(custId, businessCode, dateValue[0], dateValue[1]);

      var selectDom = document.getElementsByClassName("tag-ct-al");
    }
  }
}
</script>
<style lang="scss">
.pop-tags-ct {
  .el-tag {
    margin: 5px;
    color: rgba(0, 0, 0, 0.85);
    background: #fafafa;
    border: 1px solid #dddddd;
    border-radius: 2px;
  }
}
.user-p-ct {
  background: #fff;
  padding: 0 50px;
  height: 100%;
  .head-fl-o-copy{
    display: flex;
    padding: 37px;
    height: 100%;
    align-items: center;
    background: #fff;
    justify-content: center;
  }
  .head-fl-o {
    display: flex;
    background: #fff;
    padding: 37px;
    .row-o {
      img.user-img {
        display: inline-block;
        width: 79px;
        height: 79px;
        border-radius: 50%;
      }
      .dt-mes {
        .title {
          font-size: 22px;
          font-weight: bold;
          color: rgb(0, 0, 0);
        }
      }
    }
    .row-t {
      display: flex;
      flex-wrap: wrap;
      // justify-content: center;
      align-items: center;
      margin-top: 12px;
      div {
        //   margin-right: 100px;
        margin-right: 1%;
        width: 30%;
        margin-top: 10px;
      }
      p {
        font-size: 14px;
        color: #999;
        padding: 5px 0;
        span {
          color: #999999;
        }
      }
      i.user-icon {
        vertical-align: sub;
      }
    }
  }
  .head-fl-t {
    padding: 0 37px;
    background: #fff;
    .blank,
    .user-tabs {
      border-top: solid 1px #ccc;
      padding-top: 37px;
    }
    .blank {
      text-align: center;
      // margin-top: 25px;

      img {
        width: 250px;
      }
      p {
        position: relative;
        left: 8px;
        top: -12px;
        font-size: 14px;
        color: #666666;
        margin: 24px 0;
      }
    }
    .user-tabs {
      margin: 0;
      width: 100%;
      .el-col {
        display: flex;
        .tab-r {
          margin: 8px 0 0 14px;
          p {
            font-size: 18px;
            font-weight: bold;
          }
          .tab-list {
            margin-top: 15px;
            overflow: hidden;
            .tab-item {
              float: left;
              padding: 10px 14px;
              margin: 14px 14px 0 0;
              color: #397bff;
              font-size: 14px;
              background-color: #f4f7ff;
            }
          }
        }
      }
    }
  }
  .bottom-fl-th {
    padding: 60px 37px 37px 37px;
    background: #fff;
    & > p {
      font-size: 22px;
      font-weight: bold;
      margin-bottom: 24px;
    }
    .ul-ct {
      .title-t {
        font-size: 12px;
        color: #666666;
        margin: 13px 0 0 0;
        span {
          color: #5a8cff;
        }
        .el-checkbox {
          margin-left: 20px;
          font-size: 13px;
          .el-checkbox__label {
            font-size: 12px;
          }
        }
      }
    }
    .fl-th-titlebar {
      display: flex;
      align-items: center;
      .el-menu {
        border: 0;
        border-right: solid 1px #ccc;
        .el-menu-item {
          height: 35px;
          width: 96px;
          text-align: center;
          line-height: 35px;
          border: solid 1px #ccc;
          border-right: 0;
        }
        .el-menu-item.is-active,
        .el-menu-item:focus,
        .el-menu-item:hover {
          background-color: #397bff;
          color: white;
        }
      }
      .switch-show {
        margin-left: auto;
      }
    }
    .user-table {
      margin: 25px 0;
      border: solid 1px #ccc;
      border-bottom: 0;
      .table-row {
        display: flex;
        text-align: center;
        border-bottom: solid 1px #ccc;
        & > div {
          // float:left;
          font-size: 16px;
          font-weight: bold;
        }
        & > div:first-child {
          width: 96px;
          padding: 12px 24px;
          align-self: center;
        }
        div.table-show {
          width: 100%;
          border-left: solid 1px #ccc;
        }
        div.button-change {
          display: flex;
          justify-content: space-around;
          & > div {
            width: 50%;
            font-size: 24px;
          }
          div.btn-add {
            margin-left: -25%;
          }
          div.btn-sub {
            margin-right: -25%;
          }
        }
      }
    }
    .default-content {
      display: flex;
      justify-content: center;
    }
    .default-choose {
      display: flex;
      justify-content: space-between;
      background: #fff;
      padding: 36px 30px;
      .ul-ct {
        .title-t {
          font-size: 12px;
          color: #666666;
          margin: 13px 0 0 0;
          .el-checkbox {
            margin-left: 20px;
            font-size: 13px;
            .el-checkbox__label {
              font-size: 12px;
            }
          }
        }
      }
    }
  }
}
</style>
