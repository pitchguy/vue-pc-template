<template>
  <div class="grey-background">
    <!--步骤栏-->
    <div class="main-step">
      <el-steps :active="step" finish-status="success" align-center>
        <el-step title="填写基本信息"></el-step>
        <el-step title="填写详细配置"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
    </div>
    <div class="main-content">
      <!--第一步-->
      <first-step @baseInfoSubmit="baseInfoSubmit" v-show="step===0"/>
      <!--第二步-->
      <second-step
        v-show="step===1"
        @detailInfoSubmit="detailInfoSubmit"
        @prevStep="prevStep"/>
      <!--第三步-->
      <div class="last-step"  v-show="step===2">
        <div><i class="el-icon-success" style="color:#67c23a;font-size: 108px"></i></div>
        <h1 class="success-title">发布成功</h1>
        <p style="color: grey;margin-bottom: 30px">页面将在{{closeCount}}秒后返回</p>
        <el-button @click="linkToMyPublish">我的发布</el-button>
        <el-button type="primary" @click="continueUpload">继续上传</el-button>
      </div>

    </div>
  </div>
</template>

<script>
import API from '@/api/';
import FirstStep from './firstStep';
import SecondStep from './secondStep';
export default {
  components: {
    'first-step':FirstStep,
    'second-step':SecondStep,
  },
  data() {
    return {
      step:0,
      closeCount: 5,
      baseInfoForm:{},
      detailInfoForm:{},
    };
  },
  watch:{
    step(value){
      if(value===2){
        const timer = setInterval(() => {
          this.closeCount--;
          if (this.closeCount === 0) {
            window.history.go(-1);
            clearInterval(timer);
          }
        }, 1000);
      }
    }
  },
  methods: {
    baseInfoSubmit(baseInfoForm){
      this.baseInfoForm=baseInfoForm;
      this.step++;
    },
    detailInfoSubmit(detailInfoForm){
      this.detailInfoForm=detailInfoForm;
      this.step++;
    },
    prevStep(){
      this.step--;
    },

    linkToMyPublish(){},
    continueUpload(){
      window.location.reload();
    },

  },
  mounted(){

  },
  created(){

  }
};
</script>

<style>
  .grey-background {
    background-color: #eeeeee;
    min-height: 1000px;
    padding: 50px;
  }
  .main-step{
    margin: 0 50px 50px;
  }
  .main-content{
    /*margin: 50px;*/
    background-color: white;
    padding-top: 10px;
    padding-bottom: 50px;
    text-align: center;
  }
  .last-step{
    margin-top: 50px;
  }
  .success-title{
    margin:30px auto 30px;
    font-size: 25px;
    font-weight: bolder;
  }

</style>
