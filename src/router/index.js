import Vue from 'vue';
import Router from 'vue-router';
import * as store from '@/store';

import Tip403 from "@/pages/error/403";
import Tip404 from '@/pages/error/404';
import Tip500 from '@/pages/error/500';
import CommonLayout from '@/layout/commonLayout';
import Load from '../components/load';

import Home from '@/pages/home';
import HomeChild from '@/pages/home/child'


Vue.use(Router)
const router = new Router({
    mode: 'history',
    routes: [{
        path: '/home',
        component: Home,
        children: [{
            path: 'child',
            name: 'home-child',
            component: HomeChild
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
        path: '*',
        redirect: '/404'
    }]
})

// 有需要登陆认证的话 在vuex store中存值，进行判断
// router.beforeEach((to, from, next) => {
//     let isLogin = Boolean(store.state.user.id);
//     if(!isLogin&&(to.path !== '/Login')){
//         return next({ path: '/Login' })
//     }
//     next()
// })

export default router