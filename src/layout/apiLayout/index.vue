<template>
     <el-container>
        <el-aside width="200px" class="default-aside">
          <SideBar :nav-data="navData" />
        </el-aside>
          <el-main class="default-content">
             <router-view></router-view>
          </el-main>
        </el-container>
</template>
<script>
import SideBar from "./sideBar";
import { mapState } from 'vuex'
export default {
  components: { SideBar},
  mounted() {
  },
  beforeUpdate(){

  },
  data() {
    return {}
  },

  methods: {
  },
  computed: mapState({
    navData: state => {
       let tempData=state.global.navData;
       let curData=[],reg=/\/api\//;
       tempData.forEach(item=>{
         if(reg.test(item.permissionUrl)){
           curData=item.children;
         }
       })
       return curData;
    }
  })
};
</script>
<style lang="scss">
 .default-aside{
  border-right: 1px solid #e6e6e6;
  min-height:800px;
  background:#fff;
  .el-menu-item.is-active{
  background: #E6F7FF;
  border-right: 2px solid #4193D9;
  }
  .is-opened{
    .is-active{
        border-right: 3px solid #4193D9;
    }
  }
}
.default-content{
  min-height:800px;
  padding:0px !important;
  background:#fff;
  text-align: left;
}
</style>





