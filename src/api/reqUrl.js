const frontUrl ='/api/v1';
const backUrl='/api/v2';

export default {
  /********用户登陆和用户初始信息*********/
  userLogin: `${frontUrl}/app/list-by-login-user`,//登陆验证
  userLogout: `${frontUrl}/auth/logout`,//退出登录
  loginInfo: `${frontUrl}/login/get-idm-info`,//转跳地址
  userInfo: `${frontUrl}/user/current`,//用户信息
  userSwitch: `${frontUrl}/user/switch`,//切换用户
  userIndexList: `${frontUrl}/user/user-change-list`,//切换用户列表
  /************权限相关************/
   getJurisTree: `${frontUrl}/permission/fun-perm-tree`,//获取功能权限树
   getUserMissionId: `${frontUrl}/permission/data-perm-inner-get`,//获取数据权限列表
   getDataPermList: `${frontUrl}/permission/data-perm-list`,//获取角色的选中的数据权限列表
  /************首页看板模块************/
  boardTopNav: `${frontUrl}/board/business-has-list`,//用户顶上nav
  boardBottomNav: `${frontUrl}/board/org-type-list`,//业态下的组织类型
  boardCenterData: `${frontUrl}/board/data-panel-get`,//核心指标数据
  boardChartData: `${frontUrl}/board/data-distr-get`,//图表分布数据
  boardCityList: `${frontUrl}/board/rel-org-city-list`,//组织相关关联城市列表
  boardTree: `${frontUrl}/board/rel-org-tree`,//首页权限组织树 
  /************角色模版模块************/
  addNewUserTemp: `${frontUrl}/role-config/role-config-add`,//新增角色模板
  getUserTempList: `${frontUrl}/role-config/role-config-list`,//获取角色模板列表
  getConfigRoleList: `${frontUrl}/role-config/role-config-option-list`,//获取角色下拉模板列表
  getUserTemp: `${frontUrl}/`,//获取对应角色模版信息
  updateUserTemp: `${frontUrl}/role-config/role-config-update` ,//更新角色模版
  seeUserTemp: `${frontUrl}/role-config/role-config-view`,//查看角色模版
  deleteUserTemp(id){//删除角色模板
    return `${frontUrl}/role-config/role-config-del/${id}`
  },
  /*************新增角色模块*************/
  addNewUser: `${frontUrl}/role/role-add`,//新增角色
  deleteUser(id){//删除角色
    return `${frontUrl}/role/role-del/${id}`
  },
  getUserList: `${frontUrl}/role/role-list`,//获取角色列表
  userDropDownlist: `${frontUrl}/role/role-option-list`,//角色下拉列表
  updateUser: `${frontUrl}/role/role-update`,//更新角色信息
  seeUserDetail: `${frontUrl}/role/role-view`,//查看角色信息
  constructTree: `${frontUrl}/org/org-construct-tree`,//组织相关结构树
  constructDataTree: `${frontUrl}/org/org-construct-tree-data-perm`,//数据权限组织树
  addNewUserT: `${frontUrl}/user/add-user`,//新增用户
  relUser: `${frontUrl}/user/rel-role-user`,//角色授权
  getUserListT: `${frontUrl}/user/user-list`,//获取角色列表
  toggleLockUser: `${frontUrl}/user/toggle-lock`,//解冻冻结账号
  deleteUserJS(id){//删除角色
    return `${frontUrl}/user/user-del/${id}`
  },
  /*******报表管理********/
  reportDelete(id){//删除报表
    return `${frontUrl}/report/${id}`;
  },
  reportAdd: `${frontUrl}/report/add-report`,//新增报表
  reportList: `${frontUrl}/report/list`,//显示报表列表
  reportUpdate: `${frontUrl}/report/update-report`,//更新报表
  reportSort: `${frontUrl}/report/sort-reports`,//列表排序
  reportEmbed(id){//iframe url获取
    return `${frontUrl}/report/visitor-embed-report/${id}`;
  },
  reportHaslist: `${frontUrl}/report/report-has-list`,
  reportSso: `${frontUrl}/report/aliyun/quickBI/sso`,//报表设置跳转接口
  /*******api工厂********/
  apiSso: `${frontUrl}/report/aliyun/apiMarket/sso`,//报表设置跳转接口
  /*******应用管理********/
  appDelete(id){//删除应用
    return `${frontUrl}/app/${id}`;
  },
  appAdd: `${frontUrl}/app/add-app`,//新增应用
  appList: `${frontUrl}/app/list-apps`,//应用列表
  appSort: `${frontUrl}/app/sort-apps`,//应用排序
  appUpdate: `${frontUrl}/app/update-app`,//编辑更新应用
  /******阿里云子账号**********/
  aliyunList: `${frontUrl}/aliyun/list-aliyun-account`,//阿里云子账号列表
  aliyunBindList: `${frontUrl}/aliyun/list-userAliyun-account`,//阿里云已绑定子账号
  aliyunUnbindList: `${frontUrl}/aliyun/list-unbindUserAliyun-account`,//未绑定人员信息
  aliyunBindAction: `${frontUrl}/aliyun/bind-aliyun-account`,//绑定人员操作
  aliyunUnbindAction(id){//解绑子账号
    return `${frontUrl}/aliyun/unbind-aliyun-account/${id}`
  },
  aliyunAdd: `${frontUrl}/aliyun/add-aliyun-account`,//新增阿里云子账号
  aliyunDelete(id){//阿里云子账号删除
    return `${frontUrl}/aliyun/delete/${id}`;
  },
  aliyunUpdate: `${frontUrl}/aliyun/update-aliyun-account`,
  /***** 标签首页 ******/
  tagIndexType: `${frontUrl}/tag-index/get-type-info`,//标签总览-左侧标签类型和公私占比
  tagIndexCommon: `${frontUrl}/tag-index/list-objects`,//标签总览首页-业务域+资产数
  tagIndexUse: `${frontUrl}/tag-index/get-used-stat`,//标签使用统计
  tagHotTags: `${frontUrl}/tag-index/list-hot-tags`,//标签列表
  /*******原子标签和衍生标签******/
  atomTagAdd: `${frontUrl}/atomTag/addNewTag`,//新增标签
  atomTagAddNew: `${frontUrl}/atomTag/add-atom-tag`,//新增原子标签
  sortTagByTime: `${frontUrl}/atomTag/sortTagByTime`,//最新标签查询，按时间排序接口 tagType=1，衍生标签tagType=2
  tagTypeTree: `${frontUrl}/tag-class/tag-class-tree`,//标签类别类目树
  tagObject: `${frontUrl}/tagObject`,//业务域数据
  tagSearch: `${frontUrl}/atomTag/queryTagByName`,//标签搜索
  atomTagListBind(id){//原子标签获取已绑定字段
    return `${frontUrl}/atomTag/list-bind-columns/${id}`
  },
  atomTagListUnBind(id){//原子标签获取未绑定字段
    return `${frontUrl}/atomTag/list-unbind-columns/${id}`
  },
  atomTagWatch(id){//获取原子标签详情
    return `${frontUrl}/atomTag/get-atom-tag-detail/${id}`
  },
  tagUpdate(id){//更新标签信息
    return `${frontUrl}/atomTag/updateTagInfo/${id}`;
  }, 
  atomDelete(id){
    return `${frontUrl}/customizeTag/deleteCustomizeTag/${id}`//原子标签删除
  },
  atomUpdateNew: `${frontUrl}/atomTag/update-atom-tag`,//更新编辑标签（new）
  tagStatuSingle: `${frontUrl}/atomTag/updateTagStatusSingle`,//单个更新按钮状态
  tagStatubatch: `${frontUrl}/atomTag/batchUpdateTagStatus`,//批量更新按钮状态
  queryTagByCategory: `${frontUrl}/atomTag/queryTagByCategory`,//根据类目查询标签
  /*******标签类别管理******/
  tagManageTree: `${frontUrl}/tag-class/tag-class-tree`,//标签类别管理类目树  
  tagManageAdd: `${frontUrl}/tag-class/add-tag-class`,//标签类别管理新增
  tagManageUpdate: `${frontUrl}/tag-class/update-tag-class`,//标签类别管理更新
  tagManageSearch: `${frontUrl}/tag-class/queryCateTags`,//标签类别table查询
  tagManageIsReapt: `${frontUrl}/tag-class/isRepeatCode`,//标签类别管理code查重
  tagManageDelete(id){//标签类别删除
    return `${frontUrl}/tag-class/delete/${id}`;
  },
  /********自定义标签********/
  tagCustomList: `${frontUrl}/customizeTag/queryCustomizeTag`,//自定义标签列表！！！弃用
  tagCustomAdd: `${frontUrl}/customizeTag/addNewCustomizeTag`,//新增自定义标签
  tagCustomSort: `${frontUrl}/customizeTag/orderTagByTime`,//按时间排序
  tagCustomByCate: `${frontUrl}/customizeTag/queryCustomizeTagByCategory`,//
  tagDelete(id){//删除标签
    return `${frontUrl}/atomTag/deleteTag/${id}`;
  },
  tagCustomUpdate(body,id){//修改自定义标签
    return `${frontUrl}/customizeTag/updateNewCustomizeTag/${id}`;
  },
  tagCustomSearch: `${frontUrl}/customizeTag/queryCustomizeTagByName`,//标签模糊搜索
  tagCustomBuild(body){//标签组合
    return `${frontUrl}/customizeTag/combinationCustomizeTag`;
  },
  /*******标签总览 ******/
  tagViewIncrease: `${frontUrl}/tagOverview/custom_tag_increase`,//自定义标签增长
  tagViewPercent: `${frontUrl}/tagOverview/tag_percent`,//标签占比
  tagViewScatter: `${frontUrl}/tagOverview/tag_scatter`,//标签分布
  tagViewTotal: `${frontUrl}/tagOverview/domain_census`,//业务域标签资产统计
  tagViewSearch: `${frontUrl}/tagOverview/domain_tag_list`,//业务域标签列表
  atomTagCategory: `${frontUrl}/atomTag/queryAtomTagCategory`,//衍生标签类目查询
  derivativeQuery: `${frontUrl}/derivativeTag/queryTagByCategory`,//衍生标签 列表查询
  derivativeAdd: `${frontUrl}/derivativeTag/add`,//衍生标签 新增
  derivativeColumn: `${frontUrl}/derivativeTag/list-config-columns`,//获取衍生标签可配置属性
  derivativeDel(id){ // 删除标签
    return `${frontUrl}/derivativeTag/deleteTag/${id}`;
  },
  derivativeRename(id){//验证重名
    return `${frontUrl}/atomTag/judgeTagName/${id}`
  },
  judgeTagName: `${frontUrl}/atomTag/judgeTagName`,//重名验证
  updateDerivativeTag(id){
    return `${frontUrl}/derivativeTag/updateDerivativeTag/${id}`//衍生标签 更新
  },
  derivativeStatus(id){
    return `${frontUrl}/derivativeTag/batchUpdateTagStatus/${id}`//衍生标签 状态更新
  },
  /****客群分析*****/
  getTagByCategory: `${frontUrl}/customersAnalysis/getTagByCategory`,//根据标签类目查询标签(新增衍生标签中用到)
  getUsedCate: `${frontUrl}/customersAnalysis/queryCommonlyUsedCate`,//获取常用标签（这个接口是用来请求不包括option的select）
  getUsedCateNew: `${frontUrl}/customersAnalysis/queryTagClassTagTree`,//获取常用标签new
  getUsedCateSearch: `${frontUrl}/customersAnalysis/getAllTagByName`,//中英文标签搜索
  getTagByUsedTag: `${frontUrl}/customersAnalysis/getTagByCategory`,//根据一级标签查询二级option
  saveCustomBag: `${frontUrl}/customersAnalysis/saveCustomersPackage`,//保存客群包
  updateCustomBag: `${frontUrl}/customersAnalysis/updateCustomersPackage`,//更新客群包
  getUsedBodyList: `${frontUrl}/customersAnalysis/getCustomerByTags`,//人员列表
  cusPackageSearch: `${frontUrl}/customersAnalysis/getCustomersPackageByName`,//获取&&根据条件查询客群包
  getCusNumByTag: `${frontUrl}/customersAnalysis/getCustomerNumByTags`,//根据标签圈人
  getCusExportXcl: `${frontUrl}/customersAnalysis/exportExcelCustomerByTags`,//标签圈人导出excel
  getUsedAnalyseLat: `${frontUrl}/customersAnalysis/list-analysis-dims`,//客群纬度分析
  getUsedAnalyseChart: `${frontUrl}/customersAnalysis/getCustomerByCategory`,//客群纬度图表
  getCityProject: `${frontUrl}/customersAnalysis/list-citys-projects`,//获取城市项目的关联 
  cusPackageEdit(id){//导出客群包人员
    return `${frontUrl}/customersAnalysis/getCustomerPackageInfo/${id}`
  },
  cusPackageList(id){//根据客群包查询人员列表
    return `${frontUrl}/customersAnalysis/queryCustomerList/${id}`
  },
  cusPackageDelete(id){//删除客群包
    return `${frontUrl}/customersAnalysis/deleteCustomersPackage/${id}`
  },
  editPackageName(id){
    return `${frontUrl}/customersAnalysis/updatePackageNameById/${id}`//修改客群包name
  },
  /*****用户画像&&客户相关*****/
  elasticSearch: `${frontUrl}/elasticsearch/query-customer-portrait-page`,//用户画像搜索
  elasticDetail: `${frontUrl}/elasticsearch/query-customer-portrait-detail`,//查询客户画像详情
  /******客户相关*******/
  custInfo: `${frontUrl}/cust/get-customer-info`,//查询客户信息详情
  custTags: `${frontUrl}/cust/get-customer-tags`,//查询客户标签
  custTrip: `${frontUrl}/cust/list-customer-trips`,//展示客户旅程
  cusTripDetail: `${frontUrl}/cust/list-customer-trips-detail`,//旅程详情
  custEvalute: `${frontUrl}/cust/list-customer-evaluates`,//客户评价图
  custEvaluteDetail: `${frontUrl}/cust/list-customer-evaluates-detail`,//客户评价详细
  /****** 重点客户 *******/
  importPanelSum: `${frontUrl}/importantCustomer/queryImportantCustomerSummary`,//重点客户概览
  importCusSearch: `${frontUrl}/importantCustomer/queryByKeyword`,//重点客户搜索
  importPanelSearch: `${frontUrl}/importantCustomer/list-by-keyword`,//点击panel客户搜索
  importCusExport: `${frontUrl}/importantCustomer/export-list`,//重点客户导出
  /******系统日志******/
  dtLogList: `${frontUrl}/dtlogs/list`,//系统日志
  /*******unsure******/
  aliyunAccount: `${frontUrl}/report/aliyun/quickBI/sso`,//权限是否绑定子账号
}
