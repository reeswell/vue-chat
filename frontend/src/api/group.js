import http from '@/utils/http'

export function createGroup(data) {
  // 新建群
  return http.post(`/group/createGroup`, data)
}
export function findMyGroupList(data) {
  // 获取我的群
  return http.post(`/group/getMyGroup`, data)
}
export function getGroupUsers(data) {
  return http.post(`/group/getGroupUsers`, data)
}
export function huntGroups(data) {
  return http.post(`/group/huntGroups`, data)
}
export function getGroupInfo(data) {
  return http.post(`/group/getGroupInfo`, data)
}
export function quitGroup(data) {
  return http.post(`/group/quitGroup`, data)
}

