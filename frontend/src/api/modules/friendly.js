import http from '@/utils/http'
import url from './url'

const friendly = {
  checkIsFriends(data) {
    return http.post(`${url.friendly}/checkIsFriends`, data)
  },
  findMyFriendsList(data) {
    return http.post(`${url.friendly}/findMyFriendsList`, data)
  },
  deleteFriend(data) {
    return http.post(`${url.friendly}/deleteFriend`, data)
  }
}

export default friendly
