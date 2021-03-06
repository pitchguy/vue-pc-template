import Vue from "vue";
import Router from "vue-router";
import * as store from "@/store";

import Tip403 from "@/pages/error/403";
import Tip404 from "@/pages/error/404";
import Tip500 from "@/pages/error/500";
import CommonLayout from "@/layout/commonLayout";
import Load from "../components/load";

const Home = () => import("@/pages/home");
const shopGoods = () => import("@/pages/shopGoods");
const HomeChild = () => import("@/pages/home/child");
const Test1 = () => import("@/pages/testComp");
const Test2 = () => import("@/pages/test2Comp");

Vue.use(Router);
const router = new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      redirect: "/home",
      component: CommonLayout,
      children: [
        {
          path: "/home",
          component: CommonLayout,
          children: [
            {
              path: "/",
              component: Home
            },
            {
              path: "child",
              component: HomeChild
            }
          ]
        },
        {
          path: "goods",
          component: shopGoods
        }
      ]
    },
    {
      path: "/test1",
      name: "test1",
      component: Test1
    },
    {
      path: "/test2",
      name: "test2",
      component: Test2
    },
    {
      path: "/403",
      name: "tip403",
      component: Tip403
    },
    {
      path: "/404",
      name: "tip404",
      component: Tip404
    },
    {
      path: "/500",
      name: "tip500",
      component: Tip500
    },
    {
      path: "*",
      redirect: "/404"
    }
  ]
});

// 有需要登陆认证的话 在vuex store中存值，进行判断
// router.beforeEach((to, from, next) => {
//     let isLogin = Boolean(store.state.user.id);
//     if(!isLogin&&(to.path !== '/Login')){
//         return next({ path: '/Login' })
//     }
//     next()
// })

export default router;
