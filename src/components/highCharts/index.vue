<template>
  <div ref="chart" class="highcharts-container"  ></div>
</template>

<script>
import mixins from '../chart/mixins';
import Highcharts from 'highcharts/highstock';
import HighchartsMore from 'highcharts/highcharts-more';
import HighchartsDrilldown from 'highcharts/modules/drilldown';
import Highcharts3D from 'highcharts/highcharts-3d';
const debounce = require('lodash.debounce');

HighchartsMore(Highcharts)
HighchartsDrilldown(Highcharts);
Highcharts3D(Highcharts);

export default {
    mixins: [mixins],
    props: {
        styles: {
            type: Object,
            default: {
                height: '400px',
                width: '100%'
            }
        },
        options: {},
    },
    // props: ['options', 'styles'],
    name: 'highcharts',
    watch: {
        option: {
            handler: function (oldVal, newVal) {
                console.log(111)
                this.initChart()
            },
            deep: false
        }
    },
    data(){
        return {
            chart: null
        }
    },
    mounted() {
        this.initChart();
    },
    beforeDestroy(){
        if (this.chart) {
            this.chart.destroy();
        }
        this.chart = null;
    },
    methods: {
        initChart() {
            const { width, height } = this.styles;
            
            this.$refs.chart.style.width = (width || '100%');
            this.$refs.chart.style.height = (height || '400px');

            this.$nextTick(() => {
                this.chart = new Highcharts.Chart(this.$refs.chart, this.options)
            })
        }
    }
}
</script>

<style lang="scss">
  .highcharts-container {
    width: 800px;
    height: 400px;
  }
</style>