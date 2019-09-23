import Vue from 'vue'
import GlobalLayout from '@/layout/globalLayout'
import router from '@/router'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/public/assets/styles/index.scss'
import 'swiper/dist/css/swiper.css'
import store from './store/index'
import VueQuillEditor from 'vue-quill-editor'
import VueDND from 'awe-dnd'//拖拽工具
import VueAwesomeSwiper from 'vue-awesome-swiper'
import VueResource from 'vue-resource';
// require styles 引入样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import "@babel/polyfill";

Vue.use(Element, {size: 'small'}) // set element-ui default size
Vue.use(VueQuillEditor)
Vue.use(VueDND);
Vue.use(VueAwesomeSwiper);
Vue.use(VueResource);
Vue.config.productionTip = false; //阻止启动生产消息，常用作指令。

const Bus = new Vue()
new Vue({
  el: '#root',
  router,
  data:{
   Bus
  },
  store,
  components: {
    GlobalLayout
  },
  template: '<GlobalLayout/>'
})

if(module.hot) {
  module.hot.accept();
}
