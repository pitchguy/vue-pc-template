<template>
   <div style="text-align:center">
     <div></div>
     <div>
       上传失败，请重新上传
     </div>
     <div>

     </div>
     <div>
         <el-button type="primary" size="medium" @click="resetUpload">重新上传</el-button>
     </div>
   </div>
</template>
<script>
export default {
  methods:{
    resetUpload(){
       this.$emit('resetUpload')
    }
  }
}
</script>
<style lang="scss">

</style>


