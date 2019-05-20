<template>
<div>
  <boe-tab></boe-tab>
  <router-view></router-view>
</div>
</template>
<script>
import List from './list.vue'
import BoeTab from '@/components/boeTab'

export default {
  components: {
    'boe-tab':BoeTab
  },
  data() {
    return {}
  },
  methods: {
  },
  mounted(){
    console.log(this.$route.path.match(/\/\w*/g),this.$router);
    let routeArr=this.$route.path.match(/\/\w*/g);
    let curUrl=`/api/index${routeArr[2]||'innerList'}`;
    let tabData={
      data:[
        {
        title:"所有服务",
        name: curUrl,
        content:''
        }
      ],
      checkedTab:curUrl
    }
    this.$router.replace(curUrl);
    this.$store.commit('SET_TAB_DATA',tabData);
  }
};
</script>

