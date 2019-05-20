const getters = {
  globalData: state => state.global.global,
  userData: state => state.home.homeData,
  newData: state => state.addNew.addNewData,
  reportData: state => state.ReportForm.data
}
export default getters
