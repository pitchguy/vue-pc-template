import api from "@/api/index.js";


const addNew = {
  state: {
    jurisData: []
  },
  mutations: {
    GET_JURIS_TREE: (state, data) => {
      state.jurisData = data
    }
  },
  actions: {
    getJurisTrees({ commit }, params, cb) {
        api.getJurisTree({}).then(response => {
            const { success, data, message } = response;
            console.log(data[0])
            if (success) {
                commit('GET_JURIS_TREE', data[0]||[]);
            } else {
                this.$message.error(message);
            }
        })
     }
  }
}

export default addNew
