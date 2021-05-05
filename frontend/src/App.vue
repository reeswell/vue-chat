<template>
  <div id="app">
    <div class="anmimate-box" :class="[isShowNav ? 'add-buttom' : '']">
      <!-- main 内容 -->
      <transition :name="mainName">
        <keep-alive v-if="$route.meta.keepAlive">
          <!-- 这里是会被缓存的视图组件 -->
          <router-view class="view" v-if="$route.meta.keepAlive" />
        </keep-alive>
        <!-- 这里是不被缓存的视图组件 -->
        <router-view v-if="!$route.meta.keepAlive && isRouterAlive" class="view" />
      </transition>

      <!-- 底部导航 -->
      <transition :name="navName">
        <footer-nav v-if="isShowNav" :activeNavIndex="activeNavIndex"></footer-nav>
      </transition>
    </div>
  </div>
</template>

<script>
import FooterNav from '@/components/FooterNav/footerNav'
import {formatTime} from '@/utils/tools'
import {mapState} from 'vuex'

export default {
  name: 'App',
  provide() {
    return {
      reload: this.reload
    }
  },
  components: {FooterNav},
  data() {
    return {
      mainName: '', // 内容区域动画名
      navName: '', // 导航动画名
      isShowNav: false, // 是否显示底部导航 Tab
      activeNavIndex: 0, // 底部导航激活下标
      isRouterAlive: true, // 用于刷新页面用
      navTabs: ['Contact', 'Chat', 'Manager'], // 底部导航
      showButtom: true
      // page: 1
    }
  },

  computed: {
    ...mapState(['userInfo', 'conversationsList', 'sysNewsList', 'allChatList'])
  },
  watch: {
    $route(to, from) {
      const {navTabs} = this.$data
      const toName = to.name
      const fromName = from.name
      // 如果是在 navTab 页面内刷新浏览器，则显示导航栏
      if (navTabs.includes(toName) && !fromName) this.isShowNav = true

      switch (toName) {
        case 'Contact':
          this.activeNavIndex = 0
          break
        case 'Chat':
          this.activeNavIndex = 1
          break
        case 'Manager':
          this.activeNavIndex = 2
          break
      }
      // 如果 to 索引大于 from 索引, 判断为前进状态, 反之则为后退状态  相等底部栏之间的切换
      if (to.meta.tag === 'search' && from.meta.tag === 'chat') {
        this.mainName = 'fade'
        navTabs.includes(fromName) && (this.isShowNav = false)
      } else if (to.meta.tag === 'search' && from.meta.tag === 'contact') {
        this.mainName = 'fade'
        navTabs.includes(fromName) && (this.isShowNav = false)
      } else if (to.meta.index === from.meta.index) {
        this.mainName = 'fade'
      } else if (to.meta.index > from.meta.index) {
        this.mainName = 'slide-left'
        this.navName = 'nav-slide'
        ;(navTabs.includes(fromName) || !navTabs.includes(fromName)) && (this.isShowNav = false)
      } else if (to.meta.index < from.meta.index) {
        this.mainName = 'slide-right'
        this.navName = 'nav-slide'
        navTabs.includes(toName) && (this.isShowNav = true)
      }
    },
    conversationsList: {
      handler() {
        this.joinRoom()
      },
      deep: true,
      immediate: true
    }
  },

  sockets: {
    connect() {
      console.log(this.$socket.id)
      console.log('连接成功')
    },
    customEmit(val) {
      console.log('连接失败')
    },

    joined(OnlineUser) {
      console.log('加入了', OnlineUser)
      this.$store.dispatch('setOnlineUser', OnlineUser)
    },
    leaved(OnlineUser) {
      this.$store.dispatch('setOnlineUser', OnlineUser)
    },
    getHisMeg(mes) {
      // 获取未读消息数量
      const data = mes.filter(item => item.read.indexOf(this.userInfo.userName) === -1)
      if (data.length) {
        this.$store.commit('setUnRead', {roomId: data[0].roomId, count: data.length})
      }
    },
    mes(obj) {
      //更改未读消息数量

      this.$store.commit('setUnRead', {roomId: obj.roomId, add: true, count: 1})
    },
    takeValidate(obj) {
      this.$store.commit('setUnRead', {roomId: obj.roomId, add: true, count: 1})

      if (obj.type === 'info' || obj.type === 'validate') {
        this.$store.dispatch('getUserInfo')
      }
    },

    update(val) {
      this.$store.dispatch('getUserInfo')
    },
    ValidateSuccess(val) {
      this.$store.dispatch('getUserInfo')
    }
  },
  methods: {
    //  用于刷新组件

    reload() {
      this.isRouterAlive = false
      this.$nextTick(() => {
        this.isRouterAlive = true
      })
    },
    joinRoom() {
      const user = this.userInfo
      if (!user.userName) {
        return
      }

      this.conversationsList.forEach(item => {
        const val = {
          userName: user.userName,
          time: formatTime(new Date()),
          avatar: user.avatar,
          roomId: item.id
        }
        const room = {roomId: item.id, offset: 1, limit: 200}

        this.$socket.emit('join', val)
        this.$socket.emit('getHisMeg', room)
      })
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/scss/color.scss';

// 底部导航点进其他页面 导航 tab 动画
.nav-slide-enter,
.nav-slide-leave-to {
  transform: translate3d(0, 100%, 0);
}
.nav-slide-enter-active,
.nav-slide-leave-active {
  transition: all 0.3s;
}

// 底部导航之间相互切换 内容区域动画
.fade-enter {
  opacity: 0;
}
.fade-leave {
  opacity: 1;
}
.fade-enter-active {
  transition: opacity 0.3s;
}
.fade-leave-active {
  opacity: 0;
  transition: opacity 0s;
}

// 后退：左边页面进入的同时，同时右边页面在消失

.slide-right-enter {
  opacity: 0;
  transform: translate3d(-100%, 0, 0);
}
.slide-right-leave-active {
  opacity: 0;
  transform: translate3d(100%, 0, 0);
}
// 前进：右边页面进入的同时，同时左边页面在消失

.slide-left-enter {
  opacity: 0;
  transform: translate3d(100%, 0, 0);
}
.slide-left-leave-active {
  opacity: 0;
  transform: translate3d(-100%, 0, 0);
}

.slide-right-enter-active,
.slide-right-leave-active,
.slide-left-enter-active,
.slide-left-leave-active {
  height: 100%;
  will-change: transform;
  transition: all 0.3s;
  position: absolute;
  backface-visibility: hidden;
}

#app {
  width: 100%;
  height: 100%;
  .anmimate-box {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    overflow: hidden;
    overflow-y: scroll;
    background-color: $deepBgc;
    &::-webkit-scrollbar {
      width: 0;
      display: none;
    }
    &.add-buttom {
      bottom: 50px;
    }
    .view {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
