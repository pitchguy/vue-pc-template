<template>
  <el-popover
    placement="top"
    :width="width"
    trigger="click">
    <div v-if="filterType==='multiple'">
      <el-checkbox-group v-model="checkedList">
        <div v-for="check in checkList" :key="check.value"><el-checkbox :label="check.value">{{check.label}}</el-checkbox></div>
      </el-checkbox-group>
      <div class="mt-10">
        <el-button type="primary" size="mini" @click="handleFilter">筛选</el-button>
        <el-button size="mini" @click="handleReset">重置</el-button>
      </div>
    </div>
    <div v-else-if="filterType==='radio'">
      <el-select 
        v-model="selectValue"
        clearable
        filterable 
        placeholder="请选择" 
        @change="handleSelectChange">
        <el-option
          v-for="select in selectList"
          :key="select.value"
          :label="select.label"
          :value="select.value">
        </el-option>
      </el-select>
    </div>
    <div v-else-if="filterType==='originRadio'">
      <el-select 
        v-model="originSelectValue"
        filterable
        remote
        placeholder="请输入关键词"
        :remote-method="remoteMethod"
        :loading="loading" 
        @change="handleSelectChange">
        <el-option
          v-for="originSelect in originSelectList"
          :key="originSelect.value"
          :label="originSelect.label"
          :value="originSelect.value">
        </el-option>
      </el-select>
    </div>
    <span slot="reference">
      <span>{{label}}</span>
      <a href="javascript:void(0)" style="color:#909399"><i class="fa fa-filter"></i></a>
    </span>
  </el-popover>
</template>
<script>
export default {
  data(){
    return {
      checkedList:[],
      loading:false,
      originSelectList:[],
      selectValue:'',
      originSelectValue:''
    }
  },
  props:{
    width:{
      type:[Number,String]
    },
    filterType:{
      type: String,
      required: true,
      default:'multiple'
    },
    checkList:{
      type:Array,
      default:()=>[]
    },
    selectList:{
      type:Array,
      default:()=>[]
    },
    label:{
      type: String,
      required: true
    }
  },
  methods:{
    //筛选
    handleFilter(){
      if(this.filterType==='multiple'){
        this.$emit('filter',this.checkedList);
      }
    },
    //重置
    handleReset(){
      this.checkedList=[];
    },
    //选择器
    handleSelectChange(value){
      this.$emit('filter',value);
    },
    //远程搜索
    remoteMethod(query) {
        if (query !== '') {
          this.loading = true;
          setTimeout(() => {
            this.loading = false;
            this.options4 =[];
          }, 200);
        } else {
          this.options4 = [];
        }
      }
  }
}
</script>
<style lang="scss" scoped>

</style>
