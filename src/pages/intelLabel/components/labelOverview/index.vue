<template>
    <div class="vk-label-ov-ct">   
        <el-tabs v-model="activeTab" class="navTabs" @tab-click="handleTabsChange">
            <el-tab-pane v-for="(tab,index) in tabsData" :key="index" :label="`${tab.objectName}(${tab.total})`" :name="tab.objectId" ></el-tab-pane>
        </el-tabs>
        <div class="vk-label-ov-content">
            <el-row :gutter="16">
                <el-col :span="6">
                    <div 
                        class="vk-label-docker" 
                        v-loading="loading_arr.load1"
                        element-loading-spinner="el-icon-loading"
                        element-loading-background="rgba(255, 255, 255, 1)"
                    >
                        <div class="title">标签类型</div>
                        <div class="vk-charts">
                            <div class="background_info">
                                <p class="info_num">{{chartsData.labelTypeTotal}}</p>
                                <p class="info_title">标签总数</p>
                            </div>
                            <pie-chart 
                                :option="chartsData.labelType"
                                :config="{'handle':null}"
                            ></pie-chart>
                        </div>
                    </div>
                    <div 
                        class="vk-label-docker" 
                        style="margin-top:16px"
                        v-loading="loading_arr.load2"
                        element-loading-spinner="el-icon-loading"
                        element-loading-background="rgba(255, 255, 255, 1)"
                    >
                        <div class="title">公私占比</div>
                        <div class="vk-charts">
                            <div class="background_info">
                                <p class="info_num">{{chartsData.propTypeTotal}}</p>
                                <p class="info_title">标签总数</p>
                            </div>
                            <pie-chart 
                                :option="chartsData.propType"
                                :config="{'handle':null}"
                            ></pie-chart>
                        </div>
                    </div>
                </el-col>
                <el-col :span="10">
                    <div 
                        class="vk-label-docker" 
                        style="height: 654px;"
                        v-loading="loading_arr.load3"
                        element-loading-spinner="el-icon-loading"
                        element-loading-background="rgba(255, 255, 255, 1)"
                    >
                        <div class="title">分类统计</div>
                        <div class="vk-charts">
                            <bar-chart 
                                :option="chartsData.typeCount"
                                :config="{'handle':null}"
                                :height="'600px'"
                            ></bar-chart>
                        </div>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div 
                        class="vk-label-docker"
                        v-loading="loading_arr.load4"
                        element-loading-spinner="el-icon-loading"
                        element-loading-background="rgba(255, 255, 255, 1)"
                    >
                        <div class="title">热门标签（前20）</div>
                        <div class="vk-charts">
                            <!-- <div class="background_info" style="top:20%">
                                <div class="circle">
                                    <div style="position:absolute;top:0;right:0;left:0;padding:50px">
                                        <div class="circle">
                                            <div style="position:absolute;top:0;right:0;left:0;padding:50px">
                                                <div class="circle background"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div> -->
                            <word-cloud
                                :option="chartsData.hotWord"
                                :config="{'handle':null}"
                                :height="'600px'"
                            >
                            </word-cloud>
                        </div>
                    </div>
                </el-col>
            </el-row>
            <el-row style="margin-top:16px">
                <el-col :span="24">
                    <p style="padding: 10px 0;font-size: 14px;">标签概况</p>
                    <el-table
                        ref="bindTable"
                        :border="true"
                        tooltip-effect="dark"
                        :data="labelUserTotal"
                        v-loading="tableLoading"
                        @sort-change="handleSortChange"
                    >
                        <el-table-column prop='tagName' label='标签名' />
                        <el-table-column prop='tagClass1Name' label='标签大类' />
                        <el-table-column prop='tagClass2Name' label='标签类别' />
                        <el-table-column prop='tagDesc' label='标签描述' show-overflow-tooltip />
                        <el-table-column prop='createTime' label='创建时间' min-width="120px" />
                        <el-table-column prop='usedCnt' label='客户数' min-width="120px" />
                        <!-- <el-table-column prop='enabled' label='启用'>
                            <template slot-scope="scope">
                                <el-switch v-model="scope.row.enabled" @change="(value)=>handleEnabled(scope.row,value)"></el-switch>
                            </template>
                        </el-table-column> -->
                    </el-table>
                    <el-pagination
                        v-if="pagination.total"
                        background
                        :page-size="10"
                        highlight-current-row
                        @current-change="pnCurrentChange"
                        :current-page.sync="pagination.pageNo"
                        layout="total, prev, pager, next, jumper"
                        :total="pagination.total"
                        style="float: right;padding: 20px 0;"
                    />
                </el-col>
            </el-row>
        </div>
    </div>
