import http from '@/utils/http'

export function checkIsFriends(data) {
  return http.post(`/friendly/checkIsFriends`, data)
}
export function findMyFriendsList(params) {
  return http({
    url: `/friendly/findMyFriendsList`,
    method: 'get',
    params
  })
  // return http.post(`/friendly/findMyFriendsList`, data)
}
export function deleteFriend(data) {
  return http.post(`/friendly/deleteFriend`, data)
}
