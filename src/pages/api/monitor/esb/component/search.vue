<template>
     <div class='esb-search'>
     <el-row :gutter="30" class="search-bottom">
      <el-col :span="8">
          <span class="fl search-field">消息ID：</span>
          <el-input class="fr search-input"
            size="small"
            placeholder="请输入消息ID"
            v-model="searchForm.msgId">
          </el-input>
       </el-col>
       <el-col :span="8">
          <span class="fl search-field">运行状态：</span>
           <el-select v-model="searchForm.status" placeholder="请选择"
            size="small"
            class="fl search-select">
              <el-option
                v-for="item in runStatusList"
                :key="item.id"
                :label="item.label"
                :value="item.id">
              </el-option>
            </el-select>
       </el-col>
       <el-col :span="8">
          <span class="fl search-field">调用方：</span>
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
          <span class="fl search-field">业务类型：</span>
          <el-input class="fr search-input"
          size="small"
          placeholder="请输入业务类型"
          v-model="searchForm.busType">
        </el-input>
       </el-col>
       <el-col :span="8">
          <span class="fl search-field">业务响应结果：</span>
          <el-input class="fr search-input"
          size="small"
          placeholder="请输入业务响应结果"
          v-model="searchForm.busRet">
       </el-input>
       </el-col>
          <el-col :span="8">
          <span class="fl search-field">服务名称：</span>
          <el-input class="fr search-input"
          placeholder="请输入服务名称"
              size="small"
          v-model="searchForm.serName">
        </el-input>
       </el-col>
     </el-row>
     <el-row :gutter="30" class="search-bottom">
      <el-col :span="8">
          <span class="fl search-field">业务关键词：</span>
          <el-input class="fr search-input"   size="small"
            placeholder="请输入业务关键词"
            v-model="searchForm.bugKey">
          </el-input>
       </el-col>
       <el-col :span="8">
          <span class="fl search-field">时间范围：</span>
          <el-date-picker class="fl search-date"
              v-model="searchForm.timeRang"
              type="daterange"
              size="small"
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
    return {
    };
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
<style lang='scss'>
    .search-field{
      text-align: right;
      width:30%;
      font-size:14px;
      line-height: 32px;
    }
    .search-bottom{
      margin-bottom: 30px;
    }
    .search-input{
        width:70% !important;
    }
    .search-date{
        width:70% !important;
    }
    .search-select{
      width:70%;
    }
</style>

