import Vue from 'vue';
import Router from 'vue-router';
import Tip403 from "@/pages/error/403";
import Tip404 from '@/pages/error/404';
import Tip500 from '@/pages/error/500';
import TipFrozen from '@/pages/error/acFrozen';
import MainLayout from '@/layout/m_layout';
import CommonLayout from '@/layout/commonLayout';
import Load from '../components/load';

const Home = () => ({component: import('@/pages/home/index'),loading: Load});//首页
const reportForm = () => ({component: import('@/pages/reportForm/index'),loading: Load});//报表管理
const appManage = () => ({component: import('@/pages/appManage/index'),loading: Load});//应用管理
const subacManage = () => ({component: import('@/pages/subacManage/index'),loading: Load});//子账号管理
const userjuri = () => ({component: import('@/pages/userJuri/index'),loading: Load});//用户权限
const userPersonnel = () => ({component: import('@/pages/userJuri/components/treeTable'),loading: Load});//人员管理
const userRole = () => ({component: import('@/pages/userJuri/components/userManage'),loading: Load});//角色管理
const addNewUser = () => ({component: import('@/pages/addNew/components/addNewUser/index'),loading: Load});//新增用户
const addNewUserTemp = () => ({component: import('@/pages/addNew/components/addNewUserTemp/index'),loading: Load});//新增用户角色模版
const intelLabel = () => ({component: import('@/pages/intelLabel/index'),loading: Load});//智能标签模块入口
const labelOverView = () => ({component: import('@/pages/intelLabel/components/labelOverview'),loading: Load});//标签总览
const atomLabel = () => ({component: import('@/pages/intelLabel/components/atomicLabel'),loading: Load});//原子标签
const atomLabelAdd = () => ({component: import('@/pages/intelLabel/components/atomicLabel/add'),loading: Load});//原子标签新增
const customLabel = () => ({component: import('@/pages/intelLabel/components/customLabel'),loading: Load});//自定义标签
const labelManage = () => ({component: import('@/pages/intelLabel/components/labelManage'),loading: Load});//标签管理
const derivativeLabel = () => ({component: import('@/pages/intelLabel/components/derivativeLabel'),loading: Load});//衍生标签
const userPotrait = () => ({component: import('@/pages/userPotrait/index'),loading: Load});//用户画像
const labelGroup = () => ({component: import('@/pages/customerGroup/index'),loading: Load});//标签圈群common
const labelWholeTags = () => ({component: import('@/pages/customerGroup/tagsGroup/index'),loading: Load});//标签圈群
const labelGroupManage = () => ({component: import('@/pages/customerGroup/groupManage/index'),loading: Load});//标签圈群管理
const keyCustomer = () => ({component: import('@/pages/keyCustom/index'),loading: Load});//重点客户
const keyCustomerSearch = () => ({component: import('@/pages/keyCustom/components/customList'),loading: Load});//重点客户搜索
const globalSearch = () => ({component: import('@/pages/globalSearch'),loading: Load});//全局搜索 
const logManage = () => ({component: import('@/pages/logManage/index'),loading: Load});//日志管理


Vue.use(Router)
export default new Router({
    mode: 'history',
    routes: [{
        path: '/',
        component: MainLayout,
        children: [{
            path: '/',
            name: 'home',
            component: Home
        },{
            path: '/reportForm-manage',//报表管理
            name: 'reportForm-manage',
            component: reportForm
        },{
            path: '/userjuri',//用户权限
            component: userjuri,
            children: [{
                path: '/',//人员管理
                name: 'user-juri',
                component: userPersonnel
            },{
                path: 'role',//角色管理
                name: 'user-role',
                component: userRole
            },{
                path:'subacManage',//子账号管理
                name: 'subac-manage',
                component: subacManage
            },{
                path: 'appManage',//应用管理
                name: 'app-manage',
                component: appManage
            },{
                path: 'newUser',//新增用户
                name: 'newUser',
                component: addNewUser
            },{
                path: 'newUser/:id',//编辑用户
                name: 'nnewUser',
                component: addNewUser
            },{
                path: 'newUserTemp',//新增用户模版
                name: 'nnewUserTemp',
                component: addNewUserTemp
            },{
                path: 'newUserTemp/:id',//编辑用户模版
                name: 'newUserTemp',
                component: addNewUserTemp
            },{
                path: 'logManage',//日志管理页
                name: 'log-manage',
                component: logManage
            }]
        },{
            path: '/intelLabel',//智能标签模块入口
            component: intelLabel,
            children: [{
                path: '/',//标签总览
                name: 'label-overview',
                component: labelOverView
            },{
                path: 'atomLabel',//原子标签
                // name: 'atom-label',
                component: CommonLayout,
                children: [{
                    path: '',
                    name: 'atom-label',
                    component: atomLabel,
                },{
                    path: 'add',
                    name: 'atom-label-add',
                    component: atomLabelAdd//原子标签新增
                }]
            },{
                path: 'customLabel',//自定义标签
                name: 'custom-label',
                component: customLabel
            },{
                path: 'derivativeLabel',//衍生标签
                name: 'derivative-label',
                component: derivativeLabel
            },{
                path: 'labelManage',//标签管理
                name: 'label-manage',
                component: labelManage
            },{
                path: 'noAuth',
                name: 'intel-comp-auth',
                component: Tip403
            }]
        },{
            path: '/userPotrait',
            name: 'user-potrait',//用户画像
            component: userPotrait,
        },{
            path: '/labelGroup',//标签圈群common
            component: labelGroup,
            children: [{
                path: '/',
                name: 'label-whole-tags',//标签圈群
                component: labelWholeTags
            },{
                path: 'manage',//标签管理
                name: 'label-group-manage',
                component: labelGroupManage
            },{
                path: 'noAuth',
                name: 'label-group-auth',
                component: Tip403
            }]
        },{
            path: '/keyCustomer',//重点客户
            component: CommonLayout,
            children: [{
                path: '/',
                name: 'key-customer',
                component: keyCustomer,
            },{
                path: 'search',
                name: 'key-customer-search',
                component: keyCustomerSearch,
            }]
        },{
            path: 'globalSearch',
            name: 'global-search',
            component: globalSearch
        }]
    },
    {
      path: '/',
      redirect: '/home'
    },{
        path: '/403',
        name: 'tip403',
        component: Tip403
    },{
        path: '/404',
        name: 'tip404',
        component: Tip404
    },{
        path: '/500',
        name: 'tip500',
        component: Tip500
    },{
        path: '/frozen',
        name: 'frozen',
        component: TipFrozen
    },{
        path: '*',
        redirect: '/404'
    }]
})