</template>
<script>
import api from '@/api/';
import moment from 'moment';
import mixins from '@/constants/mixins';
import common from '@/constants/common';
import { cloneDeep, isNull, sortBy, random } from 'lodash';
import { PieChart, BarChart, LineChart, ScatterChart, WordCloud } from "@/components/chart/index";
import { barOption } from "@/constants/options";
import { viewPieOption, wordCloudOption } from './options.js'
export default {
    mixins: [mixins],
    components: {
        "bar-chart": BarChart,
        "pie-chart": PieChart,
        "line-chart": LineChart,
        "scatter-chart": ScatterChart,
        "word-cloud": WordCloud
    },
    data(){
        return{
            tabsData:[],//tabs数据
            activeTab: '',//当前选中的tab
            loading_arr: {
                load1: true,
                load2: true,
                load3: true,
                load4: true,
            },
            chartsData:{
                labelType:cloneDeep(viewPieOption),//标签类型数据
                propType: cloneDeep(viewPieOption),//公私占比
                labelTypeTotal: 0,
                propTypeTotal: 0,
                typeCount:cloneDeep(barOption),//分类统计数据
                hotWord: cloneDeep(wordCloudOption)//热词云
            },
            extendParams:{
                field:undefined,
                sort:'desc'
            },//表格所需参数
            tableLoading:true,
            labelUserTotal:[],//标签使用统计
            pagination: {
                pageNo: 1,
                pageSize: 10,
                total: 0
            }
        }
    },
    mounted(){
        this.getTabsData();
    },
    watch: {
        activeTab(newVal){
            const { pageNo, pageSize } = this.pagination;

            if(newVal==0){return false}
            this.getChartsData(newVal);
            this.getTableList(newVal,pageNo,pageSize)
        }
    },
    computed:{
    },
    methods: {
        /* 获取表格数据 */
        getTableList(objectId,pageNo,pageSize){
            this.tableLoading = true;
            api.tagHotTags({objectId,pageNo,pageSize}).then(res => {
                if(res.success){
                    res.data.data.forEach(res => {res.createTime = moment(res.createTime).format('YYYY-MM-DD HH:mm:ss')})
                    this.labelUserTotal = res.data.data;
                    this.pagination.total = res.data.total;
                }else{
                    this.commonAlert(res);
                }
                this.tableLoading = false;
            })
        },
        /* tabs的切换函数 */
        handleTabsChange(value){
            this.loading_arr = Object.assign({}, this.loading_arr, {load1: true,load2: true,load3: true,load4: true})
        },
        /* 启用 */
        handleEnabled(row,value){
            const { activeTab } = this;

            api.tagStatuSingle({
                tagId: row.tagId,
                status: row.enabled?1:0,
            }).then(res => {
                this.commonAlert(res);
                // this.getTableData(activeTab);wwwwwwwwww
            })
        },
        /* 表格排序函数 */
        handleSortChange(column, props, order){
            console.group();
            console.log("column:", column);
            console.log("props:", props);
            console.log("order:", order);
            console.groupEnd();
            this.extendParams.field = column.prop || undefined;
            this.extendParams.sort = column.order == "ascending" ? "asc" : "desc";
            this.getTableData();
        },
        /* 处理标签类型数据 */
        handleLabelType(data){
            let total = 0;
            data.series[0].data.forEach((item)=>{
                total = total + parseInt(item.value);
            })
            this.chartsData.labelTypeTotal = total;//标签类型总数
            let options = this.chartsData.labelType;
            options.legend = {
                orient: 'horizontal',
                bottom:0,
                itemWidth:12,
                x: 'center',
                data:data.xaxis,
                selectedMode: false,
            };
            options.series[0].name = '标签占比';
            options.color = ['#397bff','#5dd089','#783cff'];
            options.series = options.series.map((item)=>{
                item.data = data.series[0].data;
                item.selectedOffset = 1;
                item.radius =  ['60%', '80%'];
                return item;
            })
            this.loading_arr.load1 = false;
            this.$set(this.chartsData,'labelType',options);
        },
        /* 处理公司占比 */
        handlePropType(data){
            let total = 0;
            data.series[0].data.forEach((item)=>{
                total = total + parseInt(item.value);
            })
            this.chartsData.propTypeTotal = total;//标签类型总数
            let options = this.chartsData.propType;
            options.legend = {
                orient: 'horizontal',
                bottom:0,
                itemWidth:12,
                x: 'center',
                data:data.xaxis,
                selectedMode: false,
            };
            options.series[0].name = '标签占比';
            options.color = ['#397bff','#5dd089','#783cff'];
            options.series = options.series.map((item)=>{
                item.data = data.series[0].data;
                item.selectedOffset = 1;
                item.radius =  ['60%', '80%'];
                return item;
            })
            this.loading_arr.load2 = false;
            this.$set(this.chartsData,'propType',options);
        },
        /* 处理分类统计数据 */
        handleTypeCount(data){
            let options = this.chartsData.typeCount;
            options.xAxis = { type: 'value' ,show: false};
            options.yAxis = {
                type: 'category',
                data: data.xaxis,
                axisTick:{
                    show:false,  
                },
            }
            options.legend.data = data.series.map((item)=>{
                return item.name;
            })
            options.grid = {
                top: '8%',
                left: '3%',
                right: '4%',
                bottom: '0',
                containLabel: true
            };
            options.color = ['#397bff','#5dd089'];
            options.series = data.series.map((item,index)=>{
                item.stack = '总量';
                // item.label = {
                //     normal: {
                //         show: true,
                //         position: 'insideLeft'
                //     }
                // };
                item.barWidth = '40%';
                return item;
            });
            this.loading_arr.load3 = false;
            this.$set(this.chartsData,'typeCount',options);
        },
        /* 处理热门标签 */
        handleHotLabel(data){
            let options = this.chartsData.hotWord;
    
            options.series[0].data = data.series[0].data;
            this.$set(this.chartsData,'hotWord',options);
            this.loading_arr.load4 = false;
        },
        getTabsData(){
            api.tagIndexCommon({}).then(res => {
                if(res.success){
                    res.data.forEach(res => {res.objectId = (res.objectId).toString();})
                    this.tabsData = res.data;
                    this.activeTab = res.data.length ? res.data[0].objectId : '';
                }else{
                    this.commonAlert(res)
                }
            })
        },
        //获取标签数量
        getChartsData(objectId){
            this.loading_arr.load1 = true;
            this.loading_arr.load2 = true;

            api.tagIndexType({objectId}).then(res => {
                if(res.success){
                    let main = {
                        data:{
                            labelType:{
                                xaxis:['原子标签','衍生标签','自定义标签'],
                                series:[{
                                    type:'pie',
                                    data:[{
                                        name:'原子标签',
                                        value: res.data.atomTagCnt,
                                    },{
                                        name:'衍生标签',
                                        value: res.data.dtagCnt
                                    },{
                                        name:'自定义标签',
                                        value: res.data.ctagCnt
                                    }]
                                }],
                            },
                            propType: {
                                xaxis:['公有','私有'],
                                series:[{
                                    type:'pie',
                                    data:[{
                                        name:'公有',
                                        value: res.data.publicTagCnt,
                                    },{
                                        name:'私有',
                                        value: res.data.privateTagCnt
                                    }]
                                }],
                            },
                        }
                    };
                    this.handleLabelType(main.data.labelType);
                    this.handlePropType(main.data.propType);
                }else{
                    this.commonAlert(res)
                }
            })

            api.tagIndexUse({objectId}).then(res => {
                this.loading_arr.load3 = true;
                this.loading_arr.load4 = true;
                
                if(res.success){
                    let main = {
                        data:{
                            typeCount:{
                                xaxis: res.data.tagClassStatList.map(res => {return res.tagClassName}),
                                series:[{
                                    type: 'bar',
                                    name: "总量",
                                    data: res.data.tagClassStatList.map(res => {return res.unusedCnt + res.usedCnt})
                                },{
                                    type: 'bar',
                                    name: "已使用数",
                                    data: res.data.tagClassStatList.map(res => {return res.usedCnt})
                                }]
                            },
                            hotLabel:{
                                series: [{
                                    type: 'wordCloud',
                                    gridSize: 20,
                                    sizeRange: [12, 50],
                                    rotationRange: [0, 0],
                                    shape: 'circle',
                                    textStyle: {
                                        normal: {
                                            color: function() {
                                                return 'rgb(' + [
                                                    Math.round(Math.random() * 160),
                                                    Math.round(Math.random() * 160),
                                                    Math.round(Math.random() * 160)
                                                ].join(',') + ')';
                                            }
                                        },
                                        emphasis: {
                                            shadowBlur: 10,
                                            shadowColor: '#333'
                                        }
                                    },
                                    data: res.data.top20Tags.map((res,index) => {return {name: res.tagName, value: res.count}})
                                }]
                            }
                        }
                        // res.data.tagHotUsedStat.map(res => {return {name: res.tagName, value: res.usedCnt}})
                    }
                    this.handleTypeCount(main.data.typeCount);
                    this.handleHotLabel(main.data.hotLabel);
                }else{
                    this.commonAlert(res)
                }
            })
            this.pageLoading = false;
        },
        //翻页切换
        pnCurrentChange(val){
            const { activeTab } = this;

            this.pagination.pageNo = val;
            this.getTableList(activeTab,val,10)
        }

    }
}
</script>
<style lang="scss" scoped>
    .vk-label-ov-ct{
        background: #fff;
        padding: 0px 28px;
        .navTabs{
            .el-tabs__nav-wrap{
                &::after{
                    background-color:transparent;
                }
                .el-tabs__active-bar{
                    width: 20px !important;
                    height: 4px;
                    background-color: #397bff;
                    border-radius: 10px;
                    left:18px;
                }
                .el-tabs__item{
                    font-size: 10px;
                    // padding:0 12px;
                    letter-spacing: 0px;
                    color: #999999;
                    &.is-active{
                        font-size: 14px;
                        // padding-left:0;
                        color: #000000;
                    }
                }
            }
        }
        .vk-label-docker{
            background-color:#fff;
            border-radius: 4px;
	        border: solid 1px #f5f5f5;
            padding:16px;
            .title{
                font-size: 14px;
                height:15px;
                line-height: 15px;
                color: #000000;
            }
            .vk-charts{
                position: relative;
                .background_info{
                    position: absolute;
                    top:40%;
                    text-align: center;
                    width:100%;
                    .info_num{
                        font-family: DIN Condensed;
                        font-size: 26px;
                        line-height: 36px;
                        color: #000000;
                    }
                    .info_title{
                        font-size: 12px;
                        line-height: 17px;
                        color: #999999;
                    }
                    .circle{
                        box-sizing: border-box;
                        width: 100%;
                        height: 0;
                        padding-top: 100%;
                        border-radius: 100%;
                        border: 1px dashed #e0e0e0;
                        position: relative;
                        .background{
                            background-color: #f5f5f5;
                        }
                    }
                }
            }
        }
    }
</style>
