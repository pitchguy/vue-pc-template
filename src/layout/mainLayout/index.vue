<template>
    <el-container>
      <el-header><TopBar :nav-data="navData" :userData="userData"/></el-header>
         <el-main style="padding:0px">
               <router-view></router-view>
         </el-main>
    </el-container>
</template>
<script>
import Footer from '@/components/footer'
import TopBar from './topBar'
import { mapState } from 'vuex'
export default {
  components:{Footer,TopBar},
  data() {
    return {
      msg: "layout",
      userData:{
        name:'dtux',
        phone:'13099999999'
      },
      sideData:[]
    };
  },
  mounted() {
      this.$store.dispatch('getNavData');
      this.$store.dispatch('getPersonalData');
  },
  beforeUpdate(){
    // console.log(this.navData,'navData');
    // console.log(this.personalData,'personalData');
  },
  methods: {
  },
  computed: mapState({
    navData: state => state.global.navData,
    personalData :state => state.global.personalData,
  }),
};
</script>

<style lang="scss">
  .el-header {
    background: #001529;
    height:54px !important;
    line-height: 54px;
  }

  .el-aside {
    color: #333;
  }

  .el-main {
    background-color: #f0f2f5;
    color: #333;
    text-align: center;
    font-family: PingFangSC-Regular;
    font-size: 14px;
    .boe-btn{
      color: #3491E0;
      cursor: pointer;
    }
    .content{
      background: #fff;
      min-height:600px;

    }
    .el-table__fixed-right::before, .el-table__fixed::before{
      height:0px;
    }
  }
  .boe-link{
    font-size: 14px;
    color: #3491E0;
    cursor: pointer;
  }
  .el-footer{
    background: #f0f2f5;
    padding:0px !important;
  }
  .el-table{
  th{
      color:#262626;
       font-size:14px;
    }
   td{
     color:#404040;
     font-size:14px;
   }
  }
  //el-table--medium td, .el-table--medium th
</style>
