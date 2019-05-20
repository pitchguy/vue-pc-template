<template>
<el-tabs class="tab-router" v-model="checkedTab" type="card" closable
 @tab-click="clickTab"
 @tab-remove="removeTab">
  <el-tab-pane
    class="tabs"
    v-for="(item) in tabData"
    :key="item.name"
    :label="item.title"
    :name="item.name"
  >
  </el-tab-pane>
</el-tabs>
</template>
<script>
export default {
  data() {
   return {}
  },
  methods: {
      removeTab(targetName) {
        let tabs = this.tabData;
        if(tabs.length==1)return;
        let activeName = this.checkedTab;
        if (activeName === targetName) {
          tabs.forEach((tab, index) => {
            if (tab.name === targetName) {
              let nextTab = tabs[index + 1] || tabs[index - 1];
              if (nextTab) {
                activeName = nextTab.name;
              }
            }
          });
        }
        let checkedTab = activeName;
        let tabData = tabs.filter(tab => tab.name !== targetName);
          this.$router.push(checkedTab);
        this.$store.commit('SET_TAB_DATA',{data:tabData,checkedTab});
      },
     clickTab(data){
       let {index,name}=data;
        this.$router.push(name);
     }
  },
  computed:{
    tabData(){
      return this.$store.state.apiSer.tabData.data;
    },
    checkedTab:{
       get: function () {
       return this.$store.state.apiSer.tabData.checkedTab;
      },
     set: function () {
      }
    }
  }

}
</script>
<style lang="scss">
.tab-router{
  .el-tabs__nav-wrap{
      padding-left:35px;
    }
    margin-top:20px;
}

</style>

