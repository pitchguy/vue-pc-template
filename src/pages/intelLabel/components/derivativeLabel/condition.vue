<template>
    <div class="group" :style="conditionGroupItem.conditions.length>1?{paddingLeft:'35px'}:null" @mouseover="onMouseOver" @mouseout="onMouseOut">
        <div v-if="conditionGroupItem.conditions.length>1" class="action-relation" @click="onChangeChildAndOr"><span class="text">{{conditionGroupItem.op==="and"?"且":"或"}}</span></div>
        <div v-for="(conditionItem, mainIndex) in conditionGroupItem.conditions" :key="mainIndex" class="conditionItem">
            <condition-child :mainIndex="mainIndex" :conditionGroupItem="conditionGroupItem" :conditionItem="conditionItem" :atomTagList="atomTagList" />
            <div style="width:20px;margin-left:8px;">
                <el-button v-if="(mainIndex+1) === conditionGroupItem.conditions.length" type="text" icon="el-icon-circle-plus-outline" style="font-size:16px;" @click="onAddCondition"></el-button>
            </div>
            <div style="width:20px;float: right;margin-right: 15px;">
                <el-button v-if="canShowClose" type="text" icon="el-icon-close" style="font-size:16px;" @click="onMinusCondition(conditionItem)"></el-button>
            </div>
        </div>
        
    </div>
</template>

