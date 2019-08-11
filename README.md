# myionavue
myionavue项目的前端，负责myionavue的前端页面实现

## 开始使用

1. 使用`git clone`或者下载zip包来先将项目全部内容拷贝至本地
2. 在项目根目录下执行`npm install`，来加载本项目用到的node模块

### 单独运行我们的myionavue（说的帅气的点有点像离线模式）

1. 找到properties.js，修改内部的`DEBUG`常量为true，将会开始myionavue的离线模式，该模式下可以使用任意账号密码进行登录，来简单的审阅我们的前端页面

2. 执行以下命令
```
npm run serve
```
它会进行"编译"，然后打开一个node服务器来运行我们的myionavue，默认监听端口是8089，你可以在`package.json`中修改端口，如下
```
  "scripts": {
    "serve": "vue-cli-service serve --port 8089",  //修改你喜欢的端口
```

3. 一切正常的话，你系统的默认浏览器会被打开并展示myionavue的登录页面

### 导出dist文件夹

执行指令
```
npm run build
```

随后你便可以看到一个dist文件夹已经生成，将它们整合到你的Web项目中去吧！

## 项目架构

### 使用的技术栈

### 文件目录结构

### 状态管理

所有的常量properties和常用工具函数BaseUtil都通过`boot.js`注册在Node的全局对象`global`中

1. `global.$prop`访问全部properties
2. `global.$util`访问常用工具(部分特定的工具，比如HttpUtil，使用import来导入使用，请不要挂载在global中)

暂时本项目未使用vuex，因为我不需要对全局状态做修改，我只是单纯的读取

## 项目目标

1. 登录/注册 一个完整的会话管理(已完成)