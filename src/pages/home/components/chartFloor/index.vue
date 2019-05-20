<template>
    <div class="vk-home-chart-ct" v-loading="loading">
        <div class="m-ct">
            <div class="floor_o">
                <p>{{defaultArea}}</p>
            </div>
            <el-row class="floor_th">
                <el-col :span="5">
                    <!-- 今日成交客户数 -->
                    <div class="body-ct">
                        <div v-if="chartType.today_chart" style="position:relative;">
                            <bar-chart :option="deal_data" :config="{'handle':null}" height="260px" 
                            tipText='今天新增成交客户数（每30分钟更新一次）'></bar-chart>
                        </div>
                        <div v-else class="chart-empty-c">
                            <i class="el-icon-warning icon"></i>
                            <span class="word">暂无数据</span>
                        </div>
                    </div>
                    <!-- 数据概览 -->
                    <div class="data-ct">
                        <p class="title">数据概览</p>
                        <ul class="dt-ct">
                            <li class="dt-ct-li" v-for="child in cus_data_list" :key="child.name">
                                <img :src="child.icon" alt="业态图标签" />
                                <ul class="dt-ct-li-ul">
                                    <li class="tag1">
                                        {{child.name}}
                                        <el-popover
                                            ref="popover"
                                            placement="right"
                                            width="200"
                                            trigger="hover"
                                            :content="child.desc"
                                            style="position:relative;top:-1px;"
                                        >
                                        <img slot="reference" src="/question.svg" style="width:16px;height:16px;position:relative;top:2px;" alt="问号icon" />
                                        </el-popover>
                                    </li>
                                    <li class="tag2">{{child.data}}</li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </el-col>
                <el-col :span="11">
                    <!-- 权限树下拉框，flat属性比较重要 -->
                    <tree-select 
                        ref="treeSelect"
                        v-model="treeSelect" 
                        :flat="true"
                        :multiple="false" 
                        :clearable="false"
                        :options="treeSource" 
                        :normalizer="normalizer"
                        :load-options="loadOptions"
                        placeholder="请选择"
                        noOptionsText="暂无数据"
                        noResultsText="没找到对应数据"
                        noChildrenText="暂无数据"
                        style="width:200px;"
                        @select="treeSelectAction"
                    />
                    <!-- map地图 -->
                    <map-chart
                        :mapData="mapData"
                        :changeObj="changeObj"
                        :config="{'handle':null}"
                        @requestData="requestData"
                    ></map-chart>
                </el-col>
                <el-col :span="5">
                    <!-- 客户浓度 -->
                    <div class="concen-ct">
                        <gauge-chart
                            :option="liquid_data"
                            :config="{'handle':null}"
                            height="260px"
                            tipText="近7天活跃客户（所有与万科产生过接触的客户）在总客户量的占比。"
                        />
                    </div>
                    <!-- 客户满意度（近30日) -->
                    <div class="satisfy-ct">
                        <gauge-chart
                            :option="satify_data"
                            :config="{'handle':null}"
                            height="260px"
                            tipText="近30天内（不含当天）所有调查问卷中，结果为满意的占比。"
                        />
                        
                    </div>
                </el-col>
            </el-row>
            <el-row class="floor_f">
                <el-col :span="5">
                    <div v-if="chartType.job_chart" style="position:relative;">
                        <pie-chart
                            :option="job_chart_data"
                            :config="{'handle':null}"
                            height="310px"
                            tip-text='全体客户中所在行业的分布情况'
                        ></pie-chart>
                    </div>
                    <div v-else class="chart-empty-c">
                        <i class="el-icon-warning icon"></i>
                        <span class="word">暂无数据</span>
                    </div>
                </el-col>
                <el-col :span="5">
                    <div v-if="chartType.age_chart" style="position:relative;">
                        <pie-chart
                            :option="age_chart_data"
                            :config="{'handle':null}"
                            height="310px"
                            tip-text='全体客户的年龄分布情况'
                        ></pie-chart>
                    </div>
                    <div v-else class="chart-empty-c">
                        <i class="el-icon-warning icon"></i>
                        <span class="word">暂无数据</span>
                    </div>
                </el-col>
                <el-col :span="5">
                    <div v-if="chartType.incom_chart" style="position:relative;">
                        <bar-chart
                            :option="income_data"
                            :config="{'handle':null}"
                            height="310px"
                            tip-text='所有已成交的地产客户的首付比例分布情况'
                        ></bar-chart>
                    </div>
                    <div v-else class="chart-empty-c">
                        <i class="el-icon-warning icon"></i>
                        <span class="word">暂无数据</span>
                    </div>
                </el-col>
                <el-col :span="5">
                    <div v-if="chartType.consu_chart" style="position:relative;">
                        <bar-chart
                            :option="consu_data"
                            :config="{'handle':null}"
                            height="310px"
                            tip-text='所有已成交的地产客户的贷款方式分布情况'
                        ></bar-chart>
                    </div>
                    <div v-else class="chart-empty-c">
                        <i class="el-icon-warning icon"></i>
                        <span class="word">暂无数据</span>
                    </div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
