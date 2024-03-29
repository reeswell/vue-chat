/**
 * axios封装
 * 请求拦截、响应拦截、错误统一处理
 */
import axios from 'axios'
import { Toast } from 'vant'
import { tokenCache, userInfoCache, sysInfoCache, conversationsListCache, sysNewsListCache } from '@/utils/cache'
/**
 * 提示函数
 * 禁止点击蒙层、显示一秒后关闭
 */

const tip = (msg, type = '') => {
  if (type === 'success') {
    return Toast({
      type: 'success',
      message: msg,
      duration: 1000,
      forbidClick: true
    })
  }
  Toast({
    type: 'fail',
    message: msg,
    duration: 1000,
    forbidClick: true
  })
}

/**
 * 跳转登录页
 * 携带当前页面路由，以期在登录页面完成登录后返回当前页面
 */
const toLogin = () => {
  window.location.href = '/#/login'
}

/**
 * 请求失败后的错误统一处理
 * @param {Number} status 请求失败的状态码
 */
const errorHandle = (status, other) => {
  // 状态码判断
  switch (status) {
    case 401:
      tip('登录过期，请重新登录')
      tokenCache.deleteCache()
      userInfoCache.deleteCache()
      sysInfoCache.deleteCache()
      conversationsListCache.deleteCache()
      sysNewsListCache.deleteCache()
      setTimeout(() => {
        toLogin()
      }, 1000)
      break
    case 500:
      tip('服务器错误')
      break
    default:
      console.error(other)
  }
}

// 创建axios实例
const instance = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  timeout: 1000 * 12,
  withCredentials: true
})
// 设置post请求头
// instance.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
/**
 * 请求拦截器
 * 每次请求前，如果存在token则在请求头中携带token
 */
instance.interceptors.request.use(
  config => {
    // 登录流程控制中，根据本地是否存在token判断用户的登录情况
    // 但是即使token存在，也有可能token是过期的，所以在每次的请求头中携带token
    // 后台根据携带的token判断用户的登录情况，并返回给我们对应的状态码
    // 而后我们可以在响应拦截器中，根据状态码进行一些统一的操作。
    const token = tokenCache.getCache()
    // console.log(token);
    // token && (config.headers.Authorization = token);
    token && (config.headers['Authorization'] = `Bearer ${token}`)
    return config
  },
  error => Promise.error(error)
)

// 响应拦截器
instance.interceptors.response.use(
  response => {
    if (response.status === 200) {
      // 你只需改动的是这个 succeeCode ，因为每个项目的后台返回的code码各不相同

      if (response.data.code === 200) {
        return response.data
      } else {
        tip(response.data.msg)
        return Promise.reject(response)
      }
    } else {
      return Promise.reject(response)
    }
  },
  // 请求失败
  error => {
    const { response } = error
    if (response) {
      // 请求已发出，但是不在2xx的范围
      errorHandle(response.status, response.data.message)
      return Promise.reject(response)
    } else {
      // 处理断网的情况
      // eg:请求超时或断网时，更新state的network状态
      // network状态在app.vue中控制着一个全局的断网提示组件的显示隐藏
      // 关于断网组件中的刷新重新获取数据，会在断网组件中说明
      if (!window.navigator.onLine) {
        tip('你的网络已断开，请检查网络')
      } else {
        return Promise.reject(error)
      }
    }
  }
)

export default instance
