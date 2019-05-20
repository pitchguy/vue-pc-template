import common from '@/constants/common';
/*** 标签中心 ***/
const labelViewPerm = common.permCheck('label_pre_view');//标签总览
const originLbPerm = common.permCheck('origin_label_view');//原子标签
const extendLbPerm = common.permCheck('extend_label_view');//衍生标签 
const defLbperm = common.permCheck('def_label_view');//自定义标签
const labelManagePerm = common.permCheck('def_label_type_view');//标签管理
/*** 客群分析 ***/
const labelTagsPerm = common.permCheck('label_encircle_view');//标签圈群权限
const labelTagsMgPerm = common.permCheck('user_package_view');//客群包管理
/*** 平台管理 ***/
const userManagePerm = common.permCheck('user_view');//人员管理
const roleManagePerm = common.permCheck('role_all_view');//角色管理
const aliViewManagePerm = common.permCheck('ali_view');//阿里子账号管理
const appManagePerm = common.permCheck('app_view');//应用管理
const logManagePerm = common.permCheck('sys_log_manage');//系统日志权限

export const jusisData = [
    {
        entryUrl: 'intelLabel',
        child: [
            {id:'label-overview',labelName:'标签总览',show: labelViewPerm},
            {id:'atom-label',labelName:'原子标签',show: originLbPerm},
            {id:'derivative-label',labelName:'衍生标签',show: extendLbPerm},
            {id:'custom-label',labelName:'自定义标签',show: defLbperm},
            {id:'label-manage',labelName:'标签类别管理',show: labelManagePerm},
        ]
    },
    {
        entryUrl: 'userPotrait',
        child: [
            {id: 'user-potrait',labelName:'客户画像', show: true}
        ]
    },
    {
        entryUrl: 'labelGroup',
        child: [
            {id: 'label-whole-tags',labelName:'标签圈群',show: labelTagsPerm},
            {id: 'label-group-manage',labelName:'客群包管理',show: labelTagsMgPerm}
        ]
    },
    {
        entryUrl: 'reportForm-manage',
        child: [
            {id: 'reportForm-manage',labelName: '报表中心', show: true}
        ]
    },
    {
        entryUrl: 'keyCustomer',
        child: [
            {id: 'key-customer', labelName: '重点客户', show: true}
        ]
    },
    {
        entryUrl: 'globalSearch',
        child: [
            {id: 'global-search', labelName: '全局搜索', show: true}
        ]
    },
    {
        entryUrl: 'userjuri',
        child: [
            {id: 'user-juri',labelName: '人员管理',show: userManagePerm,},
            {id: 'user-role',labelName: '角色管理',show: roleManagePerm,},
            {id: 'subac-manage',labelName: '阿里子账号管理',show: aliViewManagePerm},
            {id: 'app-manage',labelName: '应用管理',show: appManagePerm},
            {id: 'log-manage',labelName: '系统日志',show: logManagePerm}
        ]
    }
]

export const navData = [
    {name: "首页", index: "home"},
    {name: "标签总览", index: "label-overview"},
    {name: "原子标签", index: "atom-label"},
    {name: "衍生标签", index: "derivative-label"},
    {name: "自定义标签", index: "custom-label"},
    {name: "标签类别管理", index: "label-manage"},
    {name: "客户画像", index: "user-potrait"},
    {name: "标签圈群", index: "label-whole-tags"},
    {name: "客群包管理", index: "label-group-manage"},
    {name: "报表中心", index: "reportForm-manage"},
    {name: "重点客户", index: "key-customer"},
    {name: "重点客户搜索", index: "key-customer-search"},
    {name: "用户详情", index: "user-potrait-detail"},
    {name: "全局搜索", index: "global-search"},
    {name: "人员管理", index: "user-juri"},
    {name: "角色管理", index: "user-role"},
    {name: "阿里子账号管理", index: "subac-manage"},
    {name: "应用管理", index: "app-manage"},
    {name: "日志管理", index: "log-manage"},
]