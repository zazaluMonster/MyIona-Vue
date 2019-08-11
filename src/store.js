import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    //全局头像URL,默认引用本地的一个预置图片
    avatarUrl: require('./assets/avatar/avatar.jpg'),
    userData: {},
    defaultAvatarUrl: require('./assets/avatar/avatar.jpg')
  },
  // mutations都是同步方法
  mutations: {
    changeAvatarUrl (state, newUrl) {
      global.$util.logger("新图片地址：" + newUrl);
      state.avatarUrl = newUrl
    },
    updateUserData(state,newUserData){
      global.$util.logger("正在缓存用户信息" + newUserData.crewName);
      state.userData = newUserData;
    },
    emptyUserData(state,newUserData){
      global.$util.logger("正在清空用户信息");
      state.userData = newUserData;
    }
  }
})
