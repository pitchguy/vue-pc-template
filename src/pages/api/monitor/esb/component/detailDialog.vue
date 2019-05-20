
<template>
        <el-dialog
            title=""
            :visible="visible"
            :width="width"
            @update:visible="handleCancel">
            <div class='esb-detail-dialog'>
             <div class='dialog-header'>API Service 1221监控明细</div>
             <el-tabs v-model="curTab" >
                <el-tab-pane  v-for="item in tabData.tabs" :key="item.id" :label="item.label" :name="item.name">
                   <el-row class="esb-dialog-row">
                      <el-col class="field-des" :span="4">时间：</el-col>
                      <el-col class="field-val" :span="20">2018-10-13</el-col>
                   </el-row>
                   <el-row class="esb-dialog-row">
                      <el-col class="field-des" :span="4">运行状态：</el-col>
                      <el-col class="field-val" :span="20">2018-10-13</el-col>
                   </el-row>
                   <el-row class="esb-dialog-row">
                      <el-col class="field-des" :span="4">运行节点：</el-col>
                      <el-col class="field-val" :span=20>2018-10-13</el-col>
                   </el-row>
                   <el-row class="esb-dialog-row">
                      <el-col class="field-des" :span="4">错误原因：</el-col>
                      <el-col class="field-val" :span="20">2018-10-13</el-col>
                   </el-row>
                    <el-row class="esb-dialog-row">
                      <el-col class="field-des" :span="4">错误明细：</el-col>
                      <el-col class="field-val" :span="20">2018-10-13</el-col>
                   </el-row>
                    <el-row class="esb-dialog-row">
                      <el-col class="field-des" :span="4">报文：</el-col>
                      <el-col :span="20">
                        <div class="fl report-txt field-val">
                          fsfadsfasfasfsafdsafasfsafsafasfsfasdfasfasfdsafffsfadsfasfasfsafdsafasfsafsafasfsfasdfasfasfdsaff
                        </div>
                        <div class="fr boe-link" style="margin-left:20px;" @click="exportReport">导出报文</div>
                        <div class="fr boe-link" @click="openReport">收起 <i class="el-icon-arrow-down"></i></div>
                      </el-col>
                   </el-row>
                   <el-row>
                     <el-col class="detail-dialog-report" :class="{'open-report':isOpen,'close-report':!isOpen}" >

                     </el-col>
                   </el-row>
                </el-tab-pane>
              </el-tabs>
            </div>
        </el-dialog>
</template>
<script>
import api from "@/api";
import http from "@/utils/fetch";
import utils from "@/utils";
export default {
  data() {
    return {
      form: {
        value: ""
      },
      curTab: "key_0",
      tabData: {
        tabs: [
          {
            id: "1221",
            label: "请求参数",
            name: "key_0",
            header: {},
            body: {}
          },
          {
            id: "1121",
            label: "调用ITSM请求服务",
            name: "key_1",
            header: {},
            body: {}
          },
          {
            id: "1191",
            name: "key_2",
            label: "Error",
            header: {},
            body: {}
          },
          {
            id: "1120",
            label: "回传ITSM的响应参数",
            header: {},
            name: "key_3",
            body: {}
          }
        ]
      },
      isOpen:false
    };
  },
  props: {
    title: {
      type: String,
      default: false
    },
    visible: {
      type: Boolean,
      default: false
    },
    width: {
      type: String,
      default: "760px"
    },
    data: Object
  },
  methods: {
    handleCancel() {
      this.$emit("update:visible");
    },
    confirm() {
      console.log(this.form, "form", this.data);
      this.$emit("update:data", this.form.value);
      this.$emit("update:visible");
    },
    openReport(){
      this.isOpen=!this.isOpen;
    },
    exportReport(){
       let rowData = row;
      let params={};
      let url='';
      http.exportFile(url,params).then(ret => {
        utils.downFile(ret);
      });
    }
  }
};
</script>
<style lang="scss">
.esb-detail-dialog{
    padding-right: 35px;
    padding-left: 35px;
    .el-tabs__nav-wrap::after{
      height:1px;
    }
    .report-txt{
      width:400px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .esb-dialog-row{
     margin-top:30px;
    }
}
.debug-dialog-btn {
  text-align: right;
}
.detail-dialog-report{
  transition:height 2s;
  background:#eee;/* Opera */
  margin-top:10px;
}
.close-report{
  height:0px;
}
.open-report{
  height:200px;
}
</style>


