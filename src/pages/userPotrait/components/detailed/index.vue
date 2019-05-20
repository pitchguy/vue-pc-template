<template>
  <div class="vk-step-ct">
    <div
      v-loading="div_loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(255, 255, 255, 1)"
    >
      <ul v-if="divShow" style="margin-top: 10px;">
        <!-- <el-alert title="行为" type="warning" :closable="false" style="margin:0 0 30px 0;"/> -->
        <li class="dt-ct-all" v-for="(item,index) in detailVos" :key="index">
          <span v-if="item.lineStatus===1" class="color2"></span>
          <span v-if="item.lineStatus===2" class="color1"></span>
          <div
            class="date"
          >{{item.lineStatus===1?"线上行为" + ' ' + item.eventDate:"线下行为" + ' ' + item.eventDate}}</div>
          <div class="mes-ct">
            <p class="title">{{item.eventStr}}</p>
            <p class="desc">{{item.eventDetailStr}}</p>
          </div>
        </li>
      </ul>
      <div v-else class="blank">
        <img :src="emptyIcon" alt="暂无数据">
        <p>暂无数据</p>
      </div>
    </div>

    <!-- <ul v-if="divShow">
            <el-alert
                title="服务评价"
                type="info"
                :closable="false"
                style="margin:0 0 30px 0;"
            />
            <li class="dt-ct-all" v-for="(item,index) in evaluteVos" :key="index">
                <div class="date">{{item.evaluateDate}}</div>
                <div class="mes-ct">
                    <p class="title">{{item.evaluateTitle}}</p>
                    <p class="desc">{{item.evaluateDetailStr}}</p>
                </div>
            </li>
    </ul>-->
  </div>
</template>
<script>
import api from '@/api/';
import moment from 'moment';
import { isEmpty } from 'lodash';
import mixins from '@/constants/mixins';
import emptyIcon from '@public/assets/imgs/blank.png';//空白

export default {
  mixins: [mixins],
  props: [
    "custId",
    "radioCheck",
    "businessCode",
    "dateValue",
    "transChecked",
    "countData"
  ],
  data() {
    return {
      emptyIcon,
      div_loading: true,
      divShow: true,

      detailVos: [],//客户旅程明细数组
      evaluteVos: [],//客户评价详细
      step_data: []
    }
  },
  watch: {
    custId(newVal) {
      const { custId, radioCheck, businessCode, dateValue, transChecked } = this;

      if (radioCheck == '2') {
        this.div_loading = true;
        this.getCusTripDetail(newVal, businessCode, dateValue[0], dateValue[1], transChecked);
      }
    },
    businessCode(newVal) {//产业态切换
      const { custId, radioCheck, businessCode, dateValue, transChecked } = this;

      if (radioCheck == '2') {
        this.div_loading = true;
        this.getCusTripDetail(custId, newVal, dateValue[0], dateValue[1], transChecked);
      }
    },
    transChecked(newVal) {
      const { custId, radioCheck, businessCode, dateValue, transChecked } = this;

      if (radioCheck == '2') {
        this.getCusTripDetail(custId, businessCode, dateValue[0], dateValue[1], newVal);
      }
    }
  },
  methods: {
    //客户旅程详情
    getCusTripDetail(custId, businessCode, startDateStr, endDateStr, onlyDeal) {
      this.div_loading = true;
      api.cusTripDetail({
        custId,
        businessCode,
        startDateStr,
        endDateStr,
        onlyDeal
      }).then(res => {
        if (res.success) {
          this.detailVos = res.data.detailVos;
          this.divShow = isEmpty(res.data.detailVos) ? false : true;
          this.$emit('countData', { pointCount: res.data.pointCount, dealCount: res.data.dealCount });
        } else {
          this.commonAlert(res);
        }
        this.div_loading = false;
      })
    }
  }
}
</script>
<style lang="scss">
.vk-step-ct {
  background: #fff;
  padding: 30px 0 0 0;
  min-height: 300px;
  .blank {
    background: #fff;
    text-align: center;
    padding: 24px 0;
    img {
      width: 250px;
    }
    p {
      position: relative;
      left: 8px;
      font-size: 14px;
      color: #666666;
      margin: 24px 0;
    }
  }
  ul {
    .dt-ct-all {
      display: inline-flex;
      .date {
        float: left;
        min-width: 120px;
        font-size: 12px;
        color: #666666;
      }
      .mes-ct {
        float: left;
        margin-left: 47px;
        min-height: 70px;
        min-width: 700px;
        .title {
          font-size: 14px;
          color: #333333;
          font-weight: bold;
        }
        .desc {
          font-size: 12px;
          color: #666666;
          margin-top: 10px;
        }
      }
    }
    .dt-ct-all .color1 {
      min-width: 13px;
      height: 13px;
      opacity: 0.3;
      margin-right: 10px;
      border-radius: 7px;
      background: #397bff;
    }
    .dt-ct-all .color2 {
      min-width: 13px;
      height: 13px;
      opacity: 0.3;
      margin-right: 10px;
      border-radius: 7px;
      background: #5dd089;
    }
  }
}
</style>
