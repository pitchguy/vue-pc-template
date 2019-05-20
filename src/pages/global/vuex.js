import api from "@/api/index.js";


const global = {
  state: {
    navData:[],
    sideBar:{
      isFold:false
    },
    personalData:[],
    tabData:{
      data:[],
      checkedTab:''
    },
    runStatusList:[
      {
        id:'1',
        label:"运行中",
      },
      {
        id:'2',
        label:'停止'
      }
    ],
    callerList:[
      {
        id:'2',
        label:"海外"
      },
      {
        id:'3',
        label:"国内"
      }
    ]
  },
  mutations: {
    GET_NAV_DATA: (state, data) => {
      state.navData = data;
    },
    GET_PERSONAL_DATA: (state, data) => {
      state.personalData = data;
    },
    TOGGLE_SIDE_BAR: (state, data) => {
      state.sideBar.isFold =!state.sideBar.isFold;
    }
  },
  actions: {
    getNavData({ commit }, params,cb) {
      api.getNavData({}).then(ret=>{
        commit('GET_NAV_DATA', ret.data.topNav||[]);
      })
    },
    getPersonalData({ commit }, params,cb) {
      api.getUserData({}).then(ret=>{
        commit('GET_PERSONAL_DATA', ret.data||[]);
      })
    },
   toggleSideBar({ commit }, params,cb) {
     commit('TOGGLE_SIDE_BAR', );
   }
  }
}

export default global
