<template>
  <div class="content" style="padding-top:20px">
    <el-row class="header-page" :gutter="20">
      <el-col :span="6">
         <el-input placeholder="请输入服务名称/编号/状态"
          size="small"
          v-model="extendParams.searchVal" class="list-search-input">
          <template slot="append">搜 索</template>
          </el-input>
      </el-col>
      <el-col :span="6">
         <el-cascader
            size="small"
            class="list-search-select"
            expand-trigger="hover"
            :options="options"
            style="width:100%"
            v-model="curOption"
            @change="cascChange">
         </el-cascader>
      </el-col>
      <el-col :span="8">
           <el-radio-group v-model="checkedLabel"
           size="small"
            class="list-search-rdo">
            <el-radio-button label="new">最新发布</el-radio-button>
            <el-radio-button label="hot">最热发布</el-radio-button>
            <el-radio-button label="better">精品发布</el-radio-button>
          </el-radio-group>
      </el-col>
    </el-row>
    <boe-border>
   <el-table
    ref="apiTable"
    :data="pageData"
    size="mini"
    max-height="800"
    tooltip-effect="dark"
    style="width: 100%"
    @sort-change="sortChange"
    @selection-change="checkedChange">
    <el-table-column
      type="selection"
      width="55">
    </el-table-column>
    <el-table-column
      label="日期"
      prop="date"
      width="120">
    </el-table-column>
    <el-table-column
      prop="name"
      label="姓名"
      sortable
      width="120">
    <template slot-scope="scope">
        <span class="boe-link" @click="addTab(scope.row)">{{scope.row.name}}</span>
    </template>
    </el-table-column>
    <el-table-column
      prop="status"
      label="状态"
      width="120">
    <template slot-scope="scope">
        <span  >{{scope.row.status?'已审核':"拒绝"}}</span>
    </template>
    </el-table-column>
    <el-table-column
      prop="address"
      label="地址"
      show-overflow-tooltip>
    </el-table-column>
    <el-table-column
      fixed="right"
      label="操作"
      width="120">
      <template slot-scope="scope">
          <boe-btn @click="subscribe(scope.row,'single')">订阅</boe-btn>
          <i class="iconfont icon-split" style="color:#ebeef5"></i>
          <span class="boe-btn" @click="exportFile(scope.row,'single')">导出</span>
      </template>
    </el-table-column>
  </el-table>
      </boe-border>
  <div class="footer-page">
    <div class="fl">
      <el-button type="primary" @click="subscribe('','batch')">订阅</el-button>
      <el-button type="primary" @click="exportFile('','batch')">导出</el-button>
    </div>
    <div class="fr">
      <el-pagination
          @current-change="changePage"
          :current-page.sync="pagation.curPage"
          :page-size="2"
          background
          popper-class="page-size"
          layout=" prev, pager, next"
          :total="pagation.total">
        </el-pagination>
      </div>
  </div>
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
import api from "@/api";
import http from "@/utils/fetch";
import utils from "@/utils";
import SubscribeDialog from "./component/subscribeDialog";
export default {
  components: {
    "subscribe-dialog": SubscribeDialog
  },
  data() {
    return {
      pagation: {
        total: 0,
        curPage: 1,
        pageSize: 10
      },
      extendParams: {
        field: "name",
        sort: "desc",
        searchVal: "",
        category: [],
        labelValue: "1"
      },
      pageData: [],
      checkedData: [],
      checkedLabel: "new",
      curOption: [],
      options: [
        {
          value: "zhinan",
          label: "指南",
          children: [
            {
              value: "shejiyuanze",
              label: "设计原则",
              children: [
                {
                  value: "yizhi",
                  label: "一致"
                },
                {
                  value: "fankui",
                  label: "反馈"
                },
                {
                  value: "xiaolv",
                  label: "效率"
                },
                {
                  value: "kekong",
                  label: "可控"
                }
              ]
            },
            {
              value: "daohang",
              label: "导航",
              children: [
                {
                  value: "cexiangdaohang",
                  label: "侧向导航"
                },
                {
                  value: "dingbudaohang",
                  label: "顶部导航"
                }
              ]
            }
          ]
        }
      ],
      dialogVisible: false,
      dialogTitle: "订阅",
      dialogData: {},
      listType:'inner'
    };
  },
  watch: {
    checkedLabel(newVal, oldVal) {
      console.log(newVal, oldVal);
      let params = {};
      //this.getListData(params);
    },
    $route(newVal, oldVal) {
      this.setTab(newVal.path);
      //请求接口
    }
  },
  methods: {
    setTab(curUrl) {
      let tabData = {
        data: [
          {
            title: "所有服务",
            name: curUrl,
            content: ""
          }
        ],
        checkedTab: curUrl
      };
      this.$router.replace(curUrl);
      this.$store.commit("SET_TAB_DATA", tabData);
    },
    cascChange(e) {
      console.log(e, "hand----update");
    },
    updateVisible() {
      this.dialogVisible = false;
    },
    updateData() {
      let params = {};
      this.dialogVisible = false;
    },
    toggleChecked(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.apiTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.apiTable.clearSelection();
      }
    },
    checkedChange(val) {
      this.checkedData = val;
    },
    addTab(row) {
      let tempData = this.$store.state.apiSer.tabData.data;
      let checkedTab = `/api/index/${this.$route.name}/${row.id}`;
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
        title: row.name,
        name: checkedTab,
        content: ""
      };
      tempData.push(tabObj);
      this.$store.commit("SET_TAB_DATA", { data: tempData, checkedTab });
      this.$router.push(checkedTab);
    },
    subscribe(row, flag) {
      let rowData = row;
      let params = {};
      if (flag == "single") {
        this.dialogData = row;
      } else {
        this.dialogData = this.checkedData;
      }
      this.dialogVisible = true;
    },
    exportFile(row, flag) {
      let rowData = row;
      let params = {};
      if (flag == "single") {
      } else {
      }
      http.exportFile(url, params).then(ret => {
        utils.downFile(ret);
      });
    },
    sortChange(cln, props, order) {
      console.log(cln, props, order);
      this.extendParams.field;
      this.extendParams.sort;
      let params = { ...this.extendParams, ...this.pagation };
      console.log(params);
      //this.getListData(params);
    },
    changePage(val) {
      this.pagation.curPage = val;
      let params = { pageSize: 10, curPage: val };
      this.getListData(params);
    },
    getListData(params) {
      api.getListData(params).then(ret => {
        if (ret.success) {
          this.pageData = ret.data.data;
          this.pagation.total = ret.data.total;
        }
      });
    }
  },
  mounted() {
    let tempData = this.$store.state.apiSer.tabData.data||[];
    let flag = false;
    tempData.forEach(item => {
      if (item.name.indexOf(this.$route.name) > -1) {
        flag = true;
      }
    });
    if (flag != true) {
      this.setTab(this.$route.path);
    }
    console.log('yyy--ppp');
    this.getListData({});
  }
};
</script>
<style lang="scss">
.content {
  padding: 30px 35px 30px;
  .header-page {
    margin-bottom: 30px;
  }
  .el-input-group__append {
    background: #3491E0 ;
    border: 1px solid #3491E0 ;
    color: #fff;
  }
}
.list-search-select{
      margin-top:-1px;
}
.list-search-rdo{
 span{
   padding:8px 20px!important;
 }
}

.footer-page {
  margin-top: 20px;
  overflow: hidden;
}

</style>

