<style scoped>
.layout {
  /* border: 1px solid #d7dde4; */
  background: #f5f7f9;
  position: relative;
  border-radius: 4px;
  overflow: auto;
  height: 100%;
}

.layout {
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE 10+ */
}
.layout::-webkit-scrollbar {
  /* WebKit */
  width: 0;
  height: 0;
}


</style>
<template>
  <div ref="myIona" class="layout" v-scroll="onScroll">
    <Layout>
      <header-bar class="header" v-if="initStatus"></header-bar>
      <Layout class="content">
        <Sider hide-trigger :style="{background: '#fff'}">
          <Menu
            :active-name="currentSelectedSubMenu"
            theme="light"
            width="auto"
            :open-names="[currentOpenMenu]"
            :accordion="true"
            @on-select="onMenuSelect"
            @on-open-change="onMenuOpenChange"
          >
            <Submenu v-for="item in menus" :key="item.title" :name="item.title">
              <template slot="title">
                <Icon :type="item.icon"></Icon>
                {{item.title}}
              </template>
              <MenuItem
                v-for="subItem in item.subMenu"
                :key="subItem.name"
                :name="subItem.title"
              >{{subItem.title}}</MenuItem>
            </Submenu>
          </Menu>
        </Sider>
        <Layout :style="{padding: '0 24px 24px'}">
          <Breadcrumb :style="{margin: '24px 0'}">
            <BreadcrumbItem v-for="item in breadCrumbItems" :key="item.title">{{item.title}}</BreadcrumbItem>
          </Breadcrumb>
          <router-view v-if="didUserDataInitFinish"></router-view>
        </Layout>
      </Layout>
      <footer-bar v-if="initStatus"></footer-bar>
    </Layout>
    <Spin size="large" fix v-if="loading" style="z-index: 1000;"></Spin>
  </div>
</template>
<script>
import HeaderBar from "../../components/header/header-bar";
import FooterBar from "../../components/footer/footer-bar";
import { post, getCookie } from "@/util/httpUtil.js";
import { async } from "q";
import sleep from "sleepjs";
import { EventBus } from "@/util/EventBus.js";

export default {
  components: {
    HeaderBar,
    FooterBar
  },
  data() {
    return {
      loading: true,
      initStatus: false,
      loadingContent: true,
      currentOpenMenu: "",
      currentSelectedSubMenu: "",
      menus: [
        {
          title: "Iona广场",
          icon: "ios-chatboxes-outline",
          subMenu: [
            {
              title: "伊友动态"
            }
            // {
            //   title: "随便看看"
            // },
            // {
            //   title: "世界新闻"
            // }
          ]
        },
        {
          title: "Iona寝室",
          icon: "ios-navigate",
          subMenu: [
            {
              title: "个人信息"
            },
            {
              title: "我的伊文"
            }
            // {
            //   title: "隐私设置"
            // }
          ]
        }
      ],
      breadCrumbItems: [
        {
          title: "暂无选择"
        }
      ],
      didUserDataInitFinish: false,
      lock: {
        scroll: false
      }
    };
  },
  created: function() {
    this.initSider();
    this.manageUserData(getCookie(global.$prop.COOKIE_USERNAME));
    EventBus.$on("on-scroll-buttom-success", () => {
      this.lock.scroll = false;
    });
  },
  methods: {
    initSider: function() {
      //初始化Sider
      let curMenu = "";
      let curSelected = "";
      //根据router信息判断当前应该打开哪个菜单项
      this.$route.matched.forEach(routeItem => {
        this.menus.forEach(menuItem => {
          menuItem.subMenu.forEach(subMenuItem => {
            if (routeItem.name === subMenuItem.title) {
              curSelected = subMenuItem.title;
              curMenu = menuItem.title;
            }
          });
        });
      });
      //默认打开第一个菜单项
      if (curSelected === "") {
        curMenu = this.menus[0].title;
        curSelected = this.menus[0].subMenu[0].title;
      }
      this.currentOpenMenu = curMenu;
      this.currentSelectedSubMenu = curSelected;
      //更新导航BreadCrumb
      this.updateBreadCrumb();
    },
    onMenuSelect(name) {
      this.currentSelectedSubMenu = name;
      this.updateBreadCrumb(name);
      global.$util.routerPush(name);
    },
    onMenuOpenChange(names) {
      this.currentOpenMenu = names[0];
    },
    updateBreadCrumb() {
      let curOpenMenu = this.currentOpenMenu;
      let curSelectedSubMenu = this.currentSelectedSubMenu;
      let tempItems = [
        {
          title: curOpenMenu
        },
        {
          title: curSelectedSubMenu
        }
      ];
      this.breadCrumbItems = tempItems;
    },
    //读取所有的用户数据并缓存
    manageUserData(crewName) {
      post(
        global.$prop.URL.getCrew,
        {
          crewName: crewName
        },
        this.userDataResponse
      );
    },
    async userDataResponse(responseData) {
      this.$store.commit("updateUserData", responseData.crew);
      //更新头像url引用
      global.$util.updateAvatarUrl(this.$store, responseData.crew.avatarUrl);
      //解除Spin
      if (global.$prop.DEBUG) {
        await sleep(1000);
      }

      this.loading = false;
      this.didUserDataInitFinish = true;
      this.initStatus = true;
    },
    onScroll() {
      if (
        this.getScrollTop() + this.getWindowHeight() ==
        this.getScrollHeight()
      ) {
        if (!this.lock.scroll) {
          //通知message-list加载下一页数据
          this.lock.scroll = true;
          EventBus.$emit("on-scroll-buttom");
        }
      }
    },
    getScrollTop() {
      return this.$refs.myIona.scrollTop;
    },
    //文档的总高度
    getScrollHeight() {
      return this.$refs.myIona.scrollHeight;
    },
    getWindowHeight() {
      var windowHeight = 0;
      if (document.compatMode == "CSS1Compat") {
        windowHeight = document.documentElement.clientHeight;
      } else {
        windowHeight = document.body.clientHeight;
      }
      return windowHeight;
    }
  }
};
</script>