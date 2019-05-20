import Vue from 'vue'
import api from "@/api/index.js";
import localDb from '@/utils/localDb';
import { isEmpty } from 'lodash';
import common from '@/constants/common';
const Bus = new Vue()

const home = {
  state: {
    labelValue: '',
    treeNodeIdObj: {},
    deleteTagObj: [],
    resetTabfObj: [],
    treeListLen: 0,
    businessCode: '',
    userInfo: {},
    commonPermData: [],
    homeType: [],
    labelConf: [],//衍生标签配置
    trggerType: false,//是否触发重置按钮
  },
  mutations: {
    CHANGE_LABEL_VALUE: (state, data) => {
      state.labelValue = data;
    },
    GET_LABEL_TREE_ID: (state, data) => {
      state.treeNodeIdObj = data;
    },
    SET_CURRENT_DATA_LEN: (state, data) => {
      state.treeListLen = data
    },
    DELETE_OLD_TAG: (state, data) => {
      state.deleteTagObj = data;
    },
    IS_TRIGGER_RESET: (state, data) => {
      state.trggerType = data;
    },
    RESET_OLD_TAG: (state, data) => {
      state.resetTabfObj = data;
    },
    SET_BUSSINESSCODE_DATA: (state,data) => {
      state.businessCode = data;
    },
    BASIC_LABEL_CONF: (state, data) => {
      state.labelConf = data;
    },
    GET_USER_INFO: (state, data) => {
      /*** 标签中心 ***/
      const labelViewPerm = common.permChecks('label_pre_view',data);//标签总览
      const originLbPerm = common.permChecks('origin_label_view',data);//原子标签
      const extendLbPerm = common.permChecks('extend_label_view',data);//衍生标签 
      const defLbperm = common.permChecks('def_label_view',data);//自定义标签
      const labelManagePerm = common.permChecks('def_label_type_view',data);//标签管理
      /*** 客群分析 ***/
      const labelTagsPerm = common.permChecks('label_encircle_view',data);//标签圈群权限
      const labelTagsMgPerm = common.permChecks('user_package_view',data);//客群包管理
      /*** 平台管理 ***/
      const userManagePerm = common.permChecks('user_view',data);//人员管理
      const roleManagePerm = common.permChecks('role_all_view',data);//角色管理
      const aliViewManagePerm = common.permChecks('ali_view',data);//阿里子账号管理
      const appManagePerm = common.permChecks('app_view',data);//应用管理
      const logManagePerm = common.permChecks('sys_log_manage',data);//系统日志权限

      const commonPermData = [{
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

      state.userInfo = data;
      state.commonPermData = commonPermData;
    },
    GET_HOME_TYPE: (state, data) => {
      state.homeType = data;
    }
  },
  actions: {
    //改变标签类别管理对应搜索值
    changeLabelValue({ commit }, params, cb) {
      commit('CHANGE_LABEL_VALUE',params);
    },
    //改变tree时的id object
    getTreeIdObj({ commit }, params, cb){
      commit('GET_LABEL_TREE_ID',params);
    },
    //标签类别管理数据为空时可删除
    setCurrentDataLen({ commit }, params, cb){
      commit('SET_CURRENT_DATA_LEN',params);
    },
    //已选标签数组
    deleteOldTag({ commit }, params, cb){
      commit('DELETE_OLD_TAG',params);
    },
    //是否触发重置按钮
    isTriggerReset({ commit }, params, cb){
      commit('IS_TRIGGER_RESET',params);
    },
    //重置所有标签选择
    resetOldTag({ commit }, params, cb){
      commit('RESET_OLD_TAG',params);
    },
    changeBsCode({ commit }, params, cb) {
      commit('SET_BUSSINESSCODE_DATA',params.businessCode);
    },
    //衍生标签基本配置表
    getBasicLabelConf({ commit }, params, cb){
      if(params=='')return false
      api.derivativeColumn({objectId:params}).then(res => {
          if(res.success){
              commit('BASIC_LABEL_CONF',res.data);//配置数据（important）
          }else{
            Bus.$message.error(res.message);
          }
      })

    },
    getUserInfo({ commit }, params, cb) {

        api.userInfo({}).then(response => {
            const { success, data, message } = response;

            commit('GET_HOME_TYPE',data.permCodes)
            if (success) {
                if(isEmpty(localDb.get('orgId')||localDb.get('usInfo'))){
                  localDb.set('usInfo',data);
                  localDb.set('orgId',data.orgId)
                }else{
                  localDb.clear();
                  localDb.set('usInfo',data);
                  localDb.set('orgId',data.orgId)
                }

                commit('GET_USER_INFO', data||[]);
            } else {
              Bus.$message.error(res.message);
            }
        })
     },
  }
}

export default home
