<template>
  <el-menu
    :default-active="activeIndex"
    class="side-user side-nav">
    <div class="title">
      <label  style="font-size: 20px">个人中心</label>
    </div>
    <side-item v-for="user in personalData" :key="user.name" :user="user"/>
  </el-menu>
</template>
<script>
  import SideItem from "./sideItem";
  export default {
    components: { SideItem },
    props: ["personalData"],
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
      let curPath = this.$route.path;
      return {
        activeIndex: curPath
      };
    },

    methods: {
      setItem() {
        let curPath = this.$router.currentRoute.path;
        this.activeIndex = curPath;
        this.openeds = curPath.match(/\/\w*/g);
      }
    }
  };
</script>
<style lang="scss">
  .side-user {
    text-align: left;
    border-right:none !important;
    .iconfont {
      font-size: 18px;
      margin-right: 5px;
    }
    .title{
      font-size: 20px;
      padding:15px 25px;
      display: block;
      font-weight: bolder;
    }
    .el-menu-item,
    .el-submenu__title {
      height: 40px !important;
      line-height: 40px !important;
    }
  }
</style>





