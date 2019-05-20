
<template>
        <el-dialog
            title=""
            :visible="visible"
            :width="width"
            @update:visible="handleCancel">
            <div class='dialog-header'> 你即将订阅：API Service 1221</div>
            <div class="dialog-cotent">
               <el-form ref="form" :model="form" inline label-width="50px" label-position="top">
                      <el-form-item label="每秒最大调用量(QPS):" required>
                          <el-input v-model="form.qps"></el-input> 次
                      </el-form-item>
                      <el-form-item label="每小时最大调用量(QPH):" required>
                          <el-input v-model="form.qph"></el-input> 次
                      </el-form-item>
                      <el-form-item label="订阅说明:" required>
                          <el-input type="textarea" v-model="form.comment"></el-input>
                      </el-form-item>
               </el-form>
               <div class="dialog-btn">
                      <el-button @click="handleCancel">取 消</el-button>
                      <el-button type="primary" @click="confirm">订阅</el-button>
               </div>
            </div>
        </el-dialog>
</template>
<script>
import api from "@/api";
export default {
 data(){
   return {
     form:{
       qps:'200',
       qph:'100',
       comment:""
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
      this.$emit("update:visible");
   },
   confirm(){
     console.log(this.form,'form',this.data);

     api.subscribe(this.form).then(ret=>{
        if(ret.success){
            this.$emit("update:data");
            this.$emit("update:visible");
            this.$message({
                message: '你已经成功提交订阅申请，请耐心等待审批',
                type: 'success'
            });
        }else{

        }
     })

   }
  }
}
</script>
<style lang="scss">
 .dialog-header{
  font-size: 24px;
  color: rgba(0,0,0,0.85);
  margin-bottom:30px;
 }
 .dialog-cotent{
   padding:20px 20px 0 20px;
   .el-form--inline{
     .el-form-item__label{
       padding:0px;
       font-size: 14px;
       color: rgba(0,0,0,0.85);
     }
     .el-form-item{
       width:100%;
       .el-input{
         width:95%;
       }
     }
     .el-textarea__inner{
       height:100px;
     }
   }
  .dialog-btn{
    text-align: right;
  }
 }
</style>


