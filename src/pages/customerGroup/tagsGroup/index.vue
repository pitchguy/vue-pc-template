<template>
    <div class="content vk-tagsGroup">
        <div class="vk-titleResult">
            <span v-if="packageName" :style="{marginRight: packageName?'20px':'0px'}">
                客群包名称：
                <span style="color: #5A8CFF;">{{packageName}}</span>
            </span>
            圈定结果
            <span class="vk-resultPeople">{{total}}人</span>
        </div>
        <selected-tags :cityPjData="cityPjData" :data="selectedTags" :isUpdate="isUpdate"></selected-tags>
        <add-tags ref="addTags" @cityPjBind="getCityPjBind" @categoryData="getCategoryData" :commonTags="commonTags" :options="options" :exist="existTags" :isUpdate="isUpdate"></add-tags>
        <el-tabs v-model="activeName" class="vk-tabs" @tab-click="tabChange">
            <el-tab-pane label="人员列表" name="people">
                <people-list ref="peoplelist" :data="selectedTags" :tableData="peopleList" :total="total" @pageChange="handlePageChange"></people-list>
            </el-tab-pane>
            <el-tab-pane label="客群分析" name="customer">
                <customer ref="custom" :data="selectedTags" :cityPjData="cityPjData" :chartData="chart_data"></customer>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import api from '@/api/';
