<template>
  <div>
    <div :class="className" ref="chart" :style="{height:height,width:'100%'}"></div>
    <div v-if="isShowTips" class="el-popover" :style="tipStyle">{{tipText}}</div>
  </div>
</template>

<script>
import echarts from "./common.js";
import mixins from "./mixins";
import "echarts/lib/chart/gauge";
import { isUndefined } from 'lodash';
export default {
  mixins: [mixins],
  props: {
    className: {
      type: String,
      default: "chart"
    },
    height: {
      type: String,
      default: "270px"
    },
    config: { handle: '' },
    option: {},
    tipText: ''
  },
  watch: {
    option(newVal) {
      this.initChart()
    }
  },
  data() {
    return {
      chart: null,
      isShowTips: false,
      tipStyle: {
        left: 0,
        top: 0
      }
    };
  },
  mounted() {
    this.initChart();
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$refs.chart);
      this.chart.showLoading();
      this.chart.off("click");
      if (typeof this.config.handle == "function") {
        this.chart.on("click", this.config.handle.bind(this));
      }
      this.chart.setOption(this.option, true);
      this.chart.hideLoading();

      this.chart.on('mouseover', (params) => {
        if (params.componentType === 'title') {
          this.tipStyle.left = params.event.event.offsetX - 300 + 'px'
          this.tipStyle.top = params.event.event.offsetY + 15 + 'px'
          this.isShowTips = true
        }
      });
      this.chart.on('mouseout', (params) => {
        if (params.componentType === 'title') {
          this.isShowTips = false
        }
      });
    }
  }
};
</script>

<style>
</style>
