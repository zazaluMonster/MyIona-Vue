<style scoped>
/* Header */
.header {
  background: black;
}

.menu {
  background: black;
}

.header a {
  color: #fff;
  font-size: 14px;
}

.wrapper-header-nav-logo {
  height: 50px;
  margin-top: 14px;
  float: left;
}

.wrapper-header-nav-logo img {
  height: 75%;
}

.wrapper-header-nav-logo-font {
  height: 50px;
  margin-top: 8px;
  margin-left: 10px;
  float: left;
}

.wrapper-header-nav-logo-font img {
  height: 60%;
  position: relative;
  top: 6px;
}

.header-search {
  width: 32%;
  margin-top: 15px;
  margin-left: 43px;
  float: left;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.layout-nav {
  width: 420px;
  margin: 0 auto;
  margin-right: 0px;
}
</style>
<template>
  <Header class="header">
    <Menu class="menu" mode="horizontal" theme="dark" active-name="1" @on-select="headerMenuRouter">
      <a href="" class="wrapper-header-nav-logo">
        <img src="../../assets/logo/logo.png" />
      </a>
      <a href="" class="wrapper-header-nav-logo-font">
        <img src="../../assets/logo/logo_font.png" />
      </a>

      <transition name="fade">
        <AutoComplete
          v-model="value3"
          :data="searchData"
          :filter-method="filterMethod"
          placeholder="搜索..."
          icon="ios-search"
          class="header-search"
          v-show="searchSwitch"
        ></AutoComplete>
      </transition>
      <div class="layout-nav">
        <MenuItem name="search">
          <Icon type="ios-search"></Icon>搜索
        </MenuItem>
        <MenuItem v-for="item in headerMenus" :key="item.title" :name="item.title">
          <Icon :type="item.icon"></Icon>
          {{item.title}}
        </MenuItem>

        <user></user>
      </div>
    </Menu>
  </Header>
</template>
<script>
import User from "../../components/user/user";
export default {
  components: {
    User
  },
  data() {
    return {
      value3: "",
      searchData: ["船员管理", "修改密码", "上传头像"],
      searchCompont: "search",
      searchSwitch: false,
      headerMenus: [
        {
          title: "功能",
          icon: "ios-keypad"
        },
        {
          title: "后台",
          icon: "ios-analytics"
        },
        {
          title: "系统",
          icon: "ios-paper"
        }
      ]
    };
  },
  methods: {
    filterMethod(value, option) {
      return option.toUpperCase().indexOf(value.toUpperCase()) !== -1;
    },
    headerMenuRouter(name) {
      global.$util.logger(name);
      //开启搜索组件
      if (name == this.searchCompont) {
        this.searchSwitch = true;
      }
      //其他菜单Router
      else {
        this.searchSwitch = false;
        //跳转至开发中页面
        global.$util.routerPush("develeping");
      }
    },
    onLogoClick() {
      global.$util.routerPush("伊友动态");
    }
  }
};
</script>