import { isEmpty } from 'lodash';
import common from '@/constants/common';
import mixins from '@/constants/mixins';
import SelectedTags from './component/selectedTags';
import AddTags from './component/addTags';
import PeopleList from './component/peopleList';
import Customer from './component/customer';
export default {
    mixins: [mixins],
    components:{
        'selected-tags':SelectedTags,
        'add-tags':AddTags,
        'people-list':PeopleList,
        'customer':Customer,
    },
    data () {
        return {
            total:0,
            options: [],
            isUpdate: false,//是否为更新状态
            selectedTags:[], //已选标签
            peopleList:[],/* 人员列表数据 */
            commonTags:[],/* 常用标签 */
            chart_data: {},/* 图表对应数据 */
            existTags: [],/* (编辑)已存在的标签数组 */
            activeName:'people',
            packageName: '',//客群包名称
            cityPjData: {
                cityName: '',/* 当前城市信息 */
                projectName: '',/* 对应城市项目 */
            }
        }
    },
    created(){
        if(common.permCheck('label_encircle_view')){}else{
            this.$router.push({name: 'label-group-auth'})
        }
        
        this.getCategory();/* 获取级联类目级别信息 */
        this.getUsedTags(1);/*获取常用标签*/
    },
    mounted(){
        //获取客群包名称和客群包ID用于编辑
        const query = this.$router.history.current.query;
        
        if(isEmpty(query)){
            this.isUpdate = false;
        }else{
            this.isUpdate = true;
            this.packageName = query.packageName;
            this.getPackageEditTags(query.packageId)
        }
    },
    watch: {
        resetTabfObj(newVal){
            this.selectedTags = [];
            this.$refs.addTags.bindValue = {cityValue:'',projectValue:''};
            this.$refs.addTags.projectOptions = [];
        },
        //router变化，重置为初始值
        $route( to , from ){
            window.location.reload(); 
        },
        //选择标签时
        selectedTags(newVal){
            const { cityName, projectName } = this.cityPjData;
            const list = newVal.map(res => {
                return {
                    class1Id: res.class1Id,
                    class2Id: res.refCode,
                    tagId: res.id
                }
            })
            
            if(isEmpty(list)){}else{this.getBodyNum(list,cityName,projectName);}//圈定结果
            if(this.trggerType){}else{
                if(this.activeName == 'people'){
                    //人员列表
                    this.getUsedBodyListAction(list,10,1,cityName,projectName);//人员列表  
                }else{
                    //客群分析
                    this.getChartData(list,cityName,projectName);//获取分析纬度图表data
                }
            }
            
        },
        //tab name切换监听
        activeName(newVal){
            const { selectedTags } = this;
            const { cityName, projectName } = this.cityPjData;
            const list = selectedTags.map(res => {
                return{
                    class1Id: res.class1Id,
                    class2Id: res.refCode,
                    tagId: res.id
                }
            })

            this.getBodyNum(list,cityName,projectName);//圈定结果
            if(newVal == 'people'){
                //人员列表
                this.getUsedBodyListAction(list,10,1,cityName,projectName);//人员列表
            }else{
                //客群分析
                this.getChartData(list,cityName,projectName);//获取分析纬度图表data
            }
        },
        cityPjData: {
            handler(newValue, oldValue) {
                const { selectedTags, activeName } = this;
                const { cityName, projectName } = newValue;
                const list = selectedTags.map(res => {
                    return{
                        class1Id: res.class1Id,
                        class2Id: res.refCode,
                        tagId: res.id
                    }
                })
                
                this.getBodyNum(list,cityName,projectName);//圈定结果
                if(activeName == 'people'){
                    //人员列表
                    this.getUsedBodyListAction(list,10,1,cityName,projectName);//人员列表
                }else{
                    //客群分析
                    this.getChartData(list,cityName,projectName);//获取分析纬度图表data
                }
    　　　   },
    　　　　 deep: true
        },
        immediate:true,
        deep:true
    },
    computed: {
        resetTabfObj(){
            return this.$store.state.home.resetTabfObj
        },
        trggerType(){
            return this.$store.state.home.trggerType;
        }
    },
    methods: {
        /*获取客群包标签*/
        getPackageEditTags(packageId){
            api.cusPackageEdit({},packageId).then(res => {
                if(res.success){
                    this.$refs.addTags.cityChange(res.data.cityName);
                    this.$refs.addTags.bindValue = {cityValue:res.data.cityName,projectValue:res.data.projectName};
                    const exist_data = res.data.list.map(res => {
                        return{
                            class1Id: res.tagClass1Id,
                            refCode: res.tagClass2Id,
                            id: res.tagId,
                            tagName: res.tagName
                        }
                    })
                    this.existTags = exist_data;
                    this.selectedTags = exist_data;
                }else{
                    this.commonAlert(res);
                }
            })
        },
         /* 获取级联类目级别信息 */
        getCategory(){
            api.getUsedCate({}).then(res => {
                if(res.success){
                    this.options = res.data;
                }else{
                    this.commonAlert(res);
                }
            })
        },
        /*获取常用标签*/
        getUsedTags(used){
            api.getUsedCateNew({used}).then(res => {
                if(res.success){
                    this.commonTags = res.data;
                }else{
                    this.commonAlert(res);
                }
            })
        },
        //获取人员列表
        getUsedBodyListAction(list,pageSize,pageNo,cityName,projectName){
            this.$refs.peoplelist.buttonLoading = true;
            api.getUsedBodyList({
                list,
                pageSize,
                pageNo,
                cityName,
                projectName,
            }).then(res => {
                if(res.success){
                    this.total = res.data.total;
                    this.peopleList = res.data.data;
                }else{
                    this.commonAlert(res)
                }

            })
        },
        /* 根据标签圈人（人数） */
        getBodyNum(list,cityName,projectName){
            api.getCusNumByTag({list,cityName,projectName}).then(res => {
                if(res.success){
                    this.total = res.data;
                }else{
                    this.total = 0;
                    this.commonAlert(res)
                }
            })
        },
        //获取分析纬度图表data
        getChartData(list,cityName,projectName){
            this.$refs.custom.chartLoading = true;
            api.getUsedAnalyseChart({list,cityName,projectName}).then(res => {
                if(res.success){
                    this.chart_data = res.data;
                }else{
                    this.commonAlert(res);
                }
                this.$refs.custom.chartLoading = false;
            })
        },
        /* 人员列表&客群分析 tab切换 */
        tabChange(e){
            this.activeName = e.name;
        },
        /* 分页 */
        handlePageChange(page){
            const { selectedTags } = this;
            const { cityName, projectName } = this.cityPjData;
            const list = selectedTags.map(res => {
                return{
                    class1Id: res.class1Id,
                    class2Id: res.refCode,
                    tagId: res.id
                }
            })
            this.getUsedBodyListAction(list,page.pageSize,page.pageNo,cityName,projectName);
        },
        /* 获取标签内容  无论是级联框 还是搜索框 还是下拉框，都会触发该函数，返回统一格式 */
        getCategoryData(value){
            this.$store.dispatch('isTriggerReset',false);//是否触发重置
            let index = this.selectedTags.findIndex(res => res.refCode == value.refCode);

            if(index == -1){}else{this.selectedTags.splice(index,1);}
            this.selectedTags.push(value);
        },
        /* 项目和城市切换 */
        getCityPjBind(value){
            this.$store.dispatch('isTriggerReset',false);//是否触发重置
            const { cityValue, projectValue } = value.newValue;

            this.cityPjData = {cityName:cityValue,projectName:projectValue};
        }
    }
}
</script>

<style lang="scss">
    .vk-tagsGroup{
        width:100%;
        background: #fff;
        padding:30px;
        padding-top:17px;

        .vk-titleResult{
            color: #333333;
            margin-bottom:17px;
            .vk-resultPeople{
                color: #5A8CFF;
                margin-left:16px;
            }
        }
        .vk-tabs{
            background: #FFFFFF;
            border: 1px solid #DDDDDD;
            border-radius: 2px;
            margin-top:20px;
            .el-tabs__header{
                .el-tabs__nav-wrap{
                    padding:0 26px;
                }
            }
        }
    }
</style>
