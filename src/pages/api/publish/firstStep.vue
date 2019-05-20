<template>
    <el-form :model="baseInfoForm" ref="baseInfoForm" :rules="baseInfoRules" label-width="100px" class="author-form">
      <el-form-item label="所属类目" prop="type" class="form-item">
        <el-cascader
          expand-trigger="hover"
          :options="typeList"
          v-model="baseInfoForm.type"
          style="width: 400px">
        </el-cascader>
      </el-form-item>
      <el-form-item label="服务全名" prop="serviceName" class="form-item">
        <el-input v-model="baseInfoForm.serviceName"  placeholder="请输入服务全名"></el-input>
      </el-form-item>
      <el-form-item label="服务别名" prop="serviceNickName" class="form-item">
        <el-input v-model="baseInfoForm.serviceNickName" placeholder="请输入服务别名"></el-input>
      </el-form-item>
      <el-form-item label="服务版本" prop="serviceVersion" class="form-item">
        <el-input v-model="baseInfoForm.serviceVersion" placeholder="请输入服务版本"></el-input>
      </el-form-item>
      <el-form-item label="服务描述" prop="description" class="form-item">
        <el-input v-model="baseInfoForm.description" rows="4" type="textarea" placeholder="请输入服务描述"></el-input>
      </el-form-item>
      <el-form-item label="服务LOGO" prop="icon" class="form-item">
        <el-upload
          v-model="baseInfoForm.icon"
          class="upload-demo"
          drag
          action="https://jsonplaceholder.typicode.com/posts/"
          multiple>
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-row>
          <el-col :span="6">
            <el-button @click="resetForm">清空</el-button>
          </el-col >
          <el-col :span="6">
            <el-button type="primary" native-type="submit" @click="baseInfoSubmit">下一步</el-button>
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
</template>

<script>
  import api from '@/api/'
  export default {
    data() {
      return {
        baseInfoForm: {
          type: [],
          serviceName: '',
          serviceNickName: '',
          serviceVersion: '',
          description: '',
          icon: ''
        },
        baseInfoRules: {
          type: [{required: true, message: '请选择服务类目', trigger: 'change'}],
          serviceName: [{required: true, message: '请输入服务全名', trigger: 'blur'}],
          serviceNickName: [{required: true, message: '请输入服务别名', trigger: 'blur'}],
          serviceVersion: [{required: true, message: '请输入服务版本', trigger: 'blur'}],
          icon: [{required: true, message: '请上传服务LOGO', trigger: 'change'}],
        },
        //类目
        typeList: [],
      }
    },
    methods:{
      baseInfoSubmit(e){
        e.preventDefault();
        // this.$refs.baseInfoForm.validate(valid=>{
        //   if(valid){
        //
        //   }
        // });
        this.$emit('baseInfoSubmit',this.baseInfoForm);
      },
      resetForm(){
        this.$refs.baseInfoForm.resetFields();
      },
    },
    mounted(){
      api.getTypeListData().then(ret=>{
        this.typeList = ret.data;
      })
    }
  }
</script>

<style lang="scss">
</style>
