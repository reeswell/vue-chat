# 前言


继上个纯前端模仿telegram聊天系统后我决定加上后端功能，这次考虑使用更加简洁界面和更加优雅的实现把UI界面也重构了。主要技术栈为Vue2+MongoDB+Koa2。考虑到前端技术的发展飞快，我也考虑用Vue3重构完成。希望更多小伙伴能参与到这个项目中来！
vue2版本
- [vue3版本](https://github.com/xxydrr/vue3-chat)

### 技术栈

Vue2全家桶+MongoDB+Koa2+socket.io+vant 2+ES6/7

### 项目启动

[演示视频](https://www.bilibili.com/video/BV1bp4y147S5/)

启动环境：node、mongodb

```
git clone https://github.com/xxydrr/vue-koa-chat 

cd backend
npm install //安装后端依赖
mongod  //启动数据库
npm run init  //初始化一个系统账号
npm run dev   //启动服务器
cd ../
cd frontend   
npm run serve 
```

### 

### 实现功能

- [x] 登录/注册/登出
- [x] 消息类型（文本/表情/图片/文件）
- [x] 好友（添加/删除/修改备注/模糊搜索好友）
- [x] 群组（普通群/广播群）/创建群/加入群/退群/模糊搜索添加的群
- [x] 未读消息统计/标为已读
- [x] 分组（未读/群组会话分组）
- [x] 添加好友/加群校验
- [x] 设置修改个人信息（密码/头像/年龄/手机号码/性别/邮箱/城市/昵称）
- [x] 查看好友/群组信息
- [ ] 持续完善...



### 项目截图

![](https://cdn.jsdelivr.net/gh/xxydrr/my_pic/img/20210505134601.png)![](https://cdn.jsdelivr.net/gh/xxydrr/my_pic/img/20210505134615.png)



![](https://cdn.jsdelivr.net/gh/xxydrr/my_pic/img/20210505134603.png)![](https://cdn.jsdelivr.net/gh/xxydrr/my_pic/img/20210505134602.png)

![](https://cdn.jsdelivr.net/gh/xxydrr/my_pic/img/20210505134617.png)![](https://cdn.jsdelivr.net/gh/xxydrr/my_pic/img/20210505134604.png)

### 项目功能扩展想法

-  主题皮肤设置
- better scroll + 分页查询
- 我的页面加入游戏功能
- 我的页面加入stories功能
- 视频语音webRTC（暂时没有思路）
### 说明




欢迎有对项目有扩展想法的伙伴能参与到这个项目来❤️❤️❤️

如果项目对您有帮助，您可以 "Star" 支持一下 感谢！🌹🌹🌹

我的vue2 + vuex 聊天系统入门项目。[地址](https://github.com/xxydrr/vue-telegram)
<<<<<<< HEAD

### 参考资料

-  [MongoDB](https://docs.mongodb.com/manual/reference/)
- [Mongoose](https://mongoosejs.com/docs/guide.html)
- [vue-telegram](https://github.com/xxydrr/vue-telegram)
- [socket.io](https://www.w3cschool.cn/socket/socket-buvk2eib.html)
- [Vchat](https://github.com/wuyawei/Vchat)

<<<<<<< HEAD
# License

[MIT](https://github.com/xxydrr/vue-koa-vue/blob/main/LICENSE)