<script>
    import api from '@/api/';
    import { find, pick, set, isEmpty } from 'lodash';
    import mixins from '@/constants/mixins';
    import moment from 'moment';
    import ConditionChild from './conditionChild.vue'

    export default {
        mixins: [mixins],
        components: {'condition-child':ConditionChild},
        name: "add-dialog-condition",
        props: ['conditonGroupData', 'conditionGroupItem', 'hasPlus', 'onChangeAndOr', 'onMinusConditionGroupItem', 'atomTagList'],
        data() {
            return {
                canShowClose: false,
                format: {},
                stsinFormat: {},//单选下拉值 组合
                numFormat: {},//数字值 组合
                strFormat: {},//字符串 组合
                dayFormat: {},
                dayRgFormat: {},
                stmutiFormat: {},//多选下拉值 组合
                dbinputFormat: {},//双input值 组合
                stsinOption: {},//单选值option
                stmutiOption: {},//多选值option
                tag1List: [],
                opList: {},
                tag2Lists: [],
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() > Date.now();
                    }
                }
            }
        },
        mounted() {
            // this.setOption(this.labelConf);
        },

        computed: {
            labelConf(){
                return this.$store.state.home.labelConf;
            }
        },

        methods: {
            // 选择框改变
            selectChange(val,row,index){
                const oldArr = this.conditionGroupItem.conditions[index];//原数组
                const uploadArr = _.pick(oldArr, ['columnName', 'op']);//清除原来的赋值，取出columnName,op
                //索引值用来判断最后一个值的区分，防止重复
                const currentSelect = _.find(this.labelConf,{'columnName': row})
                this.$set(this.format,row,this.thComponentCheck(val,currentSelect.type)) 
                // 单选框多选框点option赋值
                if(this.thComponentCheck(val,currentSelect.type)=='stsin'){
                    this.$set(this.stsinOption,row,currentSelect.dictList)
                }else if(this.thComponentCheck(val,currentSelect.type)=='stmuti'){
                    this.$set(this.stmutiFormat,row,[])
                    this.$set(this.stmutiOption,row,currentSelect.dictList)
                }
                
                if(this.thComponentCheck(val,currentSelect.type)=='numRg'){
                    this.resetData2('','',row,index,this.thComponentCheck(val,currentSelect.type))
                }else{
                    this.resetData1(val,row,index,this.thComponentCheck(val,currentSelect.type))
                }
                this.$set(this.conditionGroupItem.conditions,index,uploadArr);//重新置空
            },

            //值改变操作（不包含两个input的情况）
            wholeValueChange(val,row,index,tagType){
                const solveValue = tagType=='day'?moment(val).format('YYYY-MM-DD')
                    :tagType=='dayRg'?[moment(val[0]).format('YYYY-MM-DD'),moment(val[1]).format('YYYY-MM-DD')]
                    :val;//处理不同情况的值
                const uploadType = this.tagValueTypeCheck(tagType);//上传值的key值(可能为数组)
                const oldArr = this.conditionGroupItem.conditions[index];//原数组
                const uploadArr = _.pick(oldArr, ['columnName', 'op']);//清除原来的赋值，取出columnName,op

                if(tagType=='dayRg'){
                    //日期范围选择
                    uploadType.map((res,index) => {
                        this.$set(uploadArr,res,solveValue[index]);//重新设置对应key值和value值
                    })
                }else if(tagType=='numRg'){
                    //两个input
                }else{
                    this.$set(uploadArr,uploadType,solveValue);//重新设置对应key值和value值
                }
                this.$set(this.conditionGroupItem.conditions,index,uploadArr)
            },

            //两个input的情况
            dbInputChange(val,row,index,tagType,direction){
                var uploadArr = [];
                const oldArr = this.conditionGroupItem.conditions[index];//原数组
                
                if(direction=='lvalue'){
                    uploadArr = _.pick(oldArr, ['columnName', 'op', 'rvalue']);
                    this.$set(uploadArr,direction,val);//重新设置对应key值和value值
                }else if(direction=='rvalue'){
                    uploadArr = _.pick(oldArr, ['columnName', 'op', 'lvalue']);
                    this.$set(uploadArr,direction,val);//重新设置对应key值和value值
                }
                this.$set(this.conditionGroupItem.conditions,index,uploadArr)
            },

            onTag2Change(index,conditionItem) {
                //第一项变化时，清空后两项，重新设置对象obj
                let node = this.conditionGroupItem.conditions[index];

                node.op='';
                this.labelConf.forEach(element => {
                    if (element.columnName === node.columnName) {
                        this.$set(this.opList,element.columnName,element.acceptOps.map((res,index) => {return {label: res.opName, key: index, value: res.op}}))
                    }
                });

            },

            setOption(newVal){
                this.conditionGroupItem.conditions.map((res,index) => {
                    const columnName = res.columnName;
                    const currentSelect = _.find(this.labelConf,{'columnName': columnName});
                    const columnType = this.thComponentCheck(res.op,currentSelect.type);
                    
                    if(!isEmpty(columnName)){
                        this.$set(this.opList,columnName,_.find(newVal,{columnName}).acceptOps.map(
                            (res,index) => {return {label: res.opName, key: index, value: res.op}})
                        )
                        this.selectChange(res.op,columnName,'');
                        if(columnType == 'numRg'){
                            //两个输入框特殊情况时
                            this.setData2(res.lvalue,res.rvalue,columnName,index,columnType)
                        }else if(columnType == 'dayRg'){
                            //时间范围选择框时
                            this.setData1([res.lvalue,res.rvalue],columnName,index,columnType)
                        }else{
                             //普通情况
                            this.setData1(res.value||res.listValue,columnName,index,columnType)
                        }
                    }
                })
            },

            setData1(val,row,index,tagType){
                switch (tagType) {
                    case 'num':
                        this.$set(this.numFormat,row,val)
                        break;
                    case 'str':
                        this.$set(this.strFormat,row,val)
                        break;
                    case 'stsin':
                        this.$set(this.stsinFormat,row,val)
                        break;
                    case 'day':
                        this.$set(this.dayFormat,row,val)
                        break;
                    case 'stmuti':
                        this.$set(this.stmutiFormat,row,val)
                        break;
                    case 'dayRg':
                        this.$set(this.dayRgFormat,row,val)
                        break;
                    default:
                        break;
                }
            },

            setData2(val1,val2,row,index,tagType){
                this.$set(this.dbinputFormat,[row+'l'],val1);
                this.$set(this.dbinputFormat,[row+'r'],val2)
            },

            resetData1(val,row,index,tagType){
                switch (tagType) {
                    case 'num':
                        this.$set(this.numFormat,row,'')
                        break;
                    case 'str':
                        this.$set(this.strFormat,row,'')
                        break;
                    case 'stsin':
                        this.$set(this.stsinFormat,row,'')
                        break;
                    case 'day':
                        this.$set(this.dayFormat,row,'')
                        break;
                    case 'stmuti':
                        this.$set(this.stmutiFormat,row,[])
                        break;
                    case 'dayRg':
                        this.$set(this.dayRgFormat,row,[])
                        break;
                    default:
                        break;
                }
            },

            resetData2(val1,val2,row,index,tagType){
                this.$set(this.dbinputFormat,[row+'l'],'');
                this.$set(this.dbinputFormat,[row+'r'],'')
            },

            onAddCondition() {
                this.conditionGroupItem.conditions.push({
                    "op": "",
                    "columnName": "",
                })
            },

            onMinusCondition(node) {
                let idx = this.conditionGroupItem.conditions.indexOf(node)
                this.conditionGroupItem.conditions.splice(idx, 1);
                // 减少到一定数量父节点就要删除
                if (this.conditionGroupItem.conditions.length <= 0) {
                    this.onMinusConditionGroupItem(this.conditionGroupItem)
                }
            },

            onChangeChildAndOr() {
                if (this.conditionGroupItem.op === "and") {
                    this.conditionGroupItem.op = "or"
                } else {
                    this.conditionGroupItem.op = "and"
                }

            },
            onMouseOver() {
                this.canShowClose = true
            },

            onMouseOut() {
                this.canShowClose = false
            }
        }
    }
</script>

<style scoped>
    .group {
      position: relative;
      /* display: inline-block; */
      /* padding-left: 20px; */
    }
    .conditionItem > div {
      display: inline-block;
    }
    .conditionItem {
      display: -webkit-box;
      margin-bottom: 10px;
      /* width: 600px; */
    }
    .action-relation {
      position: absolute;
      top: 0;
      left: 6px;
      width: 18px;
      height: 100%;
      /* background-color: #D8E4FF */
    }
    .text {
      position: absolute;
      top: 50%;
      left: 0;
      width: 100%;
      background: #d8e4ff;
      text-align: center;
      cursor: pointer;
      user-select: none;
      height: 25px;
      margin-top: -18px;
      border-radius: 3px;
      color: #5a8cff;
      font-size: 12px;
      font-weight: 700;
      line-height: 25px;
    }
    .action-relation::before {
      content: " ";
      position: absolute;
      top: 0;
      width: 2px;
      height: 100%;
      overflow: hidden;
      background: #d8e4ff;
      left: 8px;
    }
</style>
