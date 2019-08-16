<style scoped>
.container {
  margin-top: 3%;
  margin-right: auto;
  margin-left: auto;
  *zoom: 1;
  font-size: 14px;
  font-family: "Open Sans", Calibri, Candara, Arial, sans-serif;
}
.container,
.navbar-static-top .container,
.navbar-fixed-top .container,
.navbar-fixed-bottom .container {
  width: 940px;
}
h3 {
  font-size: 24.5px;
}
h1,
h2,
h3 {
  line-height: 40px;
  color: #004d61;
}
h1,
h2,
h3,
h4,
h5,
h6 {
  margin: 10px 0;
  font-family: inherit;
  font-weight: 300;
  line-height: 20px;
  color: #2c3e50;
  text-rendering: optimizelegibility;
}
.row {
  margin-left: -20px;
  *zoom: 1;
}
.span10 {
  width: 780px;
  padding-bottom: 8%;
}
[class*="span"] {
  float: left;
  min-height: 1px;
  margin-left: 20px;
}
h4 {
  font-size: 17.5px;
  color: #0066cc;
}
.big-li {
  color: black;
  font-size: 16px;
}
</style>
<template>
  <div class="container">
    <div class="header">
      <h3 class="text-muted">MyIona # 项目说明</h3>
    </div>

    <div class="row">
      <div class="span10">
        <div class="ads"></div>
        <br />
        <h4>序言</h4>
        <p></p>
        <ul>
          <li>MyIona是我的一个练习SpringBootWeb开源项目，也是一个为了展示我已有能力(不包括潜力)的项目,主体功能为一个简单的微博系统，代码实现较为粗糙，谨慎借鉴，若出现问题，请后果自负</li>
        </ul>
        <p></p>
        <br />
        <h4>包含的技术栈</h4>
        <p></p>
        <ul>
          <li>Vue@2.6.10</li>
          <li>iView@3.4.2(后续想重构下，用element, iview坑较多)</li>
          <li>SpringBoot@2.1.6</li>
          <li>MyBatis@3.5.2</li>
          <li>Ehcache@3.6.3</li>
          <li>Redis@5.0.5</li>
          <li>消息队列(自我实现,较简单,用于加快服务端响应,将一些复杂且可以延后执行的操作丢进消息队列中异步执行)</li>
          <li>Websocket</li>
          <li>MySQL Community Server@8.0.17</li>
        </ul>
        <p></p>
        <br />
        <h4>包含的模块</h4>
        <p></p>
        <ul>
          <li>登录/注册/用户管理</li>
          <li>会话管理</li>
          <li>简易微博系统，可以发微博，转发，评论，点赞, 浏览数等等</li>
          <li>实时通知系统</li>
          <li>在线聊天室</li>
        </ul>
        <p></p>
        <br />
        <h4>开发环境</h4>
        <p></p>
        <ul>
          <li>OS: ubuntu18.04</li>
          <li>浏览器: chrome 75.0.3770.142</li>
        </ul>
        <p></p>
        <br />
        <h4>项目文件结构图</h4>
        <img src="../../assets/images/project_tree.png" />
        <br />
        <br />
        <h4>F & Q</h4>
        <p></p>
        <ul>
          <li class="big-li">前端为什么选择VUE</li>
          <br />
          <li>1. 可以帮助我快速构建一个不算太丑的前端系统</li>
          <li>2. 有现成的cli工具，有丰富的生态圈，有成熟的模块管理工具，有众多优秀的基于vue的开源组件框架，助我少走一些弯路</li>
          <li>3. 作者是国人，有亲切感，开发文档易上手</li>
          <li>4. 虚拟dom以及diff算法，性能不会太低</li>
          <br />
          <li class="big-li">在本项目VUE开发过程中你遇到了哪些印象深刻的问题</li>
          <br />
          <li>1. 使用js操作cookie存取token的path问题，从而导致会话管理异常，<a target="_blank" href="https://zazalu.space/2019/07/13/javascript-setCookie-path/">详细见此博文</a></li>
          <li>2. 前后端分离不可避免带来的跨域问题，<a target="_blank" href="https://zazalu.space/2019/06/30/CORS-question-and-curl-use-in-web-test/">详细见此博文</a></li>
          <li>3. 使用第三方依赖框架导致的一个v-for不更新dom的问题（也是我想后续转为使用element的原因之一），<a target="_blank" href="https://www.v2ex.com/t/590284#reply121">详细见此v站贴</a></li>
        </ul>
        <p></p>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  computed: {},
  components: {},
  methods: {}
};
</script>