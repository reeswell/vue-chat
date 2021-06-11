import http from '@/utils/http'
import url from './url'

const user = {
  // 注册 | POST
  register(data) {
    return http.post(`${url.user}/register`, data)
  },
  // 登录 | POST
  login(data) {
    return http.post(`${url.user}/login`, data)
  },
  // 发送短信验证码 | POST
  sendSMSCode(mobilePhone) {
    return http.post(`${url.user}/sendSMSCode`, mobilePhone)
  },
  // 发送图形验证码 | GET
  sendPicCode() {
    return `${url.user}/sendPicCode?mt=${Math.random()}`
  },
  // 获取用户个人信息
  getUserInfo() {
    return http.get(`${url.user}/getUserInfo`)
  },

  // 获取官方账号信息
  getOfficialInfo() {
    return http.get(`${url.user}/getOfficialInfo`)
  },
  // 预览账号信息
  previewUser(data) {
    return http.post(`${url.user}/previewUser`, data)
  },
  // 更新用户信息 | POST
  updateUserInfo(data) {
    return http.post(`${url.user}/updateUserInfo`, data)
  },
  // 搜索用户
  addFriends(data) {
    return http.post(`${url.user}/searchFriends`, data)
  },
  // 添加至用户会话列表
  addConversationList(data) {
    return http.post(`${url.user}/addConversationList`, data)
  },
  // 更新用户手机号码
  updatedUserPhone(data) {
    return http.post(`${url.user}/updatedUserPhone`, data)
  },
  // 更新用户密码
  updatedUserPassword(data) {
    return http.post(`${url.user}/updatedUserPassword`, data)
  },
  // 修改好友备注
  modifyFriendRemark(data) {
    return http.post(`${url.user}/modifyFriendRemark`, data)
  },
  // 更新用户会话列表
  updateUserConversations(data) {
    return http.post(`${url.user}/updateUserConversations`, data)
  },
  // 删除用户会话列表的某个对话
  deleteDialog(data) {
    return http.post(`${url.user}/deleteDialog`, data)
  }
}
export default user
