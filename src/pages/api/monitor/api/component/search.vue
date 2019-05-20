<template>
     <div class='esb-search'>
     <el-row :gutter="30" class="search-bottom">
      <el-col :span="8">
          <span class="fl search-field">服务名称：</span>
          <el-input class="fr search-input"
            placeholder="请输入服务名称"
            size="small"
            v-model="searchForm.msgId">
          </el-input>
       </el-col>
       <el-col :span="8">
          <span class="fl search-field">发布者：</span>
           <el-input class="fr search-input"
            size="small"
            placeholder="请输入发布者"
            v-model="searchForm.msgId">
          </el-input>
       </el-col>
       <el-col :span="8">
          <span class="fl search-field">调用者：</span>
            <el-select class="fl search-select" v-model="searchForm.caller"
             size="small"
             placeholder="请选择">
              <el-option
                v-for="item in callerList"
                :key="item.id"
                :label="item.label"
                :value="item.id">
              </el-option>
            </el-select>
       </el-col>
     </el-row >
     <el-row :gutter="30" class="search-bottom">
      <el-col :span="8">
           <span class="fl search-field">状态：</span>
            <el-select class="fl search-select" v-model="searchForm.caller"
            size="small"
             placeholder="请选择">
              <el-option
                v-for="item in callerList"
                :key="item.id"
                :label="item.label"
                :value="item.id">
              </el-option>
            </el-select>
       </el-col>
       <el-col :span="8">
          <span class="fl search-field">时间范围：</span>
          <el-date-picker class="fl search-date"
             size="small"
              v-model="searchForm.timeRang"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              >
            </el-date-picker>
       </el-col>
     </el-row >
   </div>
</template>
<script>
export default {
  data() {
    return {  };
  },
  props:{
   searchForm:Object
  },
  computed:{

    runStatusList(){
      return this.$store.state.global.runStatusList
    },
    callerList(){
      return this.$store.state.global.callerList
    }
  }
};
</script>
<style>
.esb-search{
  margin-top:20px;
}
</style>

