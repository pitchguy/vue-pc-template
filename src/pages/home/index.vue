<template>
  <div>
    <el-button @click="switchData">switch</el-button>
    <el-button type="primary" @click="jumpRoute">跳转child</el-button>

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
      option1,
      option2,
      num: "",
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
  computed: {
  },
  mounted() {
    const data1 =  cloneDeep(option1);

    this.getChartData(data1)
  },
  methods: {
    getChartData(originData) {
      API.viserChart({}).then(res => {
        const { title, subtitle, yAxis, series } = res.data;

        originData.title.text = title;
        originData.subtitle.text = subtitle;
        originData.yAxis.title.text = yAxis;
        originData.series = series;
        this.$set(this, 'option1', originData)
        // this.option1 = originData;
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