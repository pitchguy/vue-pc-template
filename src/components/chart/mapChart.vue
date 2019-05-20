<template>
  <div :class="className" ref="chart"  :style="{height:height,width:'100%'}"/>
</template>

<script>
import echarts from "./common.js";
import mixins from "./mixins";
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/geo'
import 'echarts/lib/chart/map' //引入地图
import 'echarts/lib/chart/lines'
import 'echarts/lib/chart/effectScatter'
import 'echarts/map/js/china'
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
    config:{handle:''},
    option:{}
  },
  data() {
    return {
      chart: null,
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
      this.chart.setOption(this.option,true);
      this.chart.hideLoading();
    }
  }
};
</script>

<style>
</style>
