<template>
<div>
  <boe-title>相关推荐</boe-title>
  <el-row :gutter="20" class="recm-list">
    <el-col :span="8">
      <div class="item">
        <div class='fl chart'  style="text-align:center;width:90px">
          <img :src='pic'>
        </div>
        <div class="fl item-left">
           <div class="item-left-top">手机验证码</div>
           <div class='item-left-sub'>
             <div class="item-left-text">订阅人数</div>
             <div class="item-left-number">12312312</div>
           </div>
            <div class='item-left-invoke'>
             <div class="item-left-text">累计调用次数</div>
             <div class="item-left-number">12312312</div>
           </div>
        </div>
      </div>
    </el-col>
     <el-col :span="8">
      <div class="item">  </div>
    </el-col>
      <el-col :span="8">
      <div class="item">  </div>
    </el-col>
  </el-row>
  </div>
</template>
<script>
import BoeTitle from "@/components/boeTitle";
import pic from "@/public/assets/imgs/self.png";
export default {
    components: {
      "boe-title":BoeTitle
    },
    data(){
     return {
       pic
     }
    }
}
</script>
<style lang="scss">
  .recm-list{
    height: 100px;
    .item{
      height: 100px;
      box-sizing:border-box;
      border: 1px solid rgba(0,0,0,0.05);
      border-left:3px solid #2482D2;
      .chart{
        width:95px;
        text-align: center;
      }
      img{
        height: 60px;
        margin-top:20px;
      }
      .item-left{
        margin-top:20px;
        padding-left:15px;
        border-left: 1px solid rgba(0,0,0,0.09);
        .item-left-top{
          opacity: 0.75;
          font-size: 14px;
          color: #000000;
          margin-bottom: 10px;
        }
        .item-left-text{
          opacity: 0.45;
          font-size: 12px;
          color: #000000;
          margin-bottom:5px
        }
        .item-left-number{
          opacity: 0.75;
          font-size: 14px;
          color: #000000;
        }
      }
      .item-left-sub,.item-left-invoke{
        display: inline-block
      }
    }
  }
</style>


