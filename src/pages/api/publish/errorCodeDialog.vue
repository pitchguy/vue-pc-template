<template>
  <el-dialog
    :title="title"
    :visible="visible"
    :width="width"
    @update:visible="handleDialogCancel">
    <el-form :model="errorForm" :rules="errorRules" ref="errorForm" label-width="150px" style="width: 450px">
      <el-form-item label="错误代码" prop="code">
        <el-input v-model="errorForm.code"></el-input>
      </el-form-item>
      <el-form-item label="错误代码" prop="description">
        <el-input v-model="errorForm.description"></el-input>
      </el-form-item>
      <el-form-item label="处置意见" >
        <el-input v-model="errorForm.suggestion"></el-input>
      </el-form-item>
      <el-form-item style="text-align: right">
        <el-button @click="handleDialogCancel">取 消</el-button>
        <el-button native-type="submit" type="primary" @click="handleConfirm">保 存</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>


<script>
  export default {
    props:{
      errorInfo:Object,
      title:String,
      visible:Boolean,
      width:{
        type:String,
        default:'900px'
      }
    },
    watch:{
      errorInfo(value){
        this.errorForm=value;
      }
    },
    data(){
      return{
        errorForm:{},
        errorRules:{
          code:[{required: true, message: '请输入错误代码', trigger: 'blur'}],
          description:[{required: true, message: '请输入错误说明', trigger: 'blur'}],
        }
      }
    },
    methods:{
      handleDialogCancel(){
        this.$emit('update:visible');
      },
      handleConfirm(e){
        if(e){
          e.preventDefault();
        }
        this.$refs.errorForm.validate(valid=>{
          if(valid){
            this.$emit('save',this.errorForm);
          }
        });
      },
      reset(){
        this.$refs.errorForm.resetFields();
      }
    }
  }
</script>

<style scoped>

</style>
