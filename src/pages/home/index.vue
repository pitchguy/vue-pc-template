<template>
  <div>
    <x-chart ref="simpleChart" :options="option1" :styles="{width:'100%',height:'500px'}"></x-chart>

    <!-- <x-chart id="high" class="high" :option="option2"></x-chart> -->

    <swiper :options="swiperOption">
      <swiper-slide>
        <div class="swiper-item">Slide 1</div>
      </swiper-slide>
      <swiper-slide>
        <div class="swiper-item">Slide 2</div>
      </swiper-slide>
      <swiper-slide>
        <div class="swiper-item">Slide 3</div>
      </swiper-slide>
      <swiper-slide>
        <div class="swiper-item">Slide 4</div>
      </swiper-slide>
      <swiper-slide>
        <div class="swiper-item">Slide 5</div>
      </swiper-slide>
      <swiper-slide>
        <div class="swiper-item">Slide 6</div>
      </swiper-slide>
      
      <div class="left slick_txt">
        <div class="swiper-button-prev swiper-button-white" slot="button-prev"></div>
      </div>
      <div class="right slick_txt">
        <div class="swiper-button-next swiper-button-white" slot="button-next"></div>
      </div>
    </swiper>
    <el-button @click="switchData">switch</el-button>
    <el-button type="primary" @click="jumpRoute">跳转child</el-button>
  </div>
</template>
<script>
import { cloneDeep } from "lodash";
import XChart from '@/components/highCharts';
import { option1, option2 } from './option';
import { swiper, swiperSlide } from "vue-awesome-swiper";
import prevHover from "@public/assets/imgs/ban_prev_hover.png";
import nextHover from "@public/assets/imgs/ban_next_hover.png";
import API from "@/api";


export default {
  name: "Home",
  components: {
    "x-chart": XChart,
    swiper,
    "swiper-slide": swiperSlide
  },
  data() {
    return {
      option1: option1,
      option2: option2,
      swiperOption: {
        effect: "fade",
        speed: 1000,
        spaceBetween: 60,
        keyboard: true,
        autoplay: {
          delay: 2000,
          stopOnLastSlide: false,
          disableOnInteraction: false
        },
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
          type: "custom"
        },
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev"
        },
        loop: true
      }
    };
  },
  mounted() {
    const data1 =  cloneDeep(option1);

    data1.title.text = '2010 ~ 2016 年太阳能行业就业人员发展情况';
    data1.subtitle.text = '数据来源：thesolarfoundation.com';
    data1.series = [{
          name: '安装，实施人员',
          data: [43934, 52503, 57177, 69658, 97031, 119931, 137133, 154175]
        }, {
          name: '工人',
          data: [24916, 24064, 29742, 29851, 32490, 30282, 38121, 40434]
        }, {
          name: '销售',
          data: [11744, 17722, 16005, 19771, 20185, 24377, 32147, 39387]
        }, {
          name: '项目开发',
          data: [null, null, 7988, 12169, 15112, 22452, 34400, 34227]
        }, {
          name: '其他',
          data: [12908, 5948, 8105, 11248, 8989, 11816, 18274, 18111]
    }];
    data1.yAxis.title.text = '就业人数';   //数据
    this.option1 = data1;
    // this.getChartData();

  },
  methods: {
    getChartData(params) {
      API.viserChart({}).then(res => {
        // this.chartsData.viserData = res.data.chartData;
      });
    },
    jumpRoute() {
      this.$router.push("/home/child");
    },
    switchData(){
      const data2 =  cloneDeep(option2);

      this.option1 = data2;
    }
  }
};
</script>
<style lang="scss" scoped>
.slick_txt {
  width: 30%;
  height: 100%;
  position: absolute;
  background-color: transparent;
  transition: all 500ms ease;
  -webkit-transition: all 500ms ease;
  background-repeat: no-repeat;
  font-size: 0;
  outline: none;
  border: 0;
}
.left {
  left: 0;
}
.right {
  right: 0;
}
.swiper-button-prev.swiper-button-white {
  background-image: url("../../public/assets/imgs/ban_prev.png");
}
.swiper-button-next.swiper-button-white {
  background-image: url("../../public/assets/imgs/ban_next.png");
}
.slick_txt:hover .swiper-button-prev,
.slick_txt:hover .swiper-button-next {
  opacity: 1;
  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
}
.swiper-button-prev,
.swiper-button-next {
  opacity: 0;
  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
}
.swiper-button-prev:hover {
  opacity: 1 !important;
}
.swiper-button-prev:hover.swiper-button-white {
  background-image: url("../../public/assets/imgs/ban_prev_hover.png");
}
.swiper-button-next:hover {
  opacity: 1 !important;
}
.swiper-button-next:hover.swiper-button-white {
  background-image: url("../../public/assets/imgs/ban_next_hover.png");
}
.swiper-item {
  width: 100%;
  height: 400px;
  text-align: center;
  line-height: 400px;
  background: rgb(126, 119, 119);
}
</style>