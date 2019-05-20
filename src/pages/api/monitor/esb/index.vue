<template>
 <div class="content">
  <search :search-form="searchForm"></search>
  <div class="esb-list">
       <el-table
        :data="pageData"
        max-height="800"
        border
        size="small"
        style="width: 100%"
        @sort-change="sortChange"
        >
         <el-table-column
            type="index"
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
              <span class="cln-link" @click="addTab(scope.row)">{{scope.row.name}}</span>
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
            width="160">
            <template slot-scope="scope">
              <span class="boe-btn" @click="viewDetail(scope.row)">查看明细</span>
              <i class="iconfont icon-split" style="color:#ebeef5"></i>
              <span class="boe-btn" @click="retry(scope.row)">重试</span>
            </template>
          </el-table-column>
      </el-table>
      <div class="fr" style="margin-top:20px;">
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
    <detail-dialog
            :visible.sync="dialogVisible"
            :title="dialogTitle"
            :data="dialogData"
            @update:visible="updateVisible"
            @update:data="updateData"
        ></detail-dialog>
    <retry-dialog
        :visible.sync="retryVisible"
        :title="retryTitle"
        :data="retryData"
        @update:retry="updateRetry"
      ></retry-dialog>
 </div>
</template>
<script>
import api from "@/api";
import Search from "./component/search";
import DetailDialog from "./component/detailDialog";
import RetryDialog from "./component/retryDialog";
export default {
  components: {
    search: Search,
    "detail-dialog": DetailDialog,
    "retry-dialog": RetryDialog
  },
  data() {
    return {
      pageData: [],
      pagation: {
        total: 0,
        curPage: 1,
        pageSize: 10
      },
      searchForm: {
        msgId: "pp",
        status: "2",
        caller: "",
        busType: "",
        busRet: "",
        serName: "",
        bugKey: "",
        timeRang: ""
      },
      dialogVisible: false,
      dialogTitle: "修改",
      dialogData: {},
      retryVisible: false,
      retryTitle: "修改",
      retryData: {
        isSuc: true
      }
    };
  },
  watch: {
    searchForm: {
      handler(newName, oldName) {
        let params = { ...newName, ...this.pagation };
        console.log(params, "调用参数");
        this.getListData({});
      },
      deep: true
    }
  },
  methods: {
    updateVisible() {
      this.dialogVisible = false;
    },
    updateData(val) {
      this.dialogVisible = false;
    },
    updateRetry() {
      this.retryVisible = false;
    },
    viewDetail() {
      this.dialogVisible = true;
    },
    retry() {
      this.retryVisible = true;
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
    this.getListData({});
  }
};
</script>
<style>
</style>

