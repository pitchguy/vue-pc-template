<template>
  <div>
   <boe-title>
      <span class="feed-tab">
       <span @click="select(1)"  :class="{'cur-tab':curTab==1}">调试实例</span> <i class="iconfont icon-split feed-line"></i>
       <span @click="select(2)"  :class="{'cur-tab':curTab==2}">正常返回事例</span>  <i class="iconfont icon-split feed-line"></i>
       <span @click="select(3)" :class="{'cur-tab':curTab==3}">错误返回事例</span>
     </span>
   </boe-title>
   <div v-if="curTab ===1">
    <el-radio-group v-model="curLang" style="margin-bottom: 30px;" class="list-search-rdo">
    <el-radio-button label="JAVA">JAVA</el-radio-button>
    <el-radio-button label="C#">C#</el-radio-button>
    <el-radio-button label="Python">Python</el-radio-button>
    <el-radio-button label="OBJECTIVE-C">OBJECTIVE-C</el-radio-button>
    <el-radio-button label="命令行调用">命令行调用</el-radio-button>
    </el-radio-group>
    <div class="sdk-btn" style="display:inline-block">
        <el-button type="primary" size="small" @click="downFile">{{curLang}} SDK下载</el-button>
    </div>
    <div class="feed-lang">
       <div v-if="curLang=='JAVA'" v-html="langData.JAVA"></div>
       <div v-if="curLang=='C#'" v-html="langData.csharp"></div>
       <div v-if="curLang=='Python'" v-html="langData.csharp"></div>
       <div v-if="curLang=='OBJECTIVE-C'" v-html="langData.csharp"></div>
       <div v-if="curLang=='命令行调用'" v-html="langData.csharp"></div>
    </div>
   </div>
    <div class='suc-result' v-else-if="curTab ===2">
       <pre>
         {
           "status":"01",
           "msg":"实名认证通过"
         }
       </pre>
    </div>
   <div v-else-if="curTab ===3">
      <boe-table
      :data="tbReqData"
      :columns="tbReqCln"
      border
     ></boe-table>
    </div>
</div>
</template>
<script>
 import BoeTitle from "@/components/boeTitle";
  import BoeTable from "@/components/boeTb";
export default {
    components: {
      "boe-title":BoeTitle,
      "boe-table":BoeTable
    },
    data() {
      return {
        curTab:1,
        curLang:"JAVA",
        langData:{
          "csharp":`<h1><a id="_0"></a>一级标题</h1> <h2><a id="_1"></a>二级标题</h2> <h3><a id="_2"></a>三级标题</h3>`,
          "JAVA":`JAVA`
        },
        tbReqData: [
            {
              arg0: "12",
              arg1: "kkk",
              type: "string",
              map: "api参数"
            }
          ],
        tbReqCln: [
            {
              key: "map",
              prop: "map",
              label: "序号"
            },
            {
              key: "arg0",
              prop: "arg0",
              label: "错误码"
            },
            {
              key: "arg1",
              prop: "arg1",
              label: "类型"
            },
            {
              key: "type",
              prop: "type",
              label: "描述"
            }
          ]
      };
    },
    methods:{
     select(flag){

       this.curTab=flag;
     },
    downFile(){

    },
    },
    updated(){
      console.log(this.curTab,'curTab');
    }

}
</script>
<style lang="scss">
.feed-tab{
  font-size:16px;
  span{
    cursor: pointer;
  }
}
.feed-line{
 opacity: 0.09;
 color: #000000;
 font-size:18px;
}
.cur-tab{
  font-size: 16px;
  color: #2482D2!important;
}
.feed-lang{
  border:1px solid #eaeaea;
  height:200px;
  padding:5px;
  overflow-y: scroll;
}
.suc-result{
  border:1px solid #eaeaea;
  height:230px;
  overflow-y: scroll;
  pre{
    padding:5px;
  }
}
.sdk-btn{
    display: inline-block;
    vertical-align: top;
    margin-left: 20px;
}

</style>


