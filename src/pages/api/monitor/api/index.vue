<template>
  <div class="content api-monitor">
    <el-tabs v-model="curTab">
    <el-tab-pane label="统计日志" name="statLog">
      <error-list></error-list>
    </el-tab-pane>
    <el-tab-pane label="错误日志" name="errorLog">
       <error-list></error-list>
    </el-tab-pane>
  </el-tabs>
  </div>
</template>
<script>
import ErrorList from './component/errorList';
import StatList from './component/statList';
export default {
  components:{
      "error-list":ErrorList,
      "stat-list":StatList
  },
  data(){
    return {
     curTab:"statLog"
    }
  },
  methods:{
  }
}
</script>
<style lang="scss">
.api-monitor{
 .el-tabs__nav-wrap::after{
  height:1px;
}
}

</style>

