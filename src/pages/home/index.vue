<template>  
    <div>
        <div v-if="chartsData.viserData.length">
            <v-chart 
                :forceFit="true" 
                :height="height" 
                :data="chartsData.viserData" 
                :scale="scale" 
                :padding="padding"
            >
              <v-tooltip />
              <v-axis />
              <v-line position="time*rate" />
              <v-guide v-for="({ type, position,content, style, start, end, lineLength },index) in guides"
                  :type="type"
                  :position="position"
                  :content="content"
                  :v-style="style"
                  :start="start"
                  :end="end"
                  :lineLength="lineLength"
                  :key="index"
              >
              </v-guide>
            </v-chart>
        </div>

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
          <!-- <div class="swiper-pagination swiper-pagination-white" slot="pagination"></div> -->
          <div class="left slick_txt">
            <div class="swiper-button-prev swiper-button-white" slot="button-prev"></div>
          </div>
          <div class="right slick_txt">
            <div class="swiper-button-next swiper-button-white" slot="button-next"></div>
          </div>
        </swiper>
        <el-button type="primary" @click="buttonClick">123</el-button>
        <el-button type="primary" @click="jumpRoute">跳转child</el-button>
    </div>
</template>
<script>
import { cloneDeep } from 'lodash';
import { viewPieOption } from "./option";
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import prevHover from '@public/assets/imgs/ban_prev_hover.png';
import nextHover from '@public/assets/imgs/ban_next_hover.png';
import API from '@/api';

const scale = [
  {
    dataKey: 'time',
    range: [0, 1],
  },
];

const guides = [
  {
    type: 'dataMarker',
    position: ['2014-01-03', 6.763],
    content: '受稳健货币政策影响，协定存款利\n率居高不下,收益率达6.763%',
    style: {
      text: {
        textAlign: 'left',
      },
    },
  },
  {
    type: 'dataMarker',
    position: ['2013-05-31', 2.093],
    content: '余额宝刚成立时，并未达到目标资产\n配置，故收益率较低',
    style: {
      text: {
        textAlign: 'left',
      },
    },
  },
  {
    type: 'dataMarker',
    position: ['2016-09-04', 2.321],
    content: '受积极货币政策的影响，收益率降\n到历史最低2.321%',
    style: {
      text: {
        textAlign: 'left',
      },
    },
  },
  {
    type: 'dataRegion',
    start: ['2016-12-02', 2.517],
    end: ['2017-03-24', 3.83],
    content: '宏观经济过热，受稳健货币政策影\n响，余额宝收益率随之上升',
    lineLength: 50,
  },
];

export default {
    name: "Home",
    components: {
      swiper,
      "swiper-slide":swiperSlide
    },
    data(){
        return {
            chartsData: {
                viserData: []
            },
            scale,
            height: 440,
            padding: [50],
            guides,
            name: 'free frozen',
            swiperOption: {
              effect: 'fade',
              speed: 1000,
              spaceBetween: 60,
              keyboard: true,
              autoplay: {
                delay: 2000,
                stopOnLastSlide: false,
                disableOnInteraction: false,
              },
              pagination: {
                el: '.swiper-pagination',
                clickable: true,
                type: 'custom'
              },
              navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev'
              },
              loop: true
            }
        }
    },
    mounted(){
        this.getChartData();
    },
    methods: {
        getChartData(params){
            API.viserChart({}).then(res => {
                this.chartsData.viserData = res.data.chartData;
            })
        },
        buttonClick(){
            const h = this.$createElement;
            h('el-button', { style: 'color: teal'}, '这是提示文案')
            let html = '';
            for(let i=0;i<3;i++){
               html+= h('el-button', { style: 'color: teal'}, '这是提示文案')
            } 
            this.$notify({
                title: 'HTML 片段',
                dangerouslyUseHTMLString: true,
                message: html
            })
        },
        jumpRoute(){
            this.$router.push('/home/child')
        }
    }
}
</script>
<style lang="scss" scoped>
  .slick_txt{
    width:30%;
    height: 100%;
    position: absolute;
    background-color: transparent;
    transition: all 500ms ease;
    -webkit-transition:all 500ms ease; 
    background-repeat: no-repeat;
    font-size: 0;
    outline: none;
    border:0;
  }
  .left{
    left: 0;
  }
  .right{
    right: 0;
  }
  .swiper-button-prev.swiper-button-white{
    background-image: url('../../public/assets/imgs/ban_prev.png')
  }
  .swiper-button-next.swiper-button-white{
    background-image: url('../../public/assets/imgs/ban_next.png')
  }
  .slick_txt:hover .swiper-button-prev,.slick_txt:hover .swiper-button-next{
    opacity : 1; 
    transition: all .3s cubic-bezier(.645, .045, .355, 1);
  }
  .swiper-button-prev,.swiper-button-next{ 
    opacity : 0; 
    transition: all .3s cubic-bezier(.645, .045, .355, 1);
  }
  .swiper-button-prev:hover{
    opacity : 1!important; 
  }
  .swiper-button-prev:hover.swiper-button-white{
    background-image: url('../../public/assets/imgs/ban_prev_hover.png')
  }
  .swiper-button-next:hover{
    opacity : 1!important; 
  }
  .swiper-button-next:hover.swiper-button-white{
    background-image: url('../../public/assets/imgs/ban_next_hover.png')
  }
  .swiper-item{
    width: 100%;
    height: 400px;
    text-align: center;
    line-height: 400px;
    background: rgb(126, 119, 119);
  }
</style>