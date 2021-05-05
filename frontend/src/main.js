import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import api from './api/index' // 导入ajax接口
import Vant from 'vant'
import VueSocketIO from 'vue-socket.io'
import ClientSocketIO from 'socket.io-client'
// import {
//   Form,
//   Lazyload,
//   Toast,
//   Button,
//   Icon,
//   Cell,
//   Popup,
//   NavBar,
//   Search,
//   Sticky,
//   Tab,
//   Tabs,
//   SwipeCell,
//   PullRefresh,
//   Image as VanImage,
//   Overlay
// { RadioGroup, Radio }
// } from 'vant'
import {Lazyload} from 'vant'
import 'vant/lib/index.css'
import '@/assets/css/reset.css'
// import '@/assets/scss/base.scss'
import '@/assets/css/icon.css'
import '@/assets/scss/my-vant.scss'
Vue.use(Lazyload)
// Field PullRefresh Notify Style Image 图片 Layout 布局 Uploader 文件上传
// Vue.use(Form)
//   .use(Lazyload)
//   .use(Toast)
//   .use(Button)
//   .use(Icon)
//   .use(Cell)
//   .use(Popup)
//   .use(NavBar)
//   .use(Search)
//   .use(Sticky)
//   .use(Tab)
//   .use(Tabs)
//   .use(SwipeCell)
//   .use(PullRefresh)
//   .use(VanImage)
//   .use(Overlay)
Vue.use(Vant)

Vue.use(
  new VueSocketIO({
    debug: true,
    // 服务器端地址
    connection: ClientSocketIO.connect('http://localhost:3000/', {
      // autoConnect: false, // 关闭自动连接
      transports: ['websocket']
    }),
    vuex: {}
  })
)
Vue.use(Lazyload, {
  preLoad: 1, // proportion of pre-loading height, 个人理解是图片加载前目标元素位置范围
  error: require('./assets/imgs/error-img.png'),
  loading: require('./assets/imgs/error-img.png'),
  attempt: 3 // 下载图片时错误重连次数
})

Vue.prototype.$api = api // 将ajax挂载到vue的原型上
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
