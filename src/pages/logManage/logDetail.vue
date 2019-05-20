<template>
    <el-dialog 
        width="50%"
        title="详情" 
        :visible.sync="currentVisible" 
        class="vk-tr-dialog"
        @close="closeDialog"
    >
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span style="color:#E6A23C;">异常信息</span>
            </div>
            <div class="text item">
                {{ showMessage.excMsg }}
            </div>
        </el-card>

        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span style="color:#409EFF;">入参信息</span>
            </div>
            <div class="text item" style="max-height:200px;min-height:150px;overflow: scroll;">
                {{ showMessage.paramContent }}
            </div>
        </el-card>

        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span style="color: #67C23A;">出参信息</span>
            </div>
            <div class="text item">
                {{ showMessage.returnContent }}
            </div>
        </el-card>

    </el-dialog>
</template>

<script>
export default {
    props: {
        dialogVisible:{
          type: Boolean,
          default: false
        },
        message: {
            type: null,
        }
    },
    data(){
        return{
            showMessage: {},
            currentVisible: this.dialogVisible
        }
    },
    watch: {
        message(newVal){
            this.showMessage = newVal;
        },
        dialogVisible(newVal){
            this.currentVisible = newVal;
        }
    },
    methods: {
        //关闭弹窗按钮
        closeDialog(){
            //some function
            this.$emit('close',false)
        }
    }
}
</script>

<style lang="scss">
    .vk-tr-dialog{
        .box-card{
            margin: 10px 0;
        }
    }
</style>
