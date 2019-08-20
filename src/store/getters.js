const getters = {
  globalData: state => state.global.global,
  testData: state => {
    if(state.testVuex.result > 10){
      return state.testVuex.result;
    }else{
      return "暂时没有值"
    }
  }
  // userData: state => state.home.homeData,
  // newData: state => state.addNew.addNewData,
  // reportData: state => state.ReportForm.data
};
export default getters
