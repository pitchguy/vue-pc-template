<template>
        <el-menu-item  :index="nav.permissionUrl"
         @click="redirec(nav.permissionUrl)">
                 {{nav.permissionName}}
        </el-menu-item>
       <!-- <el-submenu v-else  :index="nav.permissionUrl.match(/\/\w*/g)[0]">
            <template slot="title">
               {{nav.permissionName}}
            </template>
              <template v-for="child in nav.children">
                    <el-menu-item :key="child.permissionUrl.match(/\/\w*/g)[0]"  :index="child.permissionUrl"
                     @click="redirec(nav.permissionUrl)">
                     {{child.permissionName}}
                    </el-menu-item>
              </template>
      </el-submenu> -->
</template>

<script>
import path from 'path'
export default {
  name: 'TopItem',
  components: {  },
  props: ["nav"],
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
