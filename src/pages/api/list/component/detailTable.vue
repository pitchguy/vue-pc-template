<template>
   <div>
   <boe-title>请求参数</boe-title>
  <el-row>
    <el-col>
     <boe-table
      :data="tbReqData"
      :columns="tbReqCln"
      :border="false"
     ></boe-table>
    </el-col>
  </el-row>
  <boe-title>接受参数</boe-title>
  <el-row>
     <boe-table
      :data="tbReqData"
      :columns="tbReqCln"
      :border="false"
     ></boe-table>
  </el-row>
</div>
</template>
<script>
import BoeTitle from "@/components/boeTitle";
import BoeTable from "@/components/boeTb";
export default {
    components: {
    "boe-title": BoeTitle,
    "boe-table":BoeTable
  },
  data() {
    return {
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
          key: "arg0",
          prop: "arg0",
          label: "发布入参数名"
        },
        {
          key: "arg1",
          prop: "arg1",
          label: "接入入参数名"
        },
        {
          key: "type",
          prop: "type",
          label: "参数类型"
        },
        {
          key: "map",
          prop: "map",
          label: "映射方式"
        }
      ]
    };
  }
};
</script>