import api from '@/api/';
import { mapState } from 'vuex';
import common from '@/constants/common';
import HomeMapChart from '../mapChart';
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { cloneDeep, find, isUndefined, isEmpty, isNull, mapKeys, includes } from 'lodash';
import { PieChart, BarChart, LineChart, MapChart, LiquidChart, PictChart, GaugeChart } from "@/components/chart/index";
import { indexbarOption, hbarOption, homePieOption, lineOption, mapOption, liquidOption, indexBodyOption, deepConcenOption } from "@/constants/options";

import cusTotalIcon from "@public/assets/imgs/home/cusTotal.png";
import cusActiveIcon from "@public/assets/imgs/home/cusActive.png";
import cusNewIcon from "@public/assets/imgs/home/cusNew.png";

export default {
    components: {
        "tree-select": Treeselect,
        "liquid-chart": LiquidChart,
        "line-chart": LineChart,
        "pie-chart": PieChart,
        "bar-chart": BarChart,
        "gauge-chart": GaugeChart,
        "map-chart": HomeMapChart,
    },
    data(){
        return{
            treeSelect: null,
            treeSource: [],
            normalizer(node) {
                return {
                    id: node.orgId,
                    label: node.orgName,
                    children: node.childOrgs,
                    isDisabled: node.disStatus
                }
            },
            changeObj: {},
            loading: false,
            mapData: [],
            menuSelects: '',
            liquidOption,
            indexbarOption,
            homePieOption,
            mapOption,
            whole_data: [],
            deal_data: {},
            liquid_data: {},
            satify_data: {},
            income_data: {},
            consu_data: {},
            job_chart_data: {},
            age_chart_data: {},
            mainData: {},
            defaultArea: '',
            cus_data_list: [],
            chartType: {
                pict_chart: true,
                job_chart: true,
                age_chart: true,
                incom_chart: true,
                consu_chart: true,
                today_chart: true,
                liq_chart: true,
                sati_chart: true
            }
        }
    },
    created(){
    },
    mounted(){
        if(this.businessCode){this.getBoradTree(this.businessCode);} 
    },
    computed: {
        businessCode(){
            return this.$store.state.home.businessCode; 
        }
    },
    watch: {
        immediate:true,
        deep:true,
        businessCode(newVal){
            console.log(newVal)
            this.getBoradTree(newVal)
        },
        whole_data(newVal){
            if(newVal.length==0){//无数据时的判断
                this.setEmptyWord(['job_chart','age_chart','incom_chart','consu_chart','pict_chart'])
                return false
            }else{
                this.reSetChart(['job_chart','age_chart','incom_chart','consu_chart','pict_chart'])
            }
            
            const job_chart_data = cloneDeep(homePieOption);//职业分布
            const age_chart_data = cloneDeep(homePieOption);//年龄分布
            const income_data = cloneDeep(indexbarOption);//收入分布
            const consu_data = cloneDeep(indexbarOption);//消费分布
            
            newVal.forEach(res => {
                if(res.titleType==1){
                }else if(res.titleType==2){
                    //职业分布赋值
                    if(res.data.length!=0){
                        const jb_ct_data = res.data.map(res => {
                            return {value: res.percent,name: res.key, truValue: res.values}
                        })

                        job_chart_data.title.text = res.titleTypeName +' {a|}';
                        job_chart_data.legend.selectedMode = false;
                        job_chart_data.legend.data = res.data.map(res => {return res.key})
                        job_chart_data.series[0].data = jb_ct_data;
                        this.reSetChart(['job_chart'])
                    }else{
                        this.setEmptyWord(['job_chart'])
                    }
                }else if(res.titleType==3){
                    //年龄分布
                    if(res.data.length!=0){
                        const age_ct_data = res.data.map(res => {
                            return {value: res.percent,name: res.key, truValue: res.values}
                        })

                        age_chart_data.title.text = res.titleTypeName +' {a|}';
                        age_chart_data.legend.selectedMode = false;
                        age_chart_data.legend.data = res.data.map(res => {return res.key})
                        age_chart_data.series[0].data = age_ct_data;
                        this.reSetChart(['age_chart'])
                    }else{
                        this.setEmptyWord(['age_chart'])
                    }
                }else if(res.titleType==4){
                    //收入分布图表
                    if(res.data.length!=0){
                        const incom_chart_data = res.data.map(res => {
                            return { value: res.percent, truValue: res.values }
                        })

                        income_data.title.text = res.titleTypeName +' {a|}';
                        income_data.color = ['#5dd089'];
                        income_data.tooltip = {
                            show: true,
                            trigger: 'axis',
                            backgroundColor: '#FFF',
                            extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);',
                            textStyle: {
                                color: '#000'
                            },
                            formatter: function (params, ticket, callback){
                                const para = params[0];
                                return '<div>'+
                                        '<div style="color: #999999">'+para.name+'</div>'+
                                        '<div style="color: #000000;font-size: 18px;font-family: DIN Condensed;">'+para.data.truValue+'&nbsp;&nbsp;&nbsp;&nbsp;<span style="font-size:16px;color:#397bff;">'+para.data.value+'%</span></div>'
                                        +'</div>'
                            }
                        }
                        
                        // income_data.yAxis[0].name = '人数占比%';
                        income_data.xAxis[0].data = res.data.map(res => {return res.key});
                        income_data.legend.data = res.data.map(res => {return res.key});
                        income_data.series[0].itemStyle = {borderWidth: 5,borderColor: 'rgb(161,214,255,0.4)'}
                        income_data.series = [
                            {
                                name: res.titleTypeName,
                                type: "bar",
                                barWidth: "30%",
                                data: incom_chart_data
                            },
                        ]
                        this.reSetChart(['incom_chart'])
                    }else{
                        this.setEmptyWord(['incom_chart'])
                    }
                }else if(res.titleType==5){
                    //消费分布
                    if(res.data.length!=0){
                        const consu_chart_data = res.data.map(res => {
                            return { value: res.percent, truValue: res.values }
                        });

                        consu_data.title.text = res.titleTypeName +' {a|}';
                        consu_data.color = ['#397bff'];
                        consu_data.tooltip = {
                            show: true,
                            trigger: 'axis',
                            backgroundColor: '#FFF',
                            extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);',
                            textStyle: {
                                color: '#000'
                            },
                            formatter: function (params, ticket, callback){
                                const para = params[0];
                                return '<div>'+
                                        '<div style="color: #999999">'+para.name+'</div>'+
                                        '<div style="color: #000000;font-size: 18px;font-family: DIN Condensed;">'+para.data.truValue+'&nbsp;&nbsp;&nbsp;&nbsp;<span style="font-size:16px;color:#397bff;">'+para.data.value+'%</span></div>'
                                        +'</div>'
                            }
                        }
                        // consu_data.yAxis[0].name = '人数占比%';
                        consu_data.xAxis[0].data = res.data.map(res => {return res.key});
                        consu_data.series[0].itemStyle = {borderWidth: 5}
                        consu_data.legend.data = res.data.map(res => {
                            return res.key
                        })
                        consu_data.series = [
                            {
                                name: res.titleTypeName,
                                type: "bar",
                                barWidth: "30%",
                                data: consu_chart_data
                            },
                        ]
                        this.reSetChart(['consu_chart'])
                    }else{
                        this.setEmptyWord(['consu_chart'])
                    }
                }
            })
            this.job_chart_data = job_chart_data;//职业分布赋值
            this.age_chart_data = age_chart_data;//年龄分布
            this.income_data = income_data;//收入分布图表
            this.consu_data = consu_data;//消费分布
        }
    },
    methods: {
        //设置暂无数据
        setEmptyWord(value){value.map(res => {this.chartType[res] = false})},
        //重新显示图表
        reSetChart(value){value.map(res => {this.chartType[res] = true})},
        //加载用户业态下的权限树
        getBoradTree(businessCode){
            this.loading = true;
            api.boardTree({businessCode}).then(res => {
                if(res.success){
                    [res.data.boardOrgVo].forEach(res => {
                        res.childOrgs.forEach(ret => {
                            ret.childOrgs.forEach(child => {
                                if(isNull(child.childOrgs)){
                                    child.childOrgs = undefined;
                                }
                            })
                        })
                    })
                    
                    this.treeSource = [res.data.boardOrgVo];
                    this.mapData = [res.data.boardOrgVo];
                    this.treeSelect = res.data.firstOrgId;
                    this.changeObj = {
                        businessCode: this.businessCode,
                        orgType: res.data.orgType,
                        orgId: res.data.firstOrgId
                    }
                    this.getBoardCenterData(res.data.firstOrgId,businessCode);//看板指标数据
                    this.getBoardChartData(res.data.firstOrgId,businessCode);//看板图表数据 
                }else{
                    this.$message.error(res.message);
                }
                this.loading = false;
            })
        },
        //获取核心数据接口
        getBoardCenterData(orgId,businessCode){
            api.getBoardCenterData({
                orgId,
                businessCode,
            }).then(res => {
                if(res.success){
                    let deal_data = cloneDeep(indexBodyOption);//今日成交
                    let liquid_data = cloneDeep(deepConcenOption);//客户浓度
                    let satify_data = cloneDeep(deepConcenOption);//客户满意度（近30日)

                    //今日成交
                    if(res.data.trendVoList.length!=0){
                        deal_data.title.text = '今日成交客户数' +' {a|}';
                        deal_data.title.subtext = common.numFormat(res.data.dealUserCnt);
                        deal_data.xAxis.data = res.data.trendVoList.map(res => res.dealDate);
                        deal_data.series[0].data = res.data.trendVoList.map(res => res.dealCount);
                        this.reSetChart(['today_chart'])
                    }else{
                        this.setEmptyWord(['today_chart'])
                    }
                    
                    //客户浓度
                    if(res.data.userPotency!=null){
                        liquid_data.title.text = '客户浓度(近7日)' +' {a|}';
                        liquid_data.series[1].axisLine.lineStyle.color = [[res.data.userPotency/100, '#397bff'],[1,'#f5f5f5']];
                        liquid_data.series[1].data = [{value: res.data.userPotency}];
                        this.reSetChart(['liq_chart']);
                    }else{
                        this.setEmptyWord(['liq_chart'])
                    }

                    //客户满意度（近30日)
                    if(res.data.userDegree!=null){
                        satify_data.title.text = '客户满意度(近30日)' +' {a|}';
                        satify_data.series[1].axisLine.lineStyle.color = [[res.data.userDegree/100, '#5dd089'],[1,'#f5f5f5']];
                        satify_data.series[1].itemStyle.normal.borderColor = '#5dd089';
                        satify_data.series[1].data = [{value: res.data.userDegree}];
                        this.reSetChart(['sati_chart'])
                    }else{
                        this.setEmptyWord(['sati_chart'])
                    }
                    
                    res.data = Object.assign({}, res.data, {
                            totalUserCnt: common.numFormat(res.data.totalUserCnt),
                            dealUserCnt: common.numFormat(res.data.dealUserCnt),
                            increUserCnt: common.numFormat(res.data.increUserCnt),
                            activeUserCnt: common.numFormat(res.data.activeUserCnt),
                    })
                    
                    this.cus_data_list = [{
                        icon: cusTotalIcon,
                        name: '客户总数',
                        data: res.data.totalUserCnt,
                        desc: '累计总客户数'
                    },{
                        icon: cusNewIcon,
                        name: '新增客户',
                        data: res.data.increUserCnt,
                        desc: '昨日万科新增客户数'
                    },{
                        icon: cusActiveIcon,
                        name: '活跃客户',
                        data: res.data.activeUserCnt,
                        desc: '昨天活跃客户总数（所有与万科产生过接触的客户）'
                    }]
                    
                    this.mainData = res.data;
                    this.deal_data = deal_data;
                    this.satify_data = satify_data;
                    this.liquid_data = liquid_data;
                }else{
                    this.$message.error(res.message);
                }
            })
        },
        ////图表分布数据
        getBoardChartData(orgId,businessCode){
            api.boardChartData({
                orgId,
                businessCode
            }).then(res => {
                if(res.success){
                    this.whole_data = res.data;
                }else{
                    this.$message.error(res.message);
                }
            })
        },
        //权限树点击
        treeSelectAction(val){
            this.treeSelect = val.orgId;
            this.defaultArea = val.orgName+'客户核心指标';//区域名称
            this.changeObj = {
                businessCode: this.businessCode,
                orgType: val.orgType,
                orgId: val.orgId
            }

            this.getBoardCenterData(val.orgId,this.businessCode);//看板指标数据
            this.getBoardChartData(val.orgId,this.businessCode);//看板图表数据
        },
        async loadOptions({ action, parentNode, callback }){
            console.log(action)
        },
        //子组件地图触发渲染数据
        requestData(val){
            const { businessCode } = this;
            this.defaultArea = val.orgName+'客户核心指标';//区域名称
            if(!isUndefined(val.orgId)){
                this.treeSelect = val.orgId;
                this.changeObj = {
                    businessCode: this.businessCode,
                    orgType: val.orgType,
                    orgId: val.orgId
                }
                this.getBoardCenterData(val.orgId,businessCode)
                this.getBoardChartData(val.orgId,businessCode)
            }
        }
    }
}
</script>

