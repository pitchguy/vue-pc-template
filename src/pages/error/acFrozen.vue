<template>
   <div>
     <img class="error-403" :src="pageFrozen" alt="403"/>
     <div class="error-ct" style="text-align:center;">你的帐号已被冻结，请联系管理员</div>
   </div>
</template>

<script>
import pageFrozen from '@public/assets/imgs/pic_frozen.png'
export default {
 data(){
   return {
     pageFrozen,
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
