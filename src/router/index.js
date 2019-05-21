import Vue from 'vue';
import Router from 'vue-router';
import Tip403 from "@/pages/error/403";
import Tip404 from '@/pages/error/404';
import Tip500 from '@/pages/error/500';
import MainLayout from '@/layout/m_layout';
import CommonLayout from '@/layout/commonLayout';
import Load from '../components/load';

import Home from '@/pages/home';
import HomeChild from '@/pages/home/child'


Vue.use(Router)
export default new Router({
    mode: 'history',
    routes: [{
        
    },{
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
