<template>
<div class="content api-detail">
  <div class="detail-top">
    <el-row>
      <el-col :span=12>
       <div class="fl">
          <img  class="pic" :src='pic'>
       </div>
        <div class="fl top-btn">
          <div class='server-name'>手机实名认证 server1129</div>
          <div style="margin-top:25px;">
            <el-button type="primary"  size="mini" @click="subscribe">立即订阅</el-button>
            <el-button type="primary" size="mini" @click="serverInvoke">服务调试</el-button>
          </div>
        </div>
     </el-col>
     <el-col :span=12 class="top-right">
        <div class="fl subscribe">
          <p>订阅人数/人</p>
          <p class="number">1,0002</p>
        </div>
        <div class="fl invoke">
          <p>累计调用次数/人</p>
          <p  class="number">1,0002</p>
        </div>
     </el-col>
    </el-row>
  </div>
  <boe-title></boe-title>
  <el-row>
    <el-col>
      <span class="field-des">姓名：</span><span class="field-val"> 杜康</span>
      <span class="field-des" style="margin-left:25px;">工号：</span> <span class="field-val">0000012</span>
      <span class="field-des" style="margin-left:25px;">邮箱号：</span><span class="field-val">yhxyangyi@163.com</span>
      <span class="field-des" style="margin-left:25px;">手机号：</span><span class="field-val">13051513936</span>
    </el-col>
  </el-row>
   <boe-title>API服务信息</boe-title>
   <el-row>
    <el-col><span class="field-des">服务说明：</span><span class="field-val">核对姓名和身份证号码和手机号码是否一致；服务器毫秒级响应，高服务稳定。</span></el-col>
  </el-row>
   <el-row class="api-server">
    <el-col :span=6>
      <p> <span class="field-des">所属类目：</span><span class="field-val"> 杜康</span></p>
      <p> <span class="field-des">服务别名：</span><span class="field-val"> 杜康</span></p>
      <p> <span class="field-des">版本号：</span><span class="field-val"> 杜康</span></p>
    </el-col>
    <el-col :span=6>
      <p> <span class="field-des">接口地址：</span><span class="field-val"> 杜康</span></p>
      <p> <span class="field-des">请求方法：</span><span class="field-val"> 杜康</span></p>
      <p> <span class="field-des">更新时间：</span><span class="field-val"> 杜康</span></p>
    </el-col>
    <el-col :span=6>
      <p> <span class="field-des">内外部API：</span><span class="field-val"> 杜康</span></p>
      <p> <span class="field-des">服务商：</span><span class="field-val"> 杜康</span></p>
      <p> <span class="field-des">调用费用：</span><span class="field-val"> 杜康</span></p>
    </el-col>
  </el-row>
  <detail-table></detail-table>
  <detail-feed></detail-feed>
   <detail-reco></detail-reco>
   <subscribe-dialog
    :visible.sync="dialogVisible"
    :title="dialogTitle"
    :data="dialogData"
    @update:visible="updateVisible"
    @update:data="updateData"
  ></subscribe-dialog>
</div>
</template>
<script>
import BoeTitle from "@/components/boeTitle";
import pic from "@/public/assets/imgs/self.png";
import BoeTable from "@/components/boeTb";
import DetailTable from "./component/detailTable";
import DetailFeed from "./component/detailFeed";
import DetailReco from "./component/detailReco";
import SubscribeDialog from "./component/subscribeDialog";
export default {
  components: {
    "boe-title": BoeTitle,
    "boe-table": BoeTable,
    "detail-table": DetailTable,
    "detail-reco": DetailReco,
    "detail-feed": DetailFeed,
    "subscribe-dialog": SubscribeDialog
  },
  data() {
    return {
      pic,
      dialogVisible: false,
      dialogTitle: "订阅",
      dialogData: {}
    };
  },
  methods: {
    subscribe() {
      this.dialogVisible = true;
    },
    serverInvoke() {
      let tempData = this.$store.state.apiSer.tabData.data;
      let curUrlInfo = this.$route;
      let curUrl = curUrlInfo.name == "innerDetail" ? "innerList" : "outerList";
      let checkedTab = `/api/index/${curUrl}/${this.urlParam.id}/debug`;
      let isExist = false;
      tempData.forEach(item => {
        if (item.name == checkedTab) {
          isExist = true;
        }
      });
      if (isExist) {
        this.$message({
          message: "该服务页面，已被打开",
          type: "warning"
        });
        return;
      }
      let tabObj = {
        title: "服务调试",
        name: checkedTab,
        content: ""
      };
      tempData.push(tabObj);
      this.$store.commit("SET_TAB_DATA", { data: tempData, checkedTab });
      this.$router.push(checkedTab);
    },
    updateVisible() {
      this.dialogVisible = false;
    },
    updateData() {
      let params = {};
      this.dialogVisible = false;
      console.log("update--data");
      //this.getListData(params);
    }
  },
  mounted() {
    this.urlParam = this.$route.params;
    //console.log(this.urlParam, urlParam, "detail");
    //请求后端接口
    console.log(this.$route.params);
  }
};
</script>
<style lang="scss">
.field-des {
  font-size: 14px;
  color:#262626;
}
.field-val {
  font-size: 14px;
  color: #595959;
}
.api-detail {
  .pic {
    height: 80px;
  }
  .top-btn {
    margin-left: 20px;
    .server-name {
      font-size: 24px;
      color: #333;
    }
  }
  .top-right {
    height: 80px;
    border-left: 1px solid #eee;
    padding-top: 5px;
    p {
      margin-bottom: 15px;
      opacity: 0.45;
      font-size: 14px;
      color: #000000;
    }
    .subscribe {
      margin-left: 20px;
    }
    .invoke {
      margin-left: 45px;
    }
    .number {
      font-size: 28px;
      color: #000;
      opacity: 0.85;
    }
  }
  .api-server {
    p {
      margin: 20px auto;
    }
  }
}
</style>
