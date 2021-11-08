import request from '@/utils/request'
// 注册
export function register(data) {
  return request({
    url: '/user/register',
    method: 'post',
    data
  })
}
// 登录
export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}
// 发送短信验证码
export function sendSMSCode(data) {
  return request({
    url: '/user/sendSMSCode',
    method: 'post',
    data
  })
}
// 发送图形验证码
export function sendPicCode() {
  return request({
    url: `/user/sendPicCode?mt=${Math.random()}`,
    method: 'get'
  })
}
// 获取用户个人信息
export function getUserInfo() {
  return request({
    url: '/user/getUserInfo',
    method: 'get'
  })
}
// 获取官方账号信息
export function getOfficialInfo() {
  return request({
    url: '/user/getOfficialInfo',
    method: 'get'
  })
}

// 预览账号信息
export function previewUser(data) {
  return request({
    url: '/user/previewUser',
    method: 'post',
    data
  })
}
// 更新用户信息
export function updateUserInfo(data) {
  return request({
    url: '/user/updateUserInfo',
    method: 'post',
    data
  })
}
// 搜索用户
export function addFriends(data) {
  return request({
    url: '/user/searchFriends',
    method: 'post',
    data
  })
}
// 添加至用户会话列表
export function addConversationList(data) {
  return request({
    url: `/user/addConversationList`,
    method: 'post',
    data
  })
}
// 更新用户手机号码
export function updatedUserPhone(data) {
  return request({
    url: '/user/updatedUserPhone',
    method: 'post',
    data
  })
}
// 更新用户密码
export function updatedUserPassword(data) {
  return request({
    url: '/user/updatedUserPassword',
    method: 'post',
    data
  })
}
// 修改好友备注

export function modifyFriendRemark(data) {
  return request({
    url: '/user/modifyFriendRemark',
    method: 'post',
    data
  })
}
// 更新用户会话列表
export function updateUserConversations(data) {
  return request({
    url: '/user/updateUserConversations',
    method: 'post',
    data
  })
}
// 删除用户会话列表的某个对话
export function deleteDialog(data) {
  return request({
    url: '/user/deleteDialog',
    method: 'post',
    data
  })
}
