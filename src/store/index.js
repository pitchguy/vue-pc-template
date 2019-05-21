import Vue from 'vue'
import Vuex from 'vuex'
import global from '@/pages/global/vuex'
import addNew from '@/pages/addNew/vuex';
import getters from './getters'

Vue.use(Vuex)
const store = new Vuex.Store({
  modules: {
    global,
    addNew,
  },
  getters
})

export default store
