const storage = window.localStorage

const USER_TOKEN = 'user_token' // token key
const USER_INFO = 'user_info' // token key
const SYS_INFO = 'sys_info'
const CONVERSATIONS_LIST = 'conversations_list'
const SYS_NEWS_LIST = 'sysNewsList'
const FRIENDS_LIST = 'friendsList'
const GROUPS_LIST = 'groupsList'
const ALL_CHAT_LIST = 'allChatList'
/** S
 * token 缓存
 */
const tokenCache = {
  setCache(userToken = '') {
    storage.setItem(USER_TOKEN, JSON.stringify(userToken))
    return userToken
  },
  getCache() {
    return storage.getItem(USER_TOKEN) ? JSON.parse(storage.getItem(USER_TOKEN)) : ''
  },
  deleteCache() {
    storage.removeItem(USER_TOKEN)
    return ''
  }
}
// 个人信息缓存
const userInfoCache = {
  setCache(userInfo = {}) {
    storage.setItem(USER_INFO, JSON.stringify(userInfo))
    return userInfo
  },
  getCache() {
    return storage.getItem(USER_INFO) ? JSON.parse(storage.getItem(USER_INFO)) : {}
  },
  deleteCache() {
    storage.removeItem(USER_INFO)
    return {}
  }
}
// 保存官方账号信息
const sysInfoCache = {
  setCache(sysInfo = {}) {
    storage.setItem(SYS_INFO, JSON.stringify(sysInfo))
    return sysInfo
  },
  getCache() {
    return storage.getItem(SYS_INFO) ? JSON.parse(storage.getItem(SYS_INFO)) : {}
  },
  deleteCache() {
    storage.removeItem(SYS_INFO)
    return {}
  }
}
const conversationsListCache = {
  setCache(conversationsList = []) {
    storage.setItem(CONVERSATIONS_LIST, JSON.stringify(conversationsList))
    return conversationsList
  },
  getCache() {
    return storage.getItem(CONVERSATIONS_LIST) ? JSON.parse(storage.getItem(CONVERSATIONS_LIST)) : []
  },
  deleteCache() {
    storage.removeItem(CONVERSATIONS_LIST)
    return []
  }
}
const sysNewsListCache = {
  setCache(sysNewsList = []) {
    storage.setItem(SYS_NEWS_LIST, JSON.stringify(sysNewsList))
    return sysNewsList
  },
  getCache() {
    return storage.getItem(SYS_NEWS_LIST) ? JSON.parse(storage.getItem(SYS_NEWS_LIST)) : []
  },
  deleteCache() {
    storage.removeItem(SYS_NEWS_LIST)
    return []
  }
}
const friendsListCache = {
  setCache(friendsList = []) {
    storage.setItem(FRIENDS_LIST, JSON.stringify(friendsList))
    return friendsList
  },
  getCache() {
    return storage.getItem(FRIENDS_LIST) ? JSON.parse(storage.getItem(FRIENDS_LIST)) : []
  },
  deleteCache() {
    storage.removeItem(FRIENDS_LIST)
    return []
  }
}
const groupsListCache = {
  setCache(groupsList = []) {
    storage.setItem(GROUPS_LIST, JSON.stringify(groupsList))
    return groupsList
  },
  getCache() {
    return storage.getItem(GROUPS_LIST) ? JSON.parse(storage.getItem(GROUPS_LIST)) : []
  },
  deleteCache() {
    storage.removeItem(GROUPS_LIST)
    return []
  }
}
const allChatListCache = {
  setCache(friendsList = []) {
    storage.setItem(ALL_CHAT_LIST, JSON.stringify(friendsList))
    return friendsList
  },
  getCache() {
    return storage.getItem(ALL_CHAT_LIST) ? JSON.parse(storage.getItem(ALL_CHAT_LIST)) : []
  },
  deleteCache() {
    storage.removeItem(ALL_CHAT_LIST)
    return []
  }
}
export {
  tokenCache, // token 缓存
  userInfoCache,
  sysInfoCache,
  conversationsListCache,
  sysNewsListCache,
  allChatListCache,
  friendsListCache,
  groupsListCache
}
