<template>
  <el-menu-item  v-if="!user.children.length" :index="user.permissionUrl"
                 @click="redirec(user.permissionUrl)">
    <i class="iconfont" :class="[`icon-${user.permissionIcon}`]"></i> {{user.permissionName}}
  </el-menu-item>
  <el-submenu v-else  :index="user.permissionUrl">
    <template slot="title">
      <i class="iconfont" :class="[`icon-${user.permissionIcon}`]"></i>{{user.permissionName}}
    </template>
    <template v-for="child in user.children">
      <el-menu-item :key="child.permissionUrl"  :index="child.permissionUrl"
                    @click="redirec(child.permissionUrl)">
        <i class="iconfont" :class="[`icon-${child.permissionIcon}`]"></i> {{child.permissionName}}
      </el-menu-item>
    </template>
  </el-submenu>
</template>

<script>
  import path from 'path'
  export default {
    name: 'SideItem',
    components: {  },
    props: {
      user: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        onlyOneChild: null
      }
    },
    methods: {
      redirec(path){
        if(path){
          this.$router.push(path);
        }else{
          console.log('无效url',path);
        }

      }
    }
  }
</script>
<style>

</style>
