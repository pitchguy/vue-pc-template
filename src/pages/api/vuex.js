import api from "@/api/index.js";


const apiSer = {
  state: {
    tabData:{
      data:[],
      checkedTab:''
    }
  },
  mutations: {
    SET_TAB_DATA: (state, tabData) => {
      state.tabData = tabData
    }
  },
  actions: {
    setTabData({ commit }, data) {
      commit('SET_TAB_DATA',data );
     }
  }
}

export default apiSer
