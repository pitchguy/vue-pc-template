<template>
<div class="content">
    <div  class="export-content">
          <div class="export-btn">
              <el-button type="primary" @click="downFile('restful')">Restful模版下载</el-button>
              <el-button type="primary" @click="downFile('wsdl')">WSDL模版下载</el-button>
          </div>
          <div class="export-file">
            <el-upload
              drag
              action="https://jsonplaceholder.typicode.com/posts/"
              :on-change="handleChange"
              >
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">
                <div class="file-btn">点击或者将文件拖拽到这里上传</div>
                <div class="file-text">支持两种文件类型导入：EXCEL、WSDL</div>
              </div>
            </el-upload>
          </div>
          <div class="upload-btn">
              <el-button type="primary" size="medium" @click="uploadFile">确定上传</el-button>
          </div>
    </div>
    <result-dialog
        :visible.sync="dialogVisible"
        :title="dialogTitle"
        :data="dialogData"
        @update:visible="updateVisible"
        @update:data="updateData"
    ></result-dialog>
</div>
</template>
<script>
import ResultDialog from './component/resultDialog';
export default {
  components: {
    'result-dialog':ResultDialog
  },

  data() {
    return {
      dialogVisible:false,
      dialogTitle:'订阅',
      dialogData:{
        isSuc:true
      }
    };
  },
  methods:{
     updateVisible(){
      this.dialogVisible=false;
    },
    updateData(){
      let params={};
      this.dialogVisible=false;
      console.log('update--data');
      //this.getListData(params);
    },
    uploadFile(){
      this.dialogVisible=true;
     console.log(10000);
    },
    downFile(){
      console.log('fileda');
    },
    handleChange(file,fileList){
     console.log(file,fileList);
    }
  },
  mounted(){
    this.$on("resetUpload",()=>{
      console.log(1233123123123);
    })
  }
};
</script>
<style lang="scss">
    .export-content{
      width:660px;
      margin:100px auto;
     .export-file{
       margin-top:30px;
       .el-upload-dragger{
        background: rgba(0,0,0,0.02);
        border: 1px solid rgba(0,0,0,0.15);
        border-radius: 4px;
        height:190px;
        width:660px;
       }
       .file-btn{
        font-size: 16px;
        color: rgba(0,0,0,0.85);
       }
       .file-text{
          margin-top:15px;
          font-size: 14px;
          color: rgba(0,0,0,0.43);
       }
     }
     .upload-btn{
       margin-top:35px;
       text-align: center;
     }
    }
</style>

