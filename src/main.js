import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import iView from 'iview';
import 'iview/dist/styles/iview.css';
import { boot } from '@/boot.js';
import VueLazyload from 'vue-lazyload'
import vuescroll from 'vue-scroll'

//预加载
boot();

//取消vue生产Tip
Vue.config.productionTip = false

//默认配置iView
Vue.use(iView);

//配置vue-scroll
Vue.use(vuescroll)

//iView全局配置，按需使用
Vue.use(iView, {
    //config...
});

//配置vue-lazy,一个图片懒加载插件
Vue.use(VueLazyload)


// 实例化根vue
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')