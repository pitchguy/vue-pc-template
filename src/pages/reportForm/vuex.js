import api from "@/api/index.js";


const reportForm = {
  state: {
    report_list: {}
  },
  mutations: {
    GET_REPORT_LIST: (state, data) => {
      state.report_list = data;
    },
  },
  actions: {
    getReportData({ commit }, params,cb) {
        api.reportList({}).then(ret => {
            commit('GET_REPORT_LIST', ret.data||[]);
        })
    }
  }
}

export default reportForm
