<template>
    <div 
        class="vk-sca-chart-ct" 
        v-loading="chart_loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(255, 255, 255, 1)"
    >
        <div>
            <scatter-chart
                v-if="chartShow"
                ref="incom_chart"
                :option="chart_data_real"
                :config="{'handle':null}"
                height="400px"
            ></scatter-chart>
            <div v-else class="blank">
                <img :src="emptyIcon" alt="暂无数据" />
                <p>暂无数据</p>
            </div>
        </div>
        <div style="margin-top:20px;">
            <bar-chart 
                v-if="chartTshow"
                :option="line_data"
                :config="{'handle':null}"
                height="295px"
            /> 
            <div v-else class="blank">
                <img :src="emptyIcon" alt="暂无数据" />
                <p>暂无数据</p>
            </div>
        </div>    
    </div>
</template>
<script>
import api from '@/api/';
import moment from 'moment';
import mixins from '@/constants/mixins';
import { cloneDeep, isEmpty, isNull } from 'lodash';
import { ScatterChart, BarChart, LineChart } from "@/components/chart/index";
import { scatterOption, tourLineOption } from "@/constants/options";
import emptyIcon from '@public/assets/imgs/blank.png';//空白

export default {
    mixins: [mixins],
    props: [
        "custId",
        "radioCheck",
        "businessCode",
        "dateValue",
        "countData"
    ],
    components: {
        "bar-chart": BarChart,
        "scatter-chart": ScatterChart
    },
    data(){
        return{
            emptyIcon,
            scatterOption,
            chart_data:{},//圈图
            line_data: {},//折线图
            chart_loading: true,
            chartShow: true,//无数据展示
            chartTshow: true,
        }
    },
    mounted(){
    },
    watch: {
        custId(newVal){
            const { custId, radioCheck, businessCode, dateValue } = this;
            
            if(radioCheck=='1'){
                const date1 = isNull(dateValue)?'':dateValue[0];
                const date2 = isNull(dateValue)?'':dateValue[1];

                this.getCustTrip(newVal,businessCode,date1,date2);
                this.getCustEvalute(newVal,businessCode,date1,date2);
            }
        },
        businessCode(newVal){//产业态切换
            const { custId, radioCheck, businessCode, dateValue } = this;
            
            if(radioCheck=='1'){
                const date1 = isNull(dateValue)?'':dateValue[0];
                const date2 = isNull(dateValue)?'':dateValue[1];
                
                this.getCustTrip(custId,newVal,date1,date2);
                this.getCustEvalute(custId,newVal,date1,date2);
            }
        },
    },
    computed: {
        chart_data_real(){
            return this.chart_data
        },
    },
    methods: {
        //客户旅程画像详情
        getCustTrip(custId,businessCode,startDateStr,endDateStr){
            const chart_data = cloneDeep(scatterOption);

            if(!businessCode){return false}
            this.chart_loading = true;
            api.custTrip({
                custId,
                businessCode,
                startDateStr,
                endDateStr
            }).then(res => {
                if(res.success){
                    // 数据在这里获取
                    var offlineData=[],onlineData=[];

                    res.data.customerTripVos.map(res => {  
                        res.offlineVos.map(res => {
                            //线下
                            const times = moment(res.eventTime).hours() * 60 * 60 + moment(res.eventTime).minutes()*60 + moment(res.eventTime).second()
                            offlineData.push([moment(res.eventTime).format('YYYY-MM-DD'),times,res.eventType*40,res.eventName,res.eventStr])
                        })
                        res.onlineVos.map(res => {
                            //线上
                             const times = moment(res.eventTime).hours() * 60 * 60 + moment(res.eventTime).minutes()*60 + moment(res.eventTime).second()
                            onlineData.push([moment(res.eventTime).format('YYYY-MM-DD'),times,res.eventType*40,res.eventName,res.eventStr])
                        })
                    })
                    
                    if(isEmpty(offlineData)&&isEmpty(onlineData)){this.chartShow = false;}else{this.chartShow = true}

                    // 根据时间排序（非日期）
                    offlineData.sort((a,b)=>{
                        if(a[1]>b[1]) 
                            return -1
                        else 
                            return 1
                    })
                    onlineData.sort((a,b)=>{
                        if(a[1]>b[1]) 
                            return -1
                        else 
                            return 1
                    })
                    chart_data.series[0].data = offlineData;
                    chart_data.series[1].data = onlineData;
                    this.chart_data = chart_data;
                    this.$emit('countData', {pointCount: res.data.pointCount,dealCount:res.data.dealCount});
                }else{
                    this.commonAlert(res);
                }
                this.chart_loading = false;
            })
        },
        //客户评价详情
        getCustEvalute(custId,businessCode,startDateStr,endDateStr){
            const line_data = cloneDeep(tourLineOption); 

            if(!businessCode){return false}
            api.custEvalute({
                custId,
                businessCode,
                startDateStr,
                endDateStr
            }).then(res => {
                if(res.success){
                    if(isEmpty(res.data)){this.chartTshow = false}else{this.chartTshow = true}
                    line_data.xAxis.data = res.data.map(res => {
                        return moment(res.evaluateDate).format('YYYY-MM-DD')
                    })
                    line_data.series[0].data = res.data.map(res => {
                        return {
                            evaluateDate: res.evaluateDate,
                            evaluateEvent: res.evaluateEvent,
                            value: res.evaluate==0?'一般':res.evaluate==1?'满意':'不满意'
                        }
                    })
                    this.line_data = line_data;
                }else{
                    this.commonAlert(res)
                }
            })
        }
    }
}
</script>
<style lang="scss">
    .vk-sca-chart-ct{
        padding: 30px 0 0 0;
        .blank{
            background: #fff;
            text-align: center;
            padding: 24px 0;
            img{
                width: 250px;
            }
            p{
                position: relative;
                left: 8px;
                font-size: 14px;
                color: #666666;
                margin: 24px 0;
            }
        }
    }
</style>
