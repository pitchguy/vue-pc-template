import Vue from 'vue'
import Vuex from 'vuex'
import global from '@/pages/global/vuex'
// import user from '@/pages/user/vuex'
// import apiSer from '@/pages/api/vuex'
// import forumSer from '@/pages/forum/vuex'
import home from '@/pages/home/vuex';
import addNew from '@/pages/addNew/vuex';
import ReportForm from '@/pages/reportForm/vuex';
import getters from './getters'

Vue.use(Vuex)
const store = new Vuex.Store({
  modules: {
    home,
    global,
    addNew,
    ReportForm,
  },
  getters
})

export default store
