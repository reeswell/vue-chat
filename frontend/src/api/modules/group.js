import http from '@/utils/http'
import url from './url'
const group = {
  createGroup(data) {
    //新建群
    return http.post(`${url.group}/createGroup`, data)
  },
  findMyGroupList(data) {
    //获取我的群
    return http.post(`${url.group}/getMyGroup`, data)
  },
  getGroupUsers(data) {
    return http.post(`${url.group}/getGroupUsers`, data)
  },
  huntGroups(data) {
    return http.post(`${url.group}/huntGroups`, data)
  },
  getGroupInfo(data) {
    return http.post(`${url.group}/getGroupInfo`, data)
  },
  quitGroup(data) {
    return http.post(`${url.group}/quitGroup`, data)
  }
}

export default group
