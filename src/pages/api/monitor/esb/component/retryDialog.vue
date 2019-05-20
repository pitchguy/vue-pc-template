
<template>
        <el-dialog
            title=""
            :visible="visible"
            :width="width"
            @update:visible="handleCancel">
            <div class="retry-dialog">
              <div v-if="data.isSuc"><i class="el-icon-success"></i></div>
              <div v-if="!data.isSuc"><i class="el-icon-error"></i></div>

              <div>{{data.isSuc?'该服务已经重试成功。':'重试失败，请重试。'}}</div>
              <div>
               <el-button type="primary" @click="confirm" size="medium">确 认</el-button>
               </div>
            </div>
        </el-dialog>
</template>
<script>
export default {
 data(){
   return {
     form:{
       value:''
     }
   }
 },
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
     data:Object,

  },
  methods:{
   handleCancel(){
      this.$emit("update:retry");
   },
   confirm(){
     console.log(this.form,'form',this.data);
       this.$emit("update:retry");
   }
  }
}
</script>
<style lang="scss">
.retry-dialog{
  text-align: center;
  :nth-child(2){
    font-size: 18px;
    color: rgba(0,0,0,0.85);
  }
  div{
    margin-bottom:25px;
    i{
      color:#67c23a;
      font-size:32px;
    }
  }
}
</style>


