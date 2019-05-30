<template>
   <div class="body-ct">
     <img class="error-500" :src="page404" alt="500"/>
     <div style="text-align:center;">查看页面不存在，<span class="back-tip" @click="redirct">返回</span></div>
   </div>
</template>

<script>
import page404 from '@public/assets/imgs/404.jpeg'
export default {
 data(){
   return {
     page404
   }
 },
 methods:{
   redirct(){
     this.$router.go(-1);
   }
 }
}
</script>

<style lang="scss" scoped>
.body-ct{
  display: flex;
  flex-direction: column;
  justify-content:center;
  align-items:Center;
  position: relative;
  z-index: 0;
  width: 100%;
  height: 100vh;
}
.error-500{
  height: 230px;
}
.back-tip{
 cursor: pointer;
 text-align: center;
 color:#2482D2;
}
</style>
