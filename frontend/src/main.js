import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import api from './api/index' // 导入ajax接口
import {
  Form,
  Lazyload,
  Toast,
  Badge,
  Button,
  Icon,
  Cell,
  Popup,
  NavBar,
  Search,
  Sticky,
  Tab,
  Tabs,
  SwipeCell,
  PullRefresh,
  Image as VanImage,
  Overlay,
  RadioGroup,
  Radio,
  Uploader,
  Area,
  Field,
  ActionSheet,
  Loading
} from 'vant'

import Socketio from '@/plugins/Socket.io'
import 'vant/lib/index.css' // 全局引入样式

import '@/assets/css/icon.css'
import '@/assets/scss/my-vant.scss'

const app = createApp(App) // 创建实例

app.use(Socketio, {
  connection: 'http://localhost:3000/',
  options: {
    transports: ['websocket'],
    debug: true,
    vuex: {}
  }
})

app.config.globalProperties.$api = api // 将ajax挂载到vue的原型上
app.config.productionTip = false

app
  .use(Form)
  .use(Lazyload)
  .use(Toast)
  .use(Badge)
  .use(Button)
  .use(Icon)
  .use(Cell)
  .use(Popup)
  .use(NavBar)
  .use(Search)
  .use(Sticky)
  .use(Tab)
  .use(Tabs)
  .use(SwipeCell)
  .use(PullRefresh)
  .use(VanImage)
  .use(Overlay)
  .use(RadioGroup)
  .use(Radio)
  .use(Uploader)
  .use(Area)
  .use(Field)
  .use(ActionSheet)
  .use(Loading)

app.use(Lazyload, {
  preLoad: 1, // proportion of pre-loading height, 个人理解是图片加载前目标元素位置范围
  error: require('./assets/imgs/error-img.png'),
  loading: require('./assets/imgs/error-img.png'),
  attempt: 3 // 下载图片时错误重连次数
})

app.use(store).use(router).mount('#app')
