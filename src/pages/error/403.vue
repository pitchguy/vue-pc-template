<template>
   <div>
     <img class="error-403" :src="page403" alt="403"/>
     <div class="error-ct" style="text-align:center;">你的帐号尚未被授权，请联系管理员</div>
   </div>
</template>

<script>
import page403 from '@public/assets/imgs/pic_403.png'
export default {
 data(){
   return {
     page403,
   }
 },
 methods:{
 }
}
</script>

<style lang="scss">
.error-403{
  margin:120px auto 60px;
  display: block;
  height:230px;
}
.error-ct{
  font-size: 14px;
  color: #666666;
}
</style>
