
import request from '@/utils/request'
// 检查是否是好友
export function checkIsFriends(data) {
  return request({
    url: '/friendly/checkIsFriends',
    method: 'post',
    data
  })
}
// 获取好友列表
export function findMyFriendsList(data) {
  return request({
    url: '/friendly/findMyFriendsList',
    method: 'post',
    data
  })
}
// 删除好友
export function deleteFriend(data) {
  return request({
    url: '/friendly/deleteFriend',
    method: 'post',
    data
  })
}