<template>
    <!-- 地图交互版本2.0 已废弃 -->
  <div :class="className" ref="chart"  :style="{height:height,width:'100%'}"/>
</template>

<script>
import echarts from "@/components/chart/common.js";
import mixins from "@/components/chart/mixins";
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/geo'
import 'echarts/lib/chart/map' //引入地图
import 'echarts/lib/chart/lines'
import 'echarts/lib/chart/effectScatter'
import 'echarts/map/js/china';
import api from '@/api/';
import { mapState } from 'vuex';
import common from '@/constants/common';
import { mapOption } from "@/constants/options";
import { cloneDeep, isUndefined, isEmpty } from 'lodash';

export default {
    mixins: [mixins],
    props: {
        currentType: {
            type: null,
            required: true,
        },
        mapData: {
            type: Array,
            required: true
        },
        className: {
            type: String,
            default: "chart"
        },
        height: {
            type: String,
            default: "550px"
        },
        requestData: {
            type: null,
        },
        config:{handle:''},
        option:{}
    },
    watch: {
        mapData(){
            this.initChart('/assets/geoProvince/china.js', 'china',this.mapData)
        },
        currentType(){
            // console.log('组织类型改变')
        },
        businessCode(){
            console.log(this.businessCode)
        },
        changeId(newVal){
            this.boardCenterData(newVal)
        }
    },
    data() {
        return {
            chart: null,
            timeFn: null,
            areaData: [],
            highShowData: [],
            checkId: '',
            changeId: '',
            tooltipData: {},
            totalUsCnt:'',//总人数
            dealUsCnt:'',//交易数
            usPotency:'',//浓度
            provinceArr: [],
            provinces:{
                '上海': '/assets/geoProvince/31.js',
                '河北': '/assets/geoProvince/13.json',
                '山西': '/assets/geoProvince/14.js',
                '内蒙古': '/assets/geoProvince/15.js',
                '辽宁': '/assets/geoProvince/21.js',
                '吉林': '/assets/geoProvince/22.js',
                '黑龙江': '/assets/geoProvince/23.js',
                '江苏': '/assets/geoProvince/32.js',
                '浙江': '/assets/geoProvince/33.js',
                '安徽': '/assets/geoProvince/34.js',
                '福建': '/assets/geoProvince/35.js',
                '江西': '/assets/geoProvince/36.js',
                '山东': '/assets/geoProvince/37.js',
                '河南': '/assets/geoProvince/41.js',
                '湖北': '/assets/geoProvince/42.js',
                '湖南': '/assets/geoProvince/43.js',
                '广东': '/assets/geoProvince/44.js',
                '广西': '/assets/geoProvince/45.js',
                '海南': '/assets/geoProvince/46.js',
                '四川': '/assets/geoProvince/51.js',
                '贵州': '/assets/geoProvince/52.js',
                '云南': '/assets/geoProvince/53.js',
                '西藏': '/assets/geoProvince/54.js',
                '陕西': '/assets/geoProvince/61.js',
                '甘肃': '/assets/geoProvince/62.js',
                '青海': '/assets/geoProvince/63.js',
                '宁夏': '/assets/geoProvince/64.js',
                '新疆': '/assets/geoProvince/65.js',
                '北京': '/assets/geoProvince/11.json',
                '天津': '/assets/geoProvince/12.json',
                '重庆': '/assets/geoProvince/50.js',
                '台湾': '/assets/geoProvince/71.js',
                '香港': '/assets/geoProvince/81.js',
                '澳门': '/assets/geoProvince/82.js',
            },
        };
    },
    computed: mapState({
        businessCode: state => state.home.businessCode
    }),
    created(){
    },
    mounted() {
    },
    beforeDestroy() {
        if (!this.chart) {return;}
        this.chart.dispose();
        this.chart = null;
    },
    methods: {
        initChart(mapCode, name, mapData,nextMap) {
            
            if(this.currentType == 1){
                //集团类型  
                const prevData = isUndefined(mapData)?this.mapData:mapData;

                this.showMapO(prevData,mapCode,name,this.currentType)
            }else if(this.currentType == 2){
                //区域类型
                const prevData = isUndefined(mapData)?this.mapData:mapData;

                this.showMapT(prevData,mapCode,name,this.currentType)
            }else if(this.currentType == 3){
                //城市类型
                const prevData = isUndefined(mapData)?this.mapData:mapData;
                
                this.showMapTh(prevData,mapCode,name,this.currentType,nextMap)
            }
            const that = this;
        },
        //清楚所有绑定方法
        clearAllFunction(){
            this.chart.off("click");
            this.chart.off("mouseover");
            this.chart.off("mouseout");
        },
        showMapO(prevData,mapCode,name,currentType){
            const that = this; 
            var companyId = prevData[0].orgId;//集团orgId
            const optionData = prevData[0].orgCityVos.map((res,index) => {
                const value = index + 1;

                return {
                    value,
                    name: res.name.replace(/省|市|自治区|特别行政区|壮族|回族|维吾尔/g,''),
                    itemStyle: {
                        areaColor: '#f2f6ff',
                        color: '#D5DAE4'
                    }
                }
            })
            var option = cloneDeep(mapOption);

            this.areaData = optionData;//区域总数据
            option.geo.map = 'china';
            // option.geo.regions = optionData;
            option.visualMap = {
                min: 0,
                max: 7,
                left: 'left',
                top: 'bottom',
                text: ['高', '低'],
                calculable: true,
                show:false,
                inRange: {
                    color: ['#9FC2FF']
                }
            }
            option.series = [
                {
                    type: 'map',
                    mapType: 'china',
                    geoIndex: 0,
                    label: {
                        normal: {
                            show: true
                        },
                        emphasis: {
                            show: false
                        }
                    },
                    data: optionData
                },
            ]
            option.tooltip = {
                trigger: 'item',
                triggerOn: 'mousemove',
                backgroundColor:'rgba(0,0,0,.8)',
                borderColor: '#3574c8',
                borderWidth: '2',
                extraCssText: 'padding:10px;box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);',
                show: true,
                formatter: function(params, ticket, callback) {
                    if(isUndefined(params.data)){ 
                    }else{
                        that.changeId = companyId;
                        return '万科集团<br/>'+'总人数：'+common.numFormat(that.tooltipData.totalUserCnt)+'<br/>'+'交易数： '+common.numFormat(that.tooltipData.dealUserCnt)+'<br/>'+'浓度：'+that.tooltipData.userPotency+'%'
                    }      
                }
            }

            this.chart = echarts.init(this.$refs.chart);
            this.clearAllFunction();
            this.chart.on("mouseover",(value) => this.companyShowOrHide(value,true));
            this.chart.on("mouseout",(value) => this.companyShowOrHide(value,false));
            this.chart.showLoading();
            this.chart.setOption(option,true);
            this.chart.hideLoading();
        },
        showMapT(prevData,mapCode,name,currentType){
            const that = this;
            let showCitys = [];
            var option = cloneDeep(mapOption);
            this.areaData = prevData;//区域总数据

            const optionData = prevData.map((res,index) => {
                const value = index+1;
                const areaId = res.orgId;
                const orgNames = res.orgName;
                let citys = res.orgCityVos.map(res => {
                    showCitys.push({
                        id: res.id,
                        orgId: areaId,
                        value: value,
                        orgName: orgNames,
                        name: res.name.replace(/省|市|自治区|特别行政区|壮族|回族|维吾尔/g,''),
                        itemStyle: {
                            areaColor: '#f2f6ff',
                            color: '#D5DAE4'
                        }
                    })
                })
            })
            
            option.geo.map = 'china';
            option.tooltip = {
                trigger: 'item',
                triggerOn: 'mousemove',
                backgroundColor:'rgba(0,0,0,.8)',
                borderColor: '#3574c8',
                borderWidth: '2',
                extraCssText: 'padding:10px;box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);',
                show: true,
                formatter: function(params, ticket, callback) {
                    if(isUndefined(params.data)){
                    }else{
                        that.changeId = params.data.orgId;
                        return params.data.orgName+'<br/>'+'总人数：'+common.numFormat(that.tooltipData.totalUserCnt)+'<br/>'+'交易数： '+common.numFormat(that.tooltipData.dealUserCnt)+'<br/>'+'浓度：'+that.tooltipData.userPotency+'%'
                    }      
                }
            }
            // option.geo.regions = showCitys;
            option.visualMap = {
                min: 0,
                max: 7,
                left: 'left',
                top: 'bottom',
                text: ['高', '低'],
                calculable: true,
                show:false,
                inRange: {
                    color: ['#CCE3FC','#97c7ff','#3491FA','#3879FB','#1456DB']
                }
            }
            option.series = [
                {
                    type: 'map',
                    mapType: 'china',
                    geoIndex: 0,
                    label: {
                        normal: {
                            show: true
                        },
                        emphasis: {
                            show: false
                        }
                    },
                    data:showCitys
                },
            ]

            this.chart = echarts.init(this.$refs.chart);
            this.clearAllFunction();
            this.chart.on("mouseover",this.showArea);
            this.chart.on("mouseout",this.unShowArea);
            this.chart.on("click",this.areaOrgShow)
            this.chart.showLoading();
            this.chart.setOption(option,true);
            this.chart.hideLoading();
        },
        showMapTh(showData,mapCode,name,currentType,nextMap){
            let showCitys = [],showMark = [],provinceArr = [];
            var option = cloneDeep(mapOption);

            this.areaData = showData;//区域总数据
            const optionData = showData.map(res => {
                const parentId = res.orgId;

                if(!isEmpty(res.orgCityVos)){
                    if(res.orgCityVos){
                        res.orgCityVos.map(res => {
                            //省份集合
                            provinceArr.push({
                                child: res.child,
                                id: res.id,
                                orgId: parentId,
                                name: res.name
                            });

                            res.child.map(res => {
                                showMark.push({
                                    id: res.id,
                                    orgId: parentId,
                                    name: res.name,
                                    value: [res.xcordination,res.ycordination,1]
                                })
                            })
                                
                            showCitys.push({
                                id: res.id,
                                orgId: parentId,
                                type: 'inside',
                                name: res.name.replace(/省|市|自治区|特别行政区|壮族|回族|维吾尔/g,''),
                                itemStyle: {
                                    areaColor: '#f2f6ff',
                                    color: '#D5DAE4'
                                }
                            })
                        })
                    }
                }
                this.provinceArr = provinceArr;

            })
            

            if(name == 'china'){
                const that = this;
                const { tooltipData, totalUsCnt, dealUsCnt, usPotency } = this;
                var option = cloneDeep(mapOption);

                option.tooltip = {
                    trigger: 'item',
                    triggerOn: 'mousemove',
                    backgroundColor:'rgba(0,0,0,.8)',
                    borderColor: '#3574c8',
                    borderWidth: '2',
                    extraCssText: 'padding:10px;box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);',
                    show: true,
                    formatter: function(params){
                        if(isUndefined(params.data)){
                        }else{
                            that.changeId = params.data.orgId;
                            // that.boardCenterData(params.data.orgId)
                            return params.data.name+'<br/>'+'总人数：'+common.numFormat(that.tooltipData.totalUserCnt)+'<br/>'+'交易数： '+common.numFormat(that.tooltipData.dealUserCnt)+'<br/>'+'浓度：'+that.tooltipData.userPotency+'%'
                        }
                    }
                }
                option.geo.map = 'china';
                option.geo.regions = showCitys;
                option.series[0].data = showMark;
                
                this.chart = echarts.init(this.$refs.chart);
                this.chart.showLoading();
                this.clearAllFunction();
                this.chart.on("click",this.loadMap)
                this.chart.on("dblclick",this.returnTopMap)
                this.chart.setOption(option,true);
                this.chart.hideLoading();
            }else{
                this.$http.get(mapCode).then(res => {
                    
                    const showCityData = nextMap.map(res => {
                        return {
                            id: res.id,
                            orgId: res.orgId,
                            name: res.name,
                            itemStyle: {
                                areaColor: '#f2f6ff',
                                color: '#D5DAE4'
                            }
                        }
                    })

                    if(res){
                        echarts.registerMap(name, res.data);

                        var option = cloneDeep(mapOption);

                        option.geo.map = name;
                        option.geo.regions = showCityData;
                        option.series[0].data = nextMap;
                    
                        this.chart = echarts.init(this.$refs.chart);
                        this.chart.showLoading();
                        this.clearAllFunction();
                        this.chart.on("click",this.cityClick)
                        this.chart.on("dblclick",this.returnTopMap)
                        this.chart.setOption(option,true);
                        this.chart.hideLoading();
                    
                    }else{
                        // alert('无地图数据')
                    }
                })
            }
        },
        //（集团公司）切换高亮
        companyShowOrHide(params,type){
            const { areaData } = this;
            
            if(isUndefined(params.data)){return;}else{
                areaData.map(res => {
                    this.chart.dispatchAction({
                        type: type?'highlight':'downplay',
                        name: res.name.replace(/省|市|自治区|特别行政区|壮族|回族|维吾尔/g,'')
                    })
                })
            }
        },
        //高显当前城市所在区域
        showArea(params){
            let catchData=[];
            const { areaData } = this;

            if(isUndefined(params.data)){
                return;
            }else{
                let loop = res => {
                    res.forEach(item => {
                        if(item.id==params.data.id){
                            catchData = res;
                        }
                        if(item.orgCityVos){
                            console.log(item.orgCityVos)
                            loop(item.orgCityVos)
                        }
                    });
                };
                loop(areaData);

                this.highShowData = catchData;
                catchData.map(res => {
                    this.chart.dispatchAction({
                        type: 'highlight',
                        name: res.name.replace(/省|市|自治区|特别行政区|壮族|回族|维吾尔/g,'')
                    })
                })  
            }
        },
        //取消高显当前城市所在区域
        unShowArea(params){
            const { highShowData } = this;
            if(isUndefined(params.data)){
                return;
            }else{
                highShowData.map(res => {
                    this.chart.dispatchAction({
                        type: 'downplay',
                        name: res.name.replace(/省|市|自治区|特别行政区|壮族|回族|维吾尔/g,'')
                    })
                })
            }
        },
        areaOrgShow(params){
            if(isUndefined(params.data.orgId)){
                return
            }else{
                this.$emit('requestData', {orgId: params.data.orgId,orgName: params.data.orgName});
            }
        },
        //地图下钻点击
        loadMap(params){
            let filterData = [];
            this.provinceArr.map(res => {
                const orgId = res.orgId;

                if(res.id == params.region.id){
                    res.child.map(res => {
                        filterData.push({
                            orgId: orgId,
                            name: res.name,
                            value: [res.xcordination,res.ycordination,0]
                        })
                    })
                }
            })

            const that = this;
            if(isUndefined(params.region.orgId)){
                return
            }else{
                //单击切换到省级地图，当mapCode有值,说明可以切换到下级地图
                clearTimeout(this.timeFn);
                //由于单击事件和双击事件冲突，故单击的响应事件延迟250毫秒执行
                this.timeFn = setTimeout(function() {
                    var name = params.name; //地区name
                    var mapCode = that.provinces[name]; //地区的json数据

                    if (!mapCode) {
                        that.$message.error('无此区域地图显示')
                        return;
                    }
                    that.initChart(mapCode, name, this.mapData, filterData);
                    
                }, 250);

            }
            
        },
        //地图下钻后点击城市
        cityClick(params){
            if(isUndefined(params.data)){
                return
            }else{
                this.$emit('requestData', { orgId: params.data.orgId, orgName: params.data.name });
            }
        },
        //返回上一级
        returnTopMap(params){
            // 绑定双击事件，返回全国地图
            clearTimeout(this.timeFn);
            //返回全国地图
            this.initChart('/assets/geoProvince/china.js', 'china', this.mapData);
        },
        //获取悬浮窗信息
        boardCenterData(changeId){
            api.getBoardCenterData({
                orgId: changeId,
                businessCode: this.businessCode
            }).then(res => {
                if(res.success){
                    const { totalUserCnt, dealUserCnt, userPotency } = res.data;

                    this.tooltipData = res.data;
                    this.totalUsCnt = res.data.totalUsCnt;//总人数
                    this.dealUsCnt = res.data.dealUsCnt;//交易数
                    this.usPotency = res.data.usPotency;//浓度
                }else{
                    this.$message.error(message); 
                }
            })
        }
    }
    };
</script>

<style lang="scss" scoped>

</style>
