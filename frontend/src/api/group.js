import http from '@/utils/http'

export function createGroup(data) {
  // 新建群
  return http.post(`/group/createGroup`, data)
}
export function findMyGroupList(params) {
  // 获取我的群
  // return http.post(`/group/getMyGroup`, data)
  return http({
    url: `/group/getMyGroup`,
    method: 'get',
    params
  })
}
export function getGroupUsers(params) {
  return http({
    url: `/group/getGroupUsers`,
    method: 'get',
    params
  })
  // return http.post(`/group/getGroupUsers`, data)
}
export function huntGroups(params) {
  return http({
    url: `/group/huntGroups`,
    method: 'get',
    params
  })
  // return http.post(`/group/huntGroups`, data)
}
export function getGroupInfo(params) {
  return http({
    url: `/group/getGroupInfo`,
    method: 'get',
    params
  })
  // return http.post(`/group/getGroupInfo`, data)
}
export function quitGroup(data) {
  return http.post(`/group/quitGroup`, data)
}

