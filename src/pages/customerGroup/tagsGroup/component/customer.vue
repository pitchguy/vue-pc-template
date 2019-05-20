<template>
    <div class="vk-customer" v-loading="chartLoading">
        <div class="vk-toolCheckbox" v-if="checkbox.length">
            <span class="title">分析维度：</span>
            <div style="display:inline-block;width:90%;">
                <el-checkbox-group :disabled="ifGroupShow" v-model="checkedBox" @change="handleCheckboxChange">
                    <el-checkbox :label="check.tagClass" v-for="(check,index) in checkbox" :key="index" :sync="check.tagClass" class="vk-checkbox">
                        {{check.tagClassName}}
                    </el-checkbox>
                </el-checkbox-group>
            </div>
        </div>
        <div v-else>
            <div class="vk-tips">暂无数据，请添加标签</div>
        </div>
        <el-row :gutter="20">
            <el-col :span="8" v-for="(chartList,index) in chartLists" :key="index" :class=" index > 2 && 'mt30' ">
                <div class="vk-analysis">
                    <div class="clearfix header">
                        <div class="fl">{{chartList.tagClassName}}</div>
                        <div class="fr">
                            <el-select class="selecter" v-model="chartList.chartType" size="mini" @change="(value)=>handleSelecter(value,chartList)">
                                <el-option :key="0"  label="饼图" value="0"></el-option>
                                <el-option :key="1"  label="柱状图" value="1"></el-option>
                            </el-select>
                        </div>
                    </div>
                    <div>
                        <template v-if="chartList.chartType == '0'">
                            <pie-chart 
                                :option="chartList.pie_chart_data"
                                :config="{'handle':null}"
                            ></pie-chart>
                        </template>
                        <template v-else-if="chartList.chartType == '1'">
                            <bar-chart 
                                :option="chartList.bar_chart_data"
                                :config="{'handle':null}"
                            ></bar-chart>
                        </template>
                    </div>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import api from '@/api/';
