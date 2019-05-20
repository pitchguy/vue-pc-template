
<template>
        <el-dialog
            title=""
            :visible="visible"
            :width="width"
            @update:visible="handleCancel">
            <el-form ref="form" :model="form"  label-width="90px" label-position='left'>
                      <el-form-item label="关键字说明">
                          <el-input v-model="form.value"></el-input>
                      </el-form-item>
               </el-form>
               <div class="debug-dialog-btn">
                      <el-button @click="handleCancel">取 消</el-button>
                      <el-button type="primary" @click="confirm">订阅</el-button>
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
     data:Object
  },
  methods:{
   handleCancel(){
     console.log('test-debug');
      this.$emit("update:visible");
   },
   confirm(){
     console.log(this.form,'form',this.data);
       this.$emit("update:data",this.form.value);
       this.$emit("update:visible");
   }
  }
}
</script>
<style lang="scss">
.debug-dialog-btn{
  text-align: right;
}
</style>


