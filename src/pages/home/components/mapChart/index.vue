<template>
  <div class="chart" ref="chart"  :style="{height:'550px',width:'100%'}"/>
</template>

<script>
import echarts from "@/components/chart/common.js";
import mixins from "@/components/chart/mixins";
import 'echarts/lib/chart/effectScatter'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/geo'
import 'echarts/lib/chart/map' //引入地图
import 'echarts/map/js/china';
import questionPng from '@public/assets/imgs/location.png';
import api from '@/api/';
import { mapState } from 'vuex';
import common from '@/constants/common';
import { mapOption } from "@/constants/options";
import { cloneDeep, isUndefined, isEmpty, findIndex } from 'lodash';

export default{
    mixins: [mixins],
    props: {
        mapData: {
            type: Array,
            required: true
        },
        changeObj: {
            type: Object,
            required: true
        },
        requestData: {
            type: null,
        },
        config:{handle:''},
    },
    data(){
        return{
            chart: null,
            showData: [],
            changeDataIndex: null,
        }
    },
    created(){
    },
    mounted() {
        
    },
    beforeDestroy() {
        if (!this.chart) {return;}
        this.chart.dispose();
        this.chart = null;
    },
    watch: {
        mapData(newVal){
        },
        changeObj(newVal){
            const { businessCode, orgType, orgId } = newVal;
            this.getBoardCityList(businessCode,orgType,orgId);
        },
        immediate:true,
        deep:true
    },
    computed: {
        businessCode(){
            return this.$store.state.home.businessCode; 
        }
    },
    methods: {
        //清楚所有绑定方法
        clearAllFunction(){
            this.chart.off("click");
            this.chart.off("mouseover");
            this.chart.off("mouseout");
        },
        //高亮当前选择的城市，关闭之前的城市
        companyShowOrHide(params,type){
            const { changeDataIndex } = this;

            if(params.componentSubType=='scatter'){
                this.chart.dispatchAction({
                    type: 'downplay',
                    seriesIndex: changeDataIndex,
                })
                this.chart.dispatchAction({
                    type: 'highlight',
                    seriesIndex: params.seriesIndex,
                    dataIndex: params.dataIndex
                })
                this.changeDataIndex = params.seriesIndex;
            }
            
        },
        //获取当前选择的 集团/区域/城市 的对应数据
        getBoardCityList(businessCode,orgType,orgId){
                api.getBoardCityList({
                    businessCode,
                    orgType,
                    orgId
                }).then(res => {
                    if(res.data.length==0){return false}
                    const { orgName } = res.data[0]; 

                    switch (orgType) {
                        case 1://当前选择为集团时
                            let showMarker1 = [];
                            const showData1 = res.data[0].orgCityVos.map(res => {
                                return {
                                    orgId,value: 1, orgName,
                                    itemStyle: {borderColor: '#dfe9fe', color: '#3276fe', borderWidth: 0},
                                    name: res.name.replace(/省|市|县|自治区|特别行政区|壮族|回族|维吾尔/g,''),
                                }
                            })
                            this.mapData[0].childOrgs.map(res => {
                                res.childOrgs.map(ret => {
                                    const parentId = ret.orgId;
                                    const companyName = ret.orgName;
                                    const disStatus = res.disStatus;
                                    // 广州市特殊处理
                                    ret.cityVos.map(child => {
                                        showMarker1.push({
                                            companyName:child.cityName=='广州市'?'广州公司':companyName,
                                            orgId: child.cityName=='广州市'?10020:parentId,
                                            name: child.cityName.replace(/省|市|县|自治区|特别行政区|壮族|回族|维吾尔/g,''),
                                            itemStyle: {borderColor: '#74A2FF',borderWidth: 3,color: '#fff'},
                                            value: [child.xcordination,child.ycordination,0]
                                        })
                                    })
                                })
                            })
                            // this.showData = showData1;
                            this.showMap(showData1,showMarker1);
                            this.$emit('requestData', {orgName});
                            break;
                        case 2://当前选择为区域时
                            let showMarker2 = [];
                            const ctId = res.data[0].orgId;

                            this.mapData[0].childOrgs.map(res => {
                                if(res.orgId==ctId){
                                    res.childOrgs.map(ret => {
                                        const parentId = ret.orgId;
                                        const companyName = ret.orgName;

                                        ret.cityVos.map(child => {
                                            showMarker2.push({
                                                companyName:child.cityName=='广州市'?'广州公司':companyName,
                                                orgId: child.cityName=='广州市'?10020:parentId,
                                                name: child.cityName.replace(/省|市|县|自治区|特别行政区|壮族|回族|维吾尔/g,''),
                                                itemStyle: {borderColor: '#74A2FF',borderWidth: 3,color: '#fff'},
                                                value: [child.xcordination,child.ycordination,0]
                                            })
                                        })
                                    })
                                }
                            })
                            const showData2 = res.data[0].orgCityVos.map(res => {
                                return {
                                    orgId,orgName,value: 1, 
                                    itemStyle: {borderColor: '#dfe9fe',color: '#3276fe',borderWidth: 0},
                                    name: res.name.replace(/省|市|县|自治区|特别行政区|壮族|回族|维吾尔/g,''),
                                }
                            })
                            // this.showData = showData2;
                            this.showMap(showData2,showMarker2);
                            this.$emit('requestData', {orgName});
                            break;
                        case 3: //当前选择为公司时
                            let showMarker3 = [],showData3 = [];
                            const selectOrgId = res.data[0].orgId;

                            this.mapData[0].childOrgs.map(res => {
                                res.childOrgs.map(ret => {
                                    const parentId = ret.orgId;
                                    const companyName = ret.orgName;
                                    const disStatus = ret.disStatus;
                                    
                                    if(!disStatus){
                                        ret.cityVos.map(child => {
                                            showData3.push({
                                                value: 1,
                                                itemStyle: {borderColor: '#dfe9fe',color: '#3276fe',borderWidth: 0},
                                                name: child.provinceName.replace(/省|市|县|自治区|特别行政区|壮族|回族|维吾尔/g,''),
                                            })
                                            showMarker3.push({
                                                companyName:child.cityName=='广州市'?'广州公司':companyName,
                                                orgId: child.cityName=='广州市'?10020:parentId,
                                                name: child.cityName.replace(/省|市|县|自治区|特别行政区|壮族|回族|维吾尔/g,''),
                                                itemStyle: {borderColor: '#74A2FF',borderWidth: 3,color: '#fff'},
                                                value: [child.xcordination,child.ycordination,0]
                                            })
                                        })
                                    }
                                })
                            })
                            // this.showData = showData3;
                            this.showMap(showData3,showMarker3,selectOrgId)
                            break;
                        default:
                            break;
                    }

                })
            
        },
        //集团||区域||城市渲染方法
        showMap(showData,showMarker,selectOrgId){
            var option = cloneDeep(mapOption);

            option.series[0].data = showData;//map地图数据
            option.series[1].data = showMarker;//scarter图数据
            option.tooltip = {//悬浮框组件
                trigger: 'item',
                triggerOn: 'mousemove',
                backgroundColor:'#dfe9fe',
                borderColor: '#dfe9fe',
                borderWidth: '2',
                extraCssText: 'padding:10px;box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);',
                textStyle: {
                    color: '#333',
                    fontSize: 14,
                    fontFamily: 'Microsoft YaHei',
                },
                show: true,
                formatter: function(params, ticket, callback) {
                    if(isUndefined(params.data)){return}else{
                        if(params.componentSubType=='scatter'){
                            return '<img style="position:relative;top:2px;right:3px;" src='+questionPng+' />'+params.data.name
                        }else{}
                    }
                }
            }

            this.chart = echarts.init(this.$refs.chart);
            this.clearAllFunction();
            this.chart.on("click",this.requestParentData)
            this.chart.showLoading();
            this.chart.setOption(option,true);
            this.chart.hideLoading();
            //城市默认高显当前城市对应的公司
            if(selectOrgId){
                showMarker.map((res,index) => {
                    if(res.orgId == selectOrgId){
                        this.chart.dispatchAction({
                            type: 'highlight',
                            seriesIndex: 1,
                            dataIndex: index
                        })
                        this.changeDataIndex = 20;
                    }
                })
            }
        },
        //地图scarter点击事件，回传上级组件orgId，orgName，orgType
        requestParentData(params){
            this.companyShowOrHide(params)
            if(params.componentSubType == 'scatter'){
                this.$emit('requestData', {
                    orgId: params.data.orgId,
                    orgName: params.data.companyName,
                    orgType: this.changeObj.orgType
                });
            }
        }
    }
}
</script>