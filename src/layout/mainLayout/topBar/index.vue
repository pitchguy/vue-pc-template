<template>
<div>
    <div class='fl top-left'>
      <router-link to="/">
       <img :src="Logo" alt="logo" class="logo">
      </router-link>
    </div>
    <div class="fl">
      <el-menu class="top-nav" :class="{'self-center':isCenter}"
       :default-active="activeIndex"
       mode="horizontal">
            <el-menu-item v-if="navData.length" v-for="nav in navData" :key="nav.permissionName"  :index="nav.permissionUrl.match(/\/\w*/g)[0]"
                @click="redirec(nav.permissionUrl)">
                 {{nav.permissionName}}
             </el-menu-item>
      </el-menu>
    </div>
    <div class='fr top-user' >
        <span>
          <router-link to="/user/publishManage/list">个人中心</router-link>
        </span>
        <i class="iconfont icon-split"></i>
        <span  >
          <a href="javascript:void(0)" @click="loginOut">
            退出
          </a>
        </span>
    </div>
  </div>
</template>
<script>
import TopItem from "./topItem";
import Logo from "@public/assets/imgs/logo.png";
export default {
  components: { TopItem },
  props: ["navData", "userData"],
  watch:{
    $route(newVal,oldVal){
     let reg=/\/user\//;
      if(reg.test(newVal.path)){
        this.isCenter=true;
      }else{
        this.isCenter=false;
      }
    }
  },
  data() {
    return {
      Logo,
      isCenter:false,
      currentUserName:'charles'
    };
  },
  computed:{
    activeIndex:function(){
        let routerArr = this.$route.path.match(/\/\w*/g);
        return routerArr[0];
    }
  },
  methods: {
    loginOut() {
      this.$router.push("/login");
    },
    redirec(path) {
      if (path) {
        this.$router.push(path);
      } else {
        console.log("无效url", path);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.top-left{
  width:200px;
  text-align: center;
}
.logo {
  width: 80px;
  height: 40px;
  margin-top: 6px;
  margin-left:-20px;
}
.el-menu--horizontal > .el-menu-item:not(.is-disabled):hover {
  background-color: #409eff !important;
  color: #fff;
}
.el-menu--horizontal>.el-menu-item{
    height: 54px;
    line-height: 54px;
}
.top-nav {
  background: transparent;
  li {
    width: 120px;
    text-align: center;
    color: #bfbfbf;
  }
  .is-active {
    background-color: #409eff !important;
    color: #fff !important;
  }
}
.self-center{
  .is-active {
    background-color: transparent!important;
     color: #bfbfbf !important;
  }
  .el-menu-item.is-active {
    border:none !important;
  }
}
.top-user{
 font-size:14px;
 color:#fff;
 .top-badge{
   display: inline-block;
   position: relative;
    .icon-youxiang{
      font-size:18px;
    }
   sup{
    background-color: #f56c6c;
    border-radius: 10px;
    color: #fff;
    display: inline-block;
    font-size: 12px;
    height: 18px;
    line-height: 18px;
    padding: 0 6px;
    text-align: center;
    white-space: nowrap;
    position: absolute;
    top: 4px;
    left: 10px;
  }
 }
}


</style>
