<template>
    <span style="display:flex;">
        <!-- 第一层业务域 -->
            <div style="width:170px;">
                <el-select filterable v-model="conditionItem.columnName" class="myclass2" @change="onTag2Change(mainIndex,conditionItem)">
                    <el-option v-for="(item,idx) in atomTagList" :key="idx" :label="item.name" :value="item.columnName">
                    </el-option>
                </el-select>
            </div>
            <!-- 第二层 -->
            <div style="width:100px;margin-left:8px;">
                <el-select v-model="conditionItem.op" class="myclass2" @change="(value) => selectChange(value,conditionItem.columnName,mainIndex)">
                    <el-option v-for="(item,idx) in opList[conditionItem.columnName]" :key="idx" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </div>
        <div style="width:min-170px;margin-left:8px;">
                <!-- 单选下拉框 -->
                <div v-if="format[conditionItem.columnName]=='stsin'">
                    <el-select 
                        v-model="stsinFormat[conditionItem.columnName]" 
                        placeholder="请选择" 
                        @change="(value) => wholeValueChange(value,conditionItem.columnName,mainIndex,'stsin')"
                    >
                        <el-option
                            v-for="(item,index) in stsinOption[conditionItem.columnName]"
                            :key="item.value+index"
                            :label="item.name"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </div>
                <!-- 纯数字情况 -->
                <div v-else-if="format[conditionItem.columnName]=='num'">
                    <el-input-number 
                        label="描述文字"
                        :controls="false"
                        v-model="numFormat[conditionItem.columnName]" 
                        @change="(value) => wholeValueChange(value,conditionItem.columnName,mainIndex,'num')"
                    ></el-input-number>
                </div>
                <!-- 字符串情况 -->
                <div v-else-if="format[conditionItem.columnName]=='str'">
                    <el-input 
                        v-model="strFormat[conditionItem.columnName]" 
                        placeholder="请输入内容"
                        @change="(value) => wholeValueChange(value,conditionItem.columnName,mainIndex,'str')"
                    ></el-input>
                </div>
                <!-- 单选日期情况 -->
                <div v-else-if="format[conditionItem.columnName]=='day'">
                    <el-date-picker
                        v-model="dayFormat[conditionItem.columnName]"
                        type="date"
                        placeholder="请选择日期"
                        format="yyyy 年 MM 月 dd 日"
                        :picker-options="pickerOptions"
                        @change="(value) => wholeValueChange(value,conditionItem.columnName,mainIndex,'day')"
                    >
                    </el-date-picker>
                </div>
                <!-- 多选框情况 -->
                <div v-else-if="format[conditionItem.columnName]=='stmuti'">
                    <el-select 
                        multiple
                        value-key="name" 
                        placeholder="请选择"
                        v-model="stmutiFormat[conditionItem.columnName]" 
                        @change="(value) => wholeValueChange(value,conditionItem.columnName,mainIndex,'stmuti')"
                    >
                        <el-option
                            v-for="(item,index) in stmutiOption[conditionItem.columnName]"
                            :key="item.value+index"
                            :label="item.name"
                            :value="item.value"
                        />
                    </el-select>
                </div>
                <!-- 日期范围情况 -->
                <div v-else-if="format[conditionItem.columnName]=='dayRg'">
                    <el-date-picker
                        v-model="dayRgFormat[conditionItem.columnName]"
                        type="daterange"
                        placeholder="请选择日期范围"
                        format="yyyy 年 MM 月 dd 日"
                        :picker-options="pickerOptions"
                        @change="(value) => wholeValueChange(value,conditionItem.columnName,mainIndex,'dayRg')"
                    >
                    </el-date-picker>
                </div>
                <!-- 两个输入框的情况 -->
                <div v-else-if="format[conditionItem.columnName]=='numRg'">
                    <el-input-number 
                        label="描述文字"
                        :controls="false"
                        v-model="dbinputFormat[conditionItem.columnName+'l']" 
                        @change="(value) => dbInputChange(value,conditionItem.columnName,mainIndex,'numRg','lvalue')"
                    ></el-input-number>
                    <el-input-number 
                        label="描述文字"
                        :controls="false"
                        v-model="dbinputFormat[conditionItem.columnName+'r']" 
                        @change="(value) => dbInputChange(value,conditionItem.columnName,mainIndex,'numRg','rvalue')"
                    ></el-input-number>
                </div>  
                <div v-else></div>
            </div>
    </span>
</template>
<script>
import api from '@/api/';
import moment from 'moment';
import mixins from '@/constants/mixins';
import { find, pick, set, isEmpty, isUndefined } from 'lodash';
export default {
    mixins: [mixins],
    props: ['mainIndex','conditionItem','atomTagList','conditionGroupItem'],
    data(){
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
        this.setOption(this.labelConf,this.mainIndex);
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

            setOption(newVal,mainIndex){
                        const res = this.conditionGroupItem.conditions[mainIndex];
                        const columnName = res.columnName;
                        const currentSelect = _.find(this.labelConf,{'columnName': columnName});
                        const columnType = this.thComponentCheck(res.op,isUndefined(currentSelect)?'':currentSelect.type);
                        
                        if(!isEmpty(columnName)){
                            this.$set(this.opList,columnName,_.find(newVal,{columnName}).acceptOps.map(
                                (res,index) => {return {label: res.opName, key: mainIndex, value: res.op}})
                            )
                            this.selectChange(res.op,columnName,'');
                            
                            if(columnType == 'numRg'){
                                //两个输入框特殊情况时
                                this.setData2(res.lvalue,res.rvalue,columnName,'',columnType)
                            }else if(columnType == 'dayRg'){
                                //时间范围选择框时
                                this.setData1([res.lvalue,res.rvalue],columnName,'',columnType)
                            }else{
                                //普通情况
                                this.setData1(res.value||res.listValue,columnName,'',columnType)
                            }
                        }
                
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
<style lang="scss" scoped>

</style>
