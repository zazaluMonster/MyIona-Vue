<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style lang="less">
// less是css的一个扩充，可以让我们css写起来更简单
.size {
  width: 100%;
  height: 100%;
}
html,
body {
  .size;
  overflow: hidden;
  margin: 0;
  padding: 0;
}
#app {
  .size;
  overflow-x: auto;
  overflow-y: auto;
  white-space: nowrap;//强制div内的元素不随窗口缩小而换行
}
.card {
  margin-bottom: 20px;
}
.IonaContent {
  position: relative;
  padding: 24px;
  min-height: 454px;
  background: #fff;
}
ul li {
  list-style: none;
}
.iMessageAvatar {
  width: 100%;
  height: 100%;
  border-radius: 9999px;
}
// 富文本
.w-e-text {
  padding: 0 10px !important;
  overflow-y: auto !important;
}
.w-e-icon-happy {
  font-size: 20px !important;
  overflow-wrap: break-word !important;
  color: black !important;
}
.w-e-text p {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Ubuntu, "Helvetica Neue", sans-serif !important;
  font-size: 20px !important;
  overflow-wrap: break-word !important;
  color: black !important;
}
.w-e-text p > span {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Ubuntu, "Helvetica Neue", sans-serif !important;
  font-size: 20px !important;
  overflow-wrap: break-word !important;
  color: black !important;
}
.w-e-text span {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Ubuntu, "Helvetica Neue", sans-serif !important; 
  font-size: 20px !important;
  overflow-wrap: break-word !important;
  color: black !important;
}

</style>
