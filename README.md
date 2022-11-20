# 前言
该项目是我的毕业设计。
主要技术栈为Vue3+MongoDB+Koa2。
该项目代码不再维护，欢迎关注我的新项目[story](https://github.com/xxydrr/story)

- [开源地址](https://github.com/xxydrr/vue3-chat)
- [vue2版本](https://github.com/xxydrr/vue3-chat/tree/vue2)

### 技术栈

Vue3全家桶+MongoDB+Koa2+socket.io+vant 3+ES6/7

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

-  登录/注册/登出
-  消息类型（文本/表情/图片/文件）
-  好友（添加/删除/修改备注/模糊搜索好友）
-  群组（普通群/广播群）/创建群/加入群/退群/模糊搜索添加的群
-  未读消息统计/标为已读
-  分组（未读/群组会话分组）
-  添加好友/加群校验
-  设置修改个人信息（密码/头像/年龄/手机号码/性别/邮箱/城市/昵称）
-  查看好友/群组信息
-  持续完善...

### 项目截图

[![img](https://camo.githubusercontent.com/3342c0573ddaa3bf466e29415ee025c30adab987f6f3d589ef436324e8390803/68747470733a2f2f63646e2e6a7364656c6976722e6e65742f67682f7878796472722f6d795f7069632f696d672f32303231303530353133343630312e706e67)](https://camo.githubusercontent.com/3342c0573ddaa3bf466e29415ee025c30adab987f6f3d589ef436324e8390803/68747470733a2f2f63646e2e6a7364656c6976722e6e65742f67682f7878796472722f6d795f7069632f696d672f32303231303530353133343630312e706e67)[![img](https://camo.githubusercontent.com/77a92d724b7fc41d7cb0efb0c0bab5be537e19f63b3c93296dbde2731eb8549e/68747470733a2f2f63646e2e6a7364656c6976722e6e65742f67682f7878796472722f6d795f7069632f696d672f32303231303530353133343631352e706e67)](https://camo.githubusercontent.com/77a92d724b7fc41d7cb0efb0c0bab5be537e19f63b3c93296dbde2731eb8549e/68747470733a2f2f63646e2e6a7364656c6976722e6e65742f67682f7878796472722f6d795f7069632f696d672f32303231303530353133343631352e706e67)

[![img](https://camo.githubusercontent.com/a34e640fc4264d324f30394e059717601fa2ff1b22f1f781d7f42731a3b4b586/68747470733a2f2f63646e2e6a7364656c6976722e6e65742f67682f7878796472722f6d795f7069632f696d672f32303231303530353133343630332e706e67)](https://camo.githubusercontent.com/a34e640fc4264d324f30394e059717601fa2ff1b22f1f781d7f42731a3b4b586/68747470733a2f2f63646e2e6a7364656c6976722e6e65742f67682f7878796472722f6d795f7069632f696d672f32303231303530353133343630332e706e67)[![img](https://camo.githubusercontent.com/e8a2a0b91eb47b9e87ba75091ed7dbd00efb9ea670abffe1b41389054bd1aae6/68747470733a2f2f63646e2e6a7364656c6976722e6e65742f67682f7878796472722f6d795f7069632f696d672f32303231303530353133343630322e706e67)](https://camo.githubusercontent.com/e8a2a0b91eb47b9e87ba75091ed7dbd00efb9ea670abffe1b41389054bd1aae6/68747470733a2f2f63646e2e6a7364656c6976722e6e65742f67682f7878796472722f6d795f7069632f696d672f32303231303530353133343630322e706e67)

[![img](https://camo.githubusercontent.com/4195eb1410798b0612daec35de73befc3015d4529a097844562dcef71f58fd67/68747470733a2f2f63646e2e6a7364656c6976722e6e65742f67682f7878796472722f6d795f7069632f696d672f32303231303530353133343631372e706e67)](https://camo.githubusercontent.com/4195eb1410798b0612daec35de73befc3015d4529a097844562dcef71f58fd67/68747470733a2f2f63646e2e6a7364656c6976722e6e65742f67682f7878796472722f6d795f7069632f696d672f32303231303530353133343631372e706e67)[![img](https://camo.githubusercontent.com/c614a937581f9e8898395e335a83835a58018c254ffa087c58659cca578e36b2/68747470733a2f2f63646e2e6a7364656c6976722e6e65742f67682f7878796472722f6d795f7069632f696d672f32303231303530353133343630342e706e67)](https://camo.githubusercontent.com/c614a937581f9e8898395e335a83835a58018c254ffa087c58659cca578e36b2/68747470733a2f2f63646e2e6a7364656c6976722e6e65742f67682f7878796472722f6d795f7069632f696d672f32303231303530353133343630342e706e67)

### 项目功能扩展想法

- 主题皮肤设置
- better scroll + 分页查询
- 我的页面加入游戏功能
- 我的页面加入stories功能
- 视频语音webRTC（暂时没有思路）

### 说明

======= 欢迎有对项目有扩展想法的伙伴能参与到这个项目来❤️❤️❤️

如果项目对您有帮助，希望您能 "Star" 支持一下 感谢！🌹🌹🌹🌹🌹🌹

我的vue2 + vuex 聊天系统入门项目。[地址](https://github.com/xxydrr/vue-telegram)

### 参考资料

- [MongoDB](https://docs.mongodb.com/manual/reference/)
- [Mongoose](https://mongoosejs.com/docs/guide.html)
- [vue-telegram](https://github.com/xxydrr/vue-telegram)
- [socket.io](https://www.w3cschool.cn/socket/socket-buvk2eib.html)
- [Vchat](https://github.com/wuyawei/Vchat)

# License

# [MIT](https://github.com/xxydrr/vue-koa-vue/blob/main/LICENSE)
