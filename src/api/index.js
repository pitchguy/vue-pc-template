//import http from '@/utils/http'
import http from '@/utils/fetch'
import reqUrl from './reqUrl'
export default {
  async viserChart(param){
    let ret = await http.get(reqUrl.viserChart, param);
    return ret;
  },
  /********用户登陆和用户初始信息*********/
  async userLogin(param){
    let ret = await http.get(reqUrl.userLogin, param);
    return ret;
  },
  async userLogout(param){
    let ret = await http.get(reqUrl.userLogout, param);
    return ret;
  },
  async loginInfo(param){
    let ret = await http.get(reqUrl.loginInfo, param);
    return ret;
  },
  async userInfo(param){
    let ret = await http.get(reqUrl.userInfo, param);
    return ret;
  },
  async userSwitch(param){//切换用户
    let ret = await http.get(reqUrl.userSwitch, param);
    return ret;
  },
  async userIndexList(param){//切换用户列表
    let ret = await http.post(reqUrl.userIndexList, param);
    return ret;
  },
  /************权限相关************/
  async getJurisTree(param){//获取功能权限树
    let ret = await http.get(reqUrl.getJurisTree, param);
    return ret;
  },
  async getUserMissionId(param){//获取数据权限列表
    let ret = await http.get(reqUrl.getUserMissionId, param);
    return ret;
  },
  async getDataPermList(param){
    let ret = await http.get(reqUrl.getDataPermList, param);
    return ret;
  },
  /**************首页看板 ***********/
  async getBoardTopNav(param){//用户顶上nav
    let ret = await http.get(reqUrl.boardTopNav, param);
    return ret;
  },
  async getBoardBottomNav(param){//业态下的组织类型
    let ret = await http.get(reqUrl.boardBottomNav, param);
    return ret;
  },
  async getBoardCenterData(param){//核心指标数据
    let ret = await http.get(reqUrl.boardCenterData, param);
    return ret;
  },
  async boardChartData(param){//图表分布数据
    let ret = await http.get(reqUrl.boardChartData, param);
    return ret;
  },
  async getBoardCityList(param){//组织相关关联城市列表
    let ret = await http.post(reqUrl.boardCityList, param);
    return ret;
  },
  async boardTree(param){//首页权限树
    let ret = await http.get(reqUrl.boardTree, param);
    return ret;
  },
  /************角色模版模块************/
  async addNewUserTemp(param){//新增角色模板
    let ret = await http.post(reqUrl.addNewUserTemp, param);
    return ret;
  },
  async getUserTempList(param){//获取角色模板列表
    let ret = await http.post(reqUrl.getUserTempList, param);
    return ret;
  },
  async getConfigRoleList(param){//获取角色下拉模板列表
    let ret = await http.get(reqUrl.getConfigRoleList, param);
    return ret;
  },
  async updateUserTemp(param){//更新角色模版
    let ret = await http.post(reqUrl.updateUserTemp, param);
    return ret;
  },
  async seeUserDetail(param){//查看角色信息
    let ret = await http.get(reqUrl.seeUserDetail, param);
    return ret;
  },
  async seeUserTemp(param){//查看指定角色模板详情
    let ret = await http.get(reqUrl.seeUserTemp, param);
    return ret;
  },
  async deleteUserTemp(param,id){//删除角色模板
    let ret = await http.delete(reqUrl.deleteUserTemp(id), param);
    return ret;
  },
  /*************新增角色模块*************/
  async addNewUser(param){//新增角色
    let ret = await http.post(reqUrl.addNewUser, param);
    return ret;
  },
  async deleteUser(param,id){//删除角色
    let ret = await http.delete(reqUrl.deleteUser(id), param);
    return ret;
  },
  async getUserList(param){//获取角色列表
    let ret = await http.post(reqUrl.getUserList, param);
    return ret;
  },
  async userDropDownlist(param){//角色下拉列表
    let ret = await http.get(reqUrl.userDropDownlist, param);
    return ret;
  },
  async updateUser(param){//更新角色信息
    let ret = await http.post(reqUrl.updateUser, param);
    return ret;
  },
  async constructTree(param){//组织树
    let ret = await http.get(reqUrl.constructTree, param);
    return ret;
  },
  async constructDataTree(param){//数据权限组织树
    let ret = await http.get(reqUrl.constructDataTree, param);
    return ret;
  },
  async addNewUserT(param){//新增用户
    let ret = await http.post(reqUrl.addNewUserT, param);
    return ret;
  },
  async relUser(param){//角色授权
    let ret = await http.post(reqUrl.relUser, param);
    return ret;
  },
  async getUserListT(param){//获取角色列表
    let ret = await http.post(reqUrl.getUserListT, param);
    return ret;
  },
  async toggleLockUser(param){//冻结解冻账号
    let ret = await http.post(reqUrl.toggleLockUser, param);
    return ret;
  },
  async deleteUserJS(param,id){
    let ret = await http.delete(reqUrl.deleteUserJS(id), param);
    return ret;
  },
  /*******报表管理********/
  async reportDelete(param,id){//删除报表
    let ret = await http.delete(reqUrl.reportDelete(id), param);
    return ret;
  },
  async reportAdd(param){//新增报表
    let ret = await http.post(reqUrl.reportAdd, param);
    return ret;
  },
  async reportList(param){//显示报表列表
    let ret = await http.get(reqUrl.reportList, param);
    return ret;
  },
  async reportUpdate(param){//更新报表
    let ret = await http.post(reqUrl.reportUpdate, param);
    return ret;
  },
  async reportSort(param){//报表排序
    let ret = await http.post(reqUrl.reportSort, param);
    return ret;
  },
  async reportEmbed(param,id){
    let ret = await http.post(reqUrl.reportEmbed(id), param);
    return ret;
  },
  async reportHaslist(param){//左侧权限列表
    let ret = await http.get(reqUrl.reportHaslist, param);
    return ret;
  },
  async reportSso(param){//设置报表接口
    let ret = await http.get(reqUrl.reportSso, param);
    return ret;
  },
  /*******应用管理********/
  async appDelete(param,id){//删除应用
    let ret = await http.delete(reqUrl.appDelete(id), param);
    return ret;
  },
  async appAdd(param){//新增应用
    let ret = await http.postForm(reqUrl.appAdd, param, true);
    return ret;
  },
  async appList(param){//应用列表
    let ret = await http.get(reqUrl.appList, param);
    return ret;
  },
  async appSort(param){//应用排序
    let ret = await http.post(reqUrl.appSort, param);
    return ret;
  },
  async appUpdate(param){//编辑更新应用
    let ret = await http.postForm(reqUrl.appUpdate, param, true);
    return ret;
  },
  /******阿里云子账号**********/
  async aliyunList(param){//阿里云子账号列表
    let ret = await http.post(reqUrl.aliyunList, param);
    return ret;
  },
  async aliyunBindList(param){//获取已绑定人员列表
    let ret = await http.post(reqUrl.aliyunBindList, param);
    return ret;
  },
  async aliyunUnbindList(param){//获取未绑定人员列表
    let ret = await http.post(reqUrl.aliyunUnbindList, param);
    return ret;
  },
  async aliyunAdd(param){//新增阿里云子账号
    let ret = await http.post(reqUrl.aliyunAdd, param);
    return ret;
  },
  async aliyunDelete(param,id){//删除阿里云子账号
    let ret = await http.delete(reqUrl.aliyunDelete(id), param);
    return ret;
  },
  async aliyunBindAction(param){//绑定操作
    let ret = await http.post(reqUrl.aliyunBindAction, param);
    return ret;
  },
  async aliyunUnbindAction(param, id){//解绑操作
    let ret = await http.post(reqUrl.aliyunUnbindAction(id), param);
    return ret;
  },
  async aliyunUpdate(param){
    let ret = await http.post(reqUrl.aliyunUpdate, param);
    return ret;
  },
  /****** 标签首页 ******/
  async tagIndexType(param){//标签总览-左侧标签类型和公私占比
    let ret = await http.get(reqUrl.tagIndexType, param);
    return ret;
  },
  async tagIndexCommon(param){//标签总览首页-业务域+资产数
    let ret = await http.get(reqUrl.tagIndexCommon, param);
    return ret;
  },
  async tagIndexUse(param){//标签使用统计
    let ret = await http.get(reqUrl.tagIndexUse, param);
    return ret;
  },
  async tagHotTags(param){
    let ret = await http.get(reqUrl.tagHotTags, param);
    return ret;
  },
  /*******标签******/
  async atomTagAdd(param){//新增原子标签
    let ret = await http.post(reqUrl.atomTagAdd, param);
    return ret;
  },
  async atomTagAddNew(param){//新增原子标签
    let ret = await http.post(reqUrl.atomTagAddNew, param);
    return ret;
  },
  async sortTagByTime(param){//标签列表，按时间排序启用
    let ret = await http.post(reqUrl.sortTagByTime, param);
    return ret;
  },
  async tagTypeTree(param){//类目树
    let ret = await http.get(reqUrl.tagTypeTree, param);
    return ret;
  },
  async tagObject(param){//业务域
    let ret = await http.get(reqUrl.tagObject, param);
    return ret;
  },
  async tagSearch(param){//标签搜索
    let ret = await http.post(reqUrl.tagSearch, param);
    return ret;
  },
  async tagUpdate(param, id){//标签更新
    let ret = await http.plainPut(reqUrl.tagUpdate(id), param);
    return ret;
  },
  async atomTagListBind(param, id){//原子标签获取已绑定字段
    let ret = await http.get(reqUrl.atomTagListBind(id), param);
    return ret;
  },
  async atomTagListUnBind(param, id){//原子标签获取未绑定字段
    let ret = await http.get(reqUrl.atomTagListUnBind(id), param);
    return ret;
  },
  async atomTagWatch(param, id){//原子标签详情
    let ret = await http.get(reqUrl.atomTagWatch(id), param);
    return ret;
  },
  async atomDelete(param, id){//原子标签删除
    let ret = await http.delete(reqUrl.atomDelete(id), param);
    return ret;
  },
  async atomUpdateNew(param){//更新编辑标签（new）
    let ret = await http.post(reqUrl.atomUpdateNew, param);
    return ret;
  },
  async tagStatuSingle(param){//标签api管理单个更新
    let ret = await http.getPut(reqUrl.tagStatuSingle, param);
    return ret;
  },
  async tagStatubatch(param){//标签api管理批量更新
    let ret = await http.getPut(reqUrl.tagStatubatch, param);
    return ret;
  },
  async queryTagByCategory(param){//根据类目查询标签
    let ret = await http.post(reqUrl.queryTagByCategory, param);
    return ret;
  },
  /*******标签类别管理******/
  async tagManageTree(param){//标签类别管理类目树
    let ret = await http.get(reqUrl.tagManageTree, param);
    return ret;
  },
  async tagManageAdd(param){//标签类别管理新增
    let ret = await http.post(reqUrl.tagManageAdd, param);
    return ret;
  },
  async tagManageUpdate(param){//标签类别管理更新
    let ret = await http.post(reqUrl.tagManageUpdate, param);
    return ret;
  },
  async tagManageSearch(param){//标签类别管理列表查询
    let ret = await http.post(reqUrl.tagManageSearch, param);
    return ret;
  },
  async tagManageIsReapt(param){
    let ret = await http.get(reqUrl.tagManageIsReapt, param);
    return ret;
  },
  async tagManageDelete(param,id){//标签类别删除
    let ret = await http.delete(reqUrl.tagManageDelete(id), param);
    return ret;
  },
  /********自定义标签********/
  async tagCustomList(param){//自定义标签列表！！！弃用
    let ret = await http.post(reqUrl.tagCustomList, param);
    return ret;
  },
  async tagCustomAdd(param){//新增自定义标签
    let ret = await http.post(reqUrl.tagCustomAdd, param);
    return ret;
  },
  async tagCustomSort(param){//按时间排序
    let ret = await http.post(reqUrl.tagCustomSort, param);
    return ret;
  },
  async tagCustomByCate(param){
    let ret = await http.post(reqUrl.tagCustomByCate, param);
    return ret;
  },
  async tagDelete(param,id){//删除标签
    let ret = await http.delete(reqUrl.tagDelete(id), param);
    return ret;
  },
  async tagCustomUpdate(param,body,id){//标签更新
    let ret = await http.formPut(reqUrl.tagCustomUpdate(id,body), param);
    return ret;
  },
  async tagCustomSearch(param){//组合标签搜索
    let ret = await http.post(reqUrl.tagCustomSearch, param);
    return ret;
  },
  async tagCustomBuild(param,body){//标签组合
    let ret = await http.post(reqUrl.tagCustomBuild(body), param);
    return ret;
  },
  /*******标签纵览 ******/
  async tagViewIncrease(param){//自定义标签增长
    let ret = await http.get(reqUrl.tagViewIncrease, param);
    return ret;
  },
  async tagViewPercent(param){//标签占比
    let ret = await http.get(reqUrl.tagViewPercent, param);
    return ret;
  },
  async tagViewScatter(param){//标签分布
    let ret = await http.get(reqUrl.tagViewScatter, param);
    return ret;
  },
  async tagViewTotal(param){//业务域标签资产统计
    let ret = await http.get(reqUrl.tagViewTotal, param);
    return ret;
  },
  async tagViewSearch(param){//业务域标签列表
    let ret = await http.post(reqUrl.tagViewSearch, param);
    return ret;
  },
  async atomTagCategory(param){//衍生标签类目查询
    let ret = await http.post(reqUrl.atomTagCategory, param);
    return ret;
  },
  async derivativeQuery(param){//根据类目查询标签
    let ret = await http.post(reqUrl.derivativeQuery, param);
    return ret;
  }, 
  async derivativeDel(param,id){// 删除标签
    let ret = await http.delete(reqUrl.derivativeDel(id), param);
    return ret;
  },
  async derivativeRename(param,id){
    let ret = await http.delete(reqUrl.derivativeDel(id), param);
    return ret;
  },
  async getTagByCategory(param){//根据标签类目查询标签(新增衍生标签中用到)
    let ret = await http.get(reqUrl.getTagByCategory, param);
    return ret;
  },
  async getUsedCate(param){//常用标签列表
    let ret = await http.get(reqUrl.getUsedCate, param);
    return ret;
  },
  async getUsedCateNew(param){//常用标签列表（最新接口）
    let ret = await http.get(reqUrl.getUsedCateNew, param);
    return ret;
  },
  async getUsedCateSearch(param){//中英文标签搜索
    let ret = await http.get(reqUrl.getUsedCateSearch, param);
    return ret;
  },
  async getTagByUsedTag(param){//根据一级标签查询二级option
    let ret = await http.get(reqUrl.getTagByUsedTag, param);
    return ret;
  },
  async saveCustomBag(param){//保存客群包
    let ret = await http.post(reqUrl.saveCustomBag, param);
    return ret;
  },
  async updateCustomBag(param){//更新客群包
    let ret = await http.post(reqUrl.updateCustomBag, param);
    return ret;
  },
  async getUsedBodyList(param){//人员列表
    let ret = await http.post(reqUrl.getUsedBodyList, param);
    return ret;
  },
  async cusPackageSearch(param){//获取&&查询客群包列表
    let ret = await http.post(reqUrl.cusPackageSearch, param);
    return ret;
  },
  async getCusNumByTag(param){//根据标签圈人
    let ret = await http.post(reqUrl.getCusNumByTag, param);
    return ret;
  },
  async getCusExportXcl(param){//标签圈人导出excel
    let ret = await http.postBlob(reqUrl.getCusExportXcl, param);
    return ret;
  },
  async getUsedAnalyseLat(param){//客群维度分析
    let ret = await http.get(reqUrl.getUsedAnalyseLat, param);
    return ret;
  },
  async getUsedAnalyseChart(param){//客群分布图表信息
    let ret = await http.post(reqUrl.getUsedAnalyseChart, param);
    return ret;
  },
  async getCityProject(param){//获取城市项目的关联 
    let ret = await http.get(reqUrl.getCityProject, param);
    return ret;
  },
  async cusPackageEdit(param,id){//编辑客群包
    let ret = await http.get(reqUrl.cusPackageEdit(id), param);
    return ret;
  },
  async cusPackageList(param,id){//根据客群包查询人员列表
    let ret = await http.get(reqUrl.cusPackageList(id), param);
    return ret;
  },
  async cusPackageDelete(param,id){//删除客群包
    let ret = await http.delete(reqUrl.cusPackageDelete(id), param);
    return ret;
  },
  async editPackageName(param,id){//修改客群包名称
    let ret = await http.getPut(reqUrl.editPackageName(id), param);
    return ret;
  },
  async derivativeAdd(param){//根据标签类目查询标签(新增衍生标签中用到)
    let ret = await http.post(reqUrl.derivativeAdd, param);
    return ret;
  },
  async derivativeColumn(param){//获取衍生标签可配置属性
    let ret = await http.get(reqUrl.derivativeColumn, param);
    return ret;
  },
  async updateDerivativeTag(param, id){//衍生标签更新
    let ret = await http.putJson(reqUrl.updateDerivativeTag(id), param);
    return ret;
  },
  async derivativeStatus(param,id){//衍生标签 状态批量更新
    let ret = await http.put(reqUrl.derivativeStatus(id), param);
    return ret;
  },
  async derivativeSort(param){//按时间排序
    let ret = await http.post(reqUrl.derivativeSort, param);
    return ret;
  },
  async derivativeRename(param,id){//衍生标签 重名
    let ret = await http.get(reqUrl.derivativeRename(id), param);
    return ret;
  },
  async judgeTagName(param){//重名验证
    let ret = await http.get(reqUrl.judgeTagName, param);
    return ret;
  },
  /*********用户画像*********/
  async elasticSearch(param){//用户画像搜索
    let ret = await http.post(reqUrl.elasticSearch, param);
    return ret;
  },
  async elasticDetail(param){//查询客户画像详情
    let ret = await http.get(reqUrl.elasticDetail, param);
    return ret;
  },
  async customInfo(param){//查询客户信息详情
    let ret = await http.get(reqUrl.customInfo, param);
    return ret;
  },
  async custTags(param){//查询客户标签
    let ret = await http.get(reqUrl.custTags, param);
    return ret;
  },
  async custInfo(param){//查询客户信息详情
    let ret = await http.get(reqUrl.custInfo, param);
    return ret;
  },
  async custTrip(param){//展示客户旅程
    let ret = await http.get(reqUrl.custTrip, param);
    return ret;
  },
  async cusTripDetail(param){//旅程详情
    let ret = await http.get(reqUrl.cusTripDetail, param);
    return ret;
  },
  async custEvalute(param){//客户评价图表
    let ret = await http.get(reqUrl.custEvalute, param);
    return ret;
  },
  async custEvaluteDetail(param){//客户评价详细
    let ret = await http.get(reqUrl.custEvaluteDetail, param);
    return ret;
  },
  /****** 重点客户 *******/
  async importPanelSum(param){//重点客户概览(首页)
    let ret = await http.get(reqUrl.importPanelSum, param);
    return ret;
  },
  async importCusSearch(param){//重点客户搜索
    let ret = await http.get(reqUrl.importCusSearch, param);
    return ret;
  },
  async importPanelSearch(param){//点击panel客户搜索
    let ret = await http.get(reqUrl.importPanelSearch, param);
    return ret;
  },
  async importCusExport(param){//重点客户导出
    let ret = await http.getBlob(reqUrl.importCusExport, param);
    return ret;
  },
  /*********系统日志*********/
  async dtLogList(param){//系统日志列表
    let ret = await http.post(reqUrl.dtLogList, param);
    return ret;
  },
  /*******unsure******/
  async aliyunAccount(param){
    let ret = await http.get(reqUrl.aliyunAccount, param);
    return ret;
  }
}
