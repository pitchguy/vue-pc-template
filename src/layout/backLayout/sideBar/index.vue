<template>
    <el-menu
      :default-active="activeIndex"
      class="side-nav">
       <side-item v-for="nav in navData" :key="nav.name" :nav="nav"/>
    </el-menu>
</template>
<script>
import SideItem from "./sideItem";
export default {
  components: { SideItem },
  props: ["navData"],
  mounted() {

  },
  watch: {
    $route: function(to, from) {
      this.setItem();
    }
  },
  beforeUpdate(){
  },
  data() {
    let curPath = this.$route.path.match(/\/\w*/g).slice(0,3).join('');
    console.log(curPath,this.$route);
    return {
      activeIndex: curPath
    };
  },
  methods: {
    setItem() {
      let curPath = this.$router.currentRoute.path.match(/\/\w*/g).slice(0,3).join('');
      this.activeIndex = curPath;
      this.openeds = curPath.match(/\/\w*/g);
    }
  }
};
</script>
<style lang="scss">
.side-nav {
  text-align: left;
  border-right:none !important;
  .iconfont {
    font-size: 18px;
    margin-right: 5px;
  }
  .el-menu-item,
  .el-submenu__title {
    height: 40px !important;
    line-height: 40px !important;
  }
}
</style>





