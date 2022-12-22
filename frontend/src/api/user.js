import http from '@/utils/http'
// 注册 | POST
export function register(data) {
  return http.post(`/user/register`, data)
}
// 登录 | POST
export function login(data) {
  return http.post(`/user/login`, data)
}
// 发送短信验证码 | POST
export function sendSMSCode(mobilePhone) {
  return http.post(`/user/sendSMSCode`, mobilePhone)
}
// 发送图形验证码 | GET
export function sendPicCode() {
  return http({
    url: '/user/sendPicCode',
    method: 'get',
    params: { mt: Math.random() },
    responseType: ''
  })
}
// 获取用户个人信息
export function getUserInfo() {
  return http.get(`/user/getUserInfo`)
}
// 获取官方账号信息
export function getOfficialInfo() {
  return http.get(`/user/getOfficialInfo`)
}
// 预览账号信息
export function previewUser(params) {
  return http({
    url: '/user/previewUser',
    method: 'get',
    params
  })
  // return http.post(`/user/previewUser`, data)
}
// 更新用户信息 | POST
export function updateUserInfo(data) {
  return http.put(`/user/updateUserInfo`, data)
}
// 搜索用户
export function addFriends(params) {
  return http({
    url: `/user/searchFriends`,
    method: 'get',
    params
  })
  // return http.post(`/user/searchFriends`, data)
}
// 添加至用户会话列表
export function addConversationList(data) {
  return http.post(`/user/addConversationList`, data)
}
// 更新用户手机号码
export function updatedUserPhone(data) {
  return http.put(`/user/updatedUserPhone`, data)
}
// 更新用户密码
export function updatedUserPassword(data) {
  return http.put(`/user/updatedUserPassword`, data)
}
// 修改好友备注
export function modifyFriendRemark(data) {
  return http.put(`/user/modifyFriendRemark`, data)
}
// 更新用户会话列表
export function updateUserConversations(data) {
  return http.put(`/user/updateUserConversations`, data)
}
// 删除用户会话列表的某个对话
export function deleteDialog(data) {
  return http.post(`/user/deleteDialog`, data)
}
