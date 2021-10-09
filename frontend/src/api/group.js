import request from '@/utils/request'
//新建群
export function createGroup(data) {
  return request({
    url: '/group/createGroup',
    method: 'post',
    data
  })
}
//获取我的群
export function findMyGroupList(data) {
  return request({
    url: '/group/getMyGroup',
    method: 'post',
    data
  })
}
// 获取群的用户
export function getGroupUsers(data) {
  return request({
    url: '/group/getGroupUsers',
    method: 'post',
    data
  })
}
// 查找群
export function huntGroups(data) {
  return request({
    url: '/group/huntGroups',
    method: 'post',
    data
  })
}
// 获取群的信息
export function getGroupInfo(data) {
  return request({
    url: '/group/getGroupInfo',
    method: 'post',
    data
  })
}
// 退群
export function quitGroup(data) {
  return request({
    url: '/group/quitGroup',
    method: 'post',
    data
  })
}
