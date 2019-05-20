<template>
    <el-dialog
        title=""
        :visible="visible"
        :width="width"
        @update:visible="handleCancel">
        <div style="text-align:center">
            <div class="result-txt">
              <i v-if="!data.isSuc" :class="{'icon-fail':!data.isSuc}" class="iconfont icon-alert_toast"></i>
              <i v-if="data.isSuc" :class="{'icon-suc':data.isSuc}" class="iconfont icon-alertcg"></i>
              <span>上传失败，请重新上传</span>
            </div>
            <div class="result-btn">
                <el-button v-if="data.isSuc" type="primary" size="small" @click="redirect">我的发布</el-button>
                <el-button type="primary" size="small" @click="resetUpload">重新上传</el-button>
            </div>
        </div>
      </el-dialog>
</template>
<script>
export default {
  props:{
    title:{
      type:String,
      default:false
    },
    visible:{
      type:Boolean,
      default:false
    },
    width:{
      type:String,
      default:'460px'
    },
    data:Object
  },
  methods: {
    handleCancel(){
      this.$emit("update:visible");
    },
    resetUpload() {
      this.$emit("update:visible");
      this.$emit("update:data");
    },
    redirect(){
      this.$router.push('/');
    }
  }
};
</script>
<style lang="scss" scoped>
    .result-txt{
      font-size: 18px;
      color: rgba(0,0,0,0.85);
    }
  .result-btn{
    margin-top:30px;
  }
  .icon-fail{
   color:red;
   font-size:16px;
  }
  .icon-suc{
   color:#67c23a;
    font-size:16px;
  }
</style>