import mixins from '@/constants/mixins';
import { cloneDeep, isEmpty, isUndefined, find, compact } from 'lodash';
import { PieChart, BarChart } from "@/components/chart/index";
import { barOption, labelPieOption } from "@/constants/options";
export default {
    mixins: [mixins],
    props: ['chartData','data',"cityPjData"],
    components: {
        "pie-chart": PieChart,
        "bar-chart": BarChart,
    },
    data () {
        return {
            barOption,
            labelPieOption,
            chartLoading: false,/* 分析纬度loading */
            checkedBox:[],/* 复选框的model */
            chartLists: [],/* 图表 */
            checkbox: [],/* 分析纬度checkbox */
        }
    },
    watch: {
        cityPjData: {
            handler(newValue, oldValue) {
                const { chartData } = this;
                const { cityName, projectName } = newValue;
                
                if(isEmpty(this.data)&&isEmpty(cityName)&&isEmpty(projectName)){
                    //标签为空时全部数据清空
                    this.checkedBox = [];
                    this.chartLists = [];
                }else{
                    const newList = this.chartLists.map(res => {
                        const pie_chart = cloneDeep(labelPieOption);//饼图数据
                        const bar_chart = cloneDeep(barOption);//柱状图数据
                        const common_legend = chartData[res.tagClass].map(res => {return res.className});
                    
                        pie_chart.legend.data = common_legend;
                        pie_chart.series[0].data = chartData[res.tagClass].map(res => {
                            return {
                                name: res.className,
                                value: res.count
                            }
                        });
                        res.pie_chart_data = pie_chart

                        bar_chart.legend.data = common_legend;
                        bar_chart.xAxis[0].data = common_legend;
                        bar_chart.grid.top = "5%";
                        bar_chart.series = [
                            {
                                name: "",
                                type: "bar",
                                barWidth: "30%",
                                data: chartData[res.tagClass].map(res => {
                                    return res.count
                                })
                            },
                        ]

                        res.bar_chart_data = bar_chart;
                        return res
                    })
                    this.chartLists = newList;
                }
    　　　   },
    　　　　 deep: true
        },
        chartData(newVal){
            const { cityName, projectName } = this.cityPjData;
            
            if(isEmpty(this.checkedBox)){
                if(!isEmpty(this.data)||!isEmpty(cityName)||!isEmpty(projectName)){
                    let checkedType = _.compact(this.checkbox.map(res => {
                        if(res.defaultCheck){return res.tagClass}
                    }))
                    this.checkedBox = checkedType;
                    this.handleCheckboxChange(checkedType)
                }
            }
            if(isEmpty(this.data)&&isEmpty(cityName)&&isEmpty(projectName)){
                //标签为空时全部数据清空
                this.checkedBox = [];
                this.chartLists = [];
            }else{          
                const newList = this.chartLists.map(res => {
                    const pie_chart = cloneDeep(labelPieOption);//饼图数据
                    const bar_chart = cloneDeep(barOption);//柱状图数据
                    const common_legend = newVal[res.tagClass].map(res => {return res.className});
                
                    pie_chart.legend.data = common_legend;
                    pie_chart.series[0].data = newVal[res.tagClass].map(res => {
                        return {
                            name: res.className,
                            value: res.count
                        }
                    });
                    res.pie_chart_data = pie_chart

                    bar_chart.legend.data = common_legend;
                    bar_chart.xAxis[0].data = common_legend;
                    bar_chart.grid.top = "5%";
                    bar_chart.series = [
                        {
                            name: "",
                            type: "bar",
                            barWidth: "30%",
                            data: newVal[res.tagClass].map(res => {
                                return res.count
                            })
                        },
                    ]

                    res.bar_chart_data = bar_chart;
                    return res
                })
                console.log('执行吧',newList)
                this.chartLists = newList;
            }
        },
        immediate:true,
        deep:true
    },
    created(){
        this.analyseLatAction();
    },
    mounted () {
        
    },
    computed: {
        ifGroupShow(){
            const { cityName, projectName } = this.cityPjData;

            return isEmpty(this.data)&&isEmpty(cityName)&&isEmpty(projectName)
        },
    },
    methods: {
        //获取客群分析纬度checkbox
        analyseLatAction(){
            api.getUsedAnalyseLat().then(res => {
                if(res.success){
                    this.checkbox = res.data;
                }else{
                    this.commonAlert(res);
                }
            })
        },
        
        /* 切换图表类型 */
        handleSelecter(value,item){
            //TODO 请求数据
            let index = this.chartLists.findIndex((o)=>o.tagClassName == item.tagClassName);
            if(index != -1){
                this.chartLists[index].chartType = value;
            }
        },
        /* 多选框 */
        handleCheckboxChange(value){
            const { checkbox } = this;//所有值
            const selectValue = value.map(res => {return _.find(checkbox,{tagClass: res})});
            
            if(isEmpty(this.chartData)){return}else{
                //TODO 请求获取数据
                this.chartLists = selectValue.map((item)=>{
                    const pie_chart = cloneDeep(labelPieOption);//饼图数据
                    const bar_chart = cloneDeep(barOption);//柱状图数据
                    const common_legend = this.chartData[item.tagClass].map(res => {return res.className});

                    pie_chart.legend.data = common_legend;
                    pie_chart.series[0].data = this.chartData[item.tagClass].map(res => {
                        return {
                            name: res.className,
                            value: res.count
                        }
                    });
                    bar_chart.legend.data = common_legend;
                    bar_chart.xAxis[0].data = common_legend;
                    bar_chart.grid.top = "5%";
                    bar_chart.series = [
                        {
                            name: "",
                            type: "bar",
                            barWidth: "30%",
                            data: this.chartData[item.tagClass].map(res => {
                                return res.count
                            })
                        },
                    ]

                    this.$set(item,'pie_chart_data',pie_chart);//设置饼状图信息
                    this.$set(item,'bar_chart_data',bar_chart);//设置柱状图信息

                    !item.chartType && this.$set(item,'chartType','0')//默认为饼图
                    return item;
                })
            }
            this.chartLoading = false;
        }
    }
}
</script>

<style lang="scss" scoped>
    .vk-customer{
        width:100%;
        padding:15px 30px;
        .mt30{
            margin-top:30px;
        }
        .vk-tips{
            font-size: 14px;
            color: #999999;
            text-align: center;
            padding:42px 0;
        }
        .vk-toolCheckbox{
            margin-bottom:20px;
            .title{
                font-size: 14px;
                color: #666666;
                width:8%;
                vertical-align: top;
                display: inline-block;
            }
            .vk-checkbox{
                width:150px;
                margin:0;
            }
        }
        .vk-analysis{
            min-height: 300px;
            background: #FFFFFF;
            border: 1px solid #E8E8E8;
            .header{
                padding: 16px 12px;
                font-size: 14px;
                color: rgba(0,0,0,0.85);
            }
            .selecter{
                width:90px;
                height:24px;
            }
        }
    }
</style>
