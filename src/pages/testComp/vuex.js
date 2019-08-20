const testDemo = {
  state: {
    result: 0
  },
  mutations: {
    SET_NEW_RESULT: (state, data) => {
        switch (data.type) {
          case "plus":
            state.result += data.value
            break;
          case "minus":
            state.result -= data.value
          default:
            break;
        }
    }
  },    
  actions: {
    setNewData({ commit }, params, cb) {
        commit("SET_NEW_RESULT", params);
    }
  }
}

export default testDemo