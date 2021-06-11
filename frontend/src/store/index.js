import {createStore} from 'vuex'
import * as types from './types'
import {
  tokenCache,
  userInfoCache,
  sysInfoCache,
  conversationsListCache,
  allChatListCache,
  sysNewsListCache,
  friendsListCache,
  groupsListCache
} from '@/utils/cache'
import api from '@/api/index'

export default createStore({
  state: {
    token: tokenCache.getCache(), // 用户 token
    userInfo: userInfoCache.getCache(), // 用户 信息
    loginStatus: tokenCache.getCache() ? true : false,
    unRead: [],
    sysInfo: sysInfoCache.getCache(),
    friendsInfo: {},
    groupInfo: {},
    conversationsList: conversationsListCache.getCache(), // 会话列表,
    curConversations: conversationsListCache.getCache()[0] || {}, //当前会话
    OnlineUser: {}, // 在线人数
    sysNewsList: sysNewsListCache.getCache() || [], // 官方通知列表
    friendsList: friendsListCache.getCache() || [],
    groupsList: groupsListCache.getCache() || [],
    allChatList: allChatListCache.getCache() || []
  },
  getters: {
    getSysUnRead(state) {
      // let count = 0
      const roomId = state.sysInfo.id
      const result = state.unRead.filter(item => item.roomId === roomId)
      return result
    },
    getSysUnReadCount(state) {
      let count
      const roomId = state.sysInfo.id
      const result = state.unRead.filter(item => item.roomId === roomId)
      if (result.length && result[0].count > 0) {
        count = result[0].count
        return count
      } else {
        return null
      }
    },
    getConversationsList(state) {
      // const roomId = state.sysInfo.id
      const result = state.conversationsList.filter(item => item.userName !== 'vueChat')
      return result
    },
    getAllChatListUnread(state) {
      const result = state.unRead.filter(item => item.roomId !== state.sysInfo.id)
      let count = 0
      if (result.length) {
        result.forEach(item => {
          count += item.count
        })
      }
      return count
    },
    getAllChatList(state) {
      return state.allChatList
    },
    getAllChatListRoomId(state) {
      const RoomArr = []
      state.allChatList.map(item => {
        RoomArr.push(item.id)
      })
      return RoomArr
    },
    getGroupUnread(state) {
      let count = 0
      state.unRead.forEach(item => {
        if (!item.roomId.split('-').length > 1) {
          count++
        }
      })
      return count
    },
    getFriendList(state) {
      const arr = state.allChatList.filter(item => item.type === 'friend')
      return arr
    },
    getGroupList(state) {
      const arr = state.allChatList.filter(item => item.type === 'group' || item.type === 'channel')
      return arr
    }
  },
  mutations: {
    [types.TOKEN](state, userToken) {
      state.token = userToken

      tokenCache.setCache(userToken)
    },
    [types.USER_INFO](state, info) {
      state.userInfo = info
      userInfoCache.setCache(info)
    },
    [types.SYS_INFO](state, info) {
      state.sysInfo = info
      sysInfoCache.setCache(info)
    },
    [types.LOGIN_STATUS](state, bool) {
      state.loginStatus = bool
    },
    [types.FRIENDS_INFO](state, info) {
      state.friendsInfo = info
    },
    [types.GROUP_INFO](state, info) {
      state.groupInfo = info
    },
    [types.ONLINE_USER](state, data) {
      state.OnlineUser = data
    },

    [types.CONVERSATIONS_LIST](state, data) {
      if (Array.isArray(data)) {
        state.conversationsList = data
        conversationsListCache.setCache(data)
      } else {
        const arr = state.conversationsList.filter(item => item.id === data.id)
        if (!arr.length) {
          // 添加
          state.conversationsList.unshift(data)
          conversationsListCache.setCache(state.conversationsList)
        }
      }
      state.allChatList = state.conversationsList.filter(item => item.userName !== 'vueChat' && item.type !== 'me')
      allChatListCache.setCache(state.allChatList)
    },

    [types.FRIENDS_LIST](state, data) {
      state.friendsList = data
      friendsListCache.setCache(data)
    },
    [types.GROUPS_LIST](state, data) {
      state.groupsList = data
      groupsListCache.setCache(data)
    },
    [types.SYS_NEWS_LIST](state, data) {
      state.sysNewsList = data
      sysNewsListCache.setCache(state.sysNewsList)
    },
    updateSysNewsList(state, data) {
      state.sysNewsList.forEach(item => {
        if (item.friendRoom === data.friendRoom) {
          item.status = data.status
        }
      })
    },
    setUnRead(state, data) {
      if (data.clear) {
        state.unRead.forEach(item => {
          if (item.roomId === data.roomId) {
            item.count = 0
          }
        })
        return
      }
      const unRead = state.unRead.filter(item => item.roomId === data.roomId)
      if (unRead.length) {
        state.unRead.forEach(item => {
          if (item.roomId === data.roomId) {
            if (data.add) {
              item.count++
            } else {
              item.count = data.count
            }
          }
        })
      } else {
        state.unRead.push({roomId: data.roomId, count: data.count})
      }
    },
    updateAllChatList(state, data) {
      state.allChatList.forEach((v, i) => {
        if (v.id === data.roomId) {
          state.allChatList[i] = Object.assign({}, v, {
            unread: 0,
            newMes: data.mes,
            newMesTime: data.time.split(' ')[1]
          })
        }
      })
      allChatListCache.setCache(state.allChatList)
    }
  },
  actions: {
    // 设置用户 token
    setUserToken({commit}, userToken) {
      commit(types.TOKEN, userToken)
      commit(types.LOGIN_STATUS, true)
    },
    // 删除用户 token
    deleteUserToken({commit}) {
      commit(types.LOGIN_STATUS, false) // 登录状态改为 false
      tokenCache.deleteCache()
    },
    // 设置个人信息
    setUserInfo({commit}, info) {
      commit(types.USER_INFO, info)
    },

    setFriendsInfo({commit}, info) {
      commit(types.FRIENDS_INFO, info)
    },
    setGroupInfo({commit}, info) {
      commit(types.GROUP_INFO, info)
    },
    setConversationsList({commit}, data) {
      commit(types.CONVERSATIONS_LIST, data)
    },
    async getUserInfo({commit, dispatch}) {
      try {
        const {code, data} = await api.getUserInfo()
        if (code !== 200) return
        commit(types.USER_INFO, data)
        commit(types.CONVERSATIONS_LIST, data.conversationsList)
        dispatch('getSysInfo')
      } catch (error) {
        console.log(error)
      }
    },
    async getMyContactList({state, dispatch}) {
      try {
        const friendObj = {userId: state.userInfo.id}
        const groupObj = {userName: state.userInfo.userName}
        const {data} = await api.findMyFriendsList(friendObj)
        const res = await api.findMyGroupList(groupObj)
        if (data.length) {
          dispatch('setFriendsList', data)
        }
        if (res.length) {
          dispatch('setGroupsList', res.data)
        }
      } catch (error) {
        console.log(error)
      }
    },
    async getSysInfo({commit, state}) {
      try {
        const {code, data} = await api.getOfficialInfo()
        if (code !== 200) return
        const id = state.userInfo.id + '-' + data.id
        state.sysInfo = Object.assign({}, data, {type: 'sysInfo'}, {id})
        commit(types.SYS_INFO, state.sysInfo)
        commit(types.CONVERSATIONS_LIST, state.sysInfo)
      } catch (error) {
        console.log(error)
      }
    },

    setOnlineUser({commit}, data) {
      commit(types.ONLINE_USER, data)
    },

    setSysNewsList({commit}, data) {
      commit(types.SYS_NEWS_LIST, data)
    },
    setFriendsList({commit}, data) {
      commit(types.FRIENDS_LIST, data)
    },
    setGroupsList({commit}, data) {
      commit(types.GROUPS_LIST, data)
    },
    // 退出登录
    logOut({commit}) {
      // 退出登录
      return new Promise((resolve, reject) => {
        commit(types.LOGIN_STATUS, false) // 登录状态改为 false// 清除 token
        tokenCache.deleteCache()
        userInfoCache.deleteCache()
        sysInfoCache.deleteCache()
        conversationsListCache.deleteCache()
        sysNewsListCache.deleteCache()
        resolve()
      })
    }
  },
  modules: {
    // user
  }
})