<style lang="scss" scoped>
    .vk-home-chart-ct{
        .m-ct{
            width: 100%;
            background: #fff;
            margin: 0 auto;
            .floor_o{
                display: flex;
                padding: 30px 30px 24px 30px;
                p{
                    color: #000000;
                    font-weight: bold;
                    font-size: 18px;
                    font-family: PingFang TC;
                }
                
                
            }
            .floor_t{
                display: flex;
                justify-content: space-between;
                .detail{
                    background: #FFFFFF;
                    border: 1px solid #E8E8E8;
                    border-radius: 2px;
                    margin: 30px;
                    height: 170px;
                    .fl-up{
                        border-bottom: 1px solid #F2F2F2;
                        .title{
                            font-size: 14px;
                            color: #999999;
                            padding: 24px 0 0 24px;
                        }
                        .num{
                            padding: 20px 110px 30px 24px;
                            font-size: 32px;
                            color: rgba(0,0,0,0.85);
                            .tit{
                                font-size: 14px;
                            }
                        }
                    }
                    ul{
                        display: flex;
                        justify-content: space-around;
                        font-size: 14px;
                        color: #666666;
                        line-height: 50px;
                    }
                }
                .pg-status,.water-status{
                    width: 230px;
                    height: 170px;
                    font-size: 14px;
                    text-align: center;
                    border: 1px solid #E8E8E8;
                    color: rgba(0,0,0,0.85);
                    border-radius: 2px;
                    margin: 30px;
                    p{
                        text-align: left;
                        padding: 15px 24px;
                        font-weight: bold;
                    }
                }
            }
            .floor_th{
                display: flex;
                font-family: PingFang SC;
                justify-content: space-between;
                padding: 16px 0 0 0;
                .income-ct{
                    margin-top: 45px;
                }
                .consu-ct{
                    margin-top: 100px;
                }
                .satisfy-ct{
                    margin: 16px 0;
                }
                .body-ct,.data-ct,.concen-ct,.satisfy-ct{
                    position: relative;
                    border-radius: 4px;
	                border: solid 1px #f0f0f0;
                    height: auto;
                }
                .data-ct{
                    .title{
                        font-size: 18px;
                        color: #000;
                        padding: 17px 24px;
                    }
                    .dt-ct{
                        display: flex;
                        padding: 0 22px;
                        flex-wrap: wrap;
                        .dt-ct-li{
                            display: flex;
                            width: 50%;
                            height: 110px;
                            img{
                                position: relative;
                                top: 5px;
                                width: 30px;
                                height: 30px;
                            }
                            .dt-ct-li-ul{
                                position: relative;
                                margin-left: 13px;
                                line-height: 26px;
                                top: -5px;
                                .tag1{
                                    font-size: 14px;
                                    color: #333;
                                }
                                .tag2{
                                    color: #000;
                                    font: 16px/150% DIN Condensed,Arial,Verdana,"宋体"
                                }
                            }
                        }
                    }
                    margin: 16px 0;
                }
                .sex-ct,.job-ct,.age-ct,.income-ct,.consu-ct{
                    width: 300px;
                    p{
                        font-size: 14px;
                        color: rgba(0,0,0,0.85);
                    }
                }
            }
            .floor_f{
                display: flex;
                justify-content: space-between;
                padding: 0px 0px 70px 0px;
                .el-col{
                    min-height: 310px;
                    padding: 17px;
                    border-radius: 4px;
	                border: solid 1px #f0f0f0;
                }
            }
        }
        .chart-empty-c{
            height: 230px;
            line-height: 230px;
            text-align: center;
            vertical-align: middle;
            .icon{
                color: #FAAD14;
                font-size: 20px;
            }
            .word{
                color: #666666;
            }
        }
    }
</style>
