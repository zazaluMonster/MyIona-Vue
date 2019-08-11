import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);



export default new Router({
  // 从hash模式改为history，url中的#号消失
  mode: 'history',
  routes: [
    {
      path: '/MyIona/',
      name: 'login',
      component: () => import('./views/login/login.vue')
    },
    {
      path: '/MyIona/develeping',
      name: 'develeping',
      component: () => import('./views/developing/developing.vue')
    },
    {
      path: '/MyIona/main',
      name: "main",
      // 路由懒加载，有利于高效加载，webpackChunkName是一个可选项，表示你想把多个相同的vue组件都包在一起进行懒加载
      component: () => import('./views/main/main.vue'),
      children: [
        {
          path: 'userData',
          name: "个人信息",
          component: () => import(/* webpackChunkName: "userData" */ './views/content/user-data.vue'),
        },
        {
          path: 'myIMessage',
          name: "我的伊文",
          component: () => import(/* webpackChunkName: "myIMessage" */ './views/content/my-i-message.vue'),
        },
        {
          path: 'ionaDynamic',
          name: "伊友动态",
          component: () => import(/* webpackChunkName: "ionaDynamic" */ './views/content/friends-i-message.vue'),
        },
        {
          path: 'userCard/:userId',
          name: 'userCard',
          component: () => import(/* webpackChunkName: "userCard" */ './views/content/user-card.vue')
        },
        {
          path: 'messageDetail/:messageId',
          name: 'messageDetail',
          component: () => import(/* webpackChunkName: "messageDetail" */ './views/content/message-detail.vue')
        }
      ]
    },
    {
      path: '/MyIona/tos',
      name: "tos",
      component: () => import('./views/tos/tos.vue')
    },
    {
      // 未指定的页面重定向回首页（或者404页面）
      path: "*",
      redirect: "/MyIona/"
    }
  ]
})
