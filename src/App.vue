<template>
  <router-view class="view" v-slot="{Component}">
    <transition :name="mainName">
      <component :is="Component" />
    </transition>
  </router-view>
</template>

<script>
import {reactive, toRefs, watch, computed, onMounted, inject} from 'vue'
import {useStore} from 'vuex'

import {formatTime} from '@/utils/tools'

export default {
  name: 'App',

  setup() {
    const store = useStore()
    const socket = inject('socket')
    const state = reactive({
      mainName: 'fade', // 内容区域动画名
      userInfo: computed(() => {
        return store.state.userInfo
      }),
      conversationsList: computed(() => {
        return store.state.conversationsList
      }),
      sysNewsList: computed(() => {
        return store.state.sysNewsList
      }),
      allChatList: computed(() => {
        return store.state.allChatList
      })
    })

    const joinRoom = () => {
      const user = state.userInfo
      if (!user.userName) {
        return
      }

      state.conversationsList.forEach(item => {
        const val = {
          userName: user.userName,
          time: formatTime(new Date()),
          avatar: user.avatar,
          roomId: item.id
        }
        const room = {roomId: item.id, offset: 1, limit: 200}

        socket.emit('join', val)
        socket.emit('getHisMeg', room)
      })
    }
    watch(
      () => state.conversationsList,
      () => joinRoom(),
      {
        deep: true,
        immediate: true
      }
    )
    onMounted(() => {
      socket.on('connect', () => {
        console.log('连接成功')
      })
      socket.on('customEmit', () => {
        console.log('连接失败')
      })
      socket.on('joined', OnlineUser => {
        console.log('加入了', OnlineUser)
        store.dispatch('setOnlineUser', OnlineUser)
      })
      socket.on('leaved', OnlineUser => {
        store.dispatch('setOnlineUser', OnlineUser)
      })
      socket.on('getHisMeg', mes => {
        // 获取未读消息数量
        const data = mes.filter(item => item.read.indexOf(state.userInfo.userName) === -1)
        if (data.length) {
          store.commit('setUnRead', {roomId: data[0].roomId, count: data.length})
        }
      })
      socket.on('mes', obj => {
        store.commit('setUnRead', {roomId: obj.roomId, add: true, count: 1})
      })
      socket.on('takeValidate', obj => {
        console.log(obj)
        store.commit('setUnRead', {roomId: obj.roomId, add: true, count: 1})

        if (obj.type === 'info' || obj.type === 'validate') {
          store.dispatch('getUserInfo')
        }
      })
      socket.on('update', val => {
        store.dispatch('getUserInfo')
      })
      socket.on('ValidateSuccess', val => {
        store.dispatch('getUserInfo')
      })
    })
    return {
      ...toRefs(state)
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/scss/color.scss';
html,
body {
  height: 100%;
  overflow-x: hidden;
  overflow-y: scroll;
  background-color: $deepBgc;
}
#app {
  width: 100%;
  height: 100%;
}

// 底部导航之间相互切换 内容区域动画
.fade-enter {
  visibility: hidden;
  opacity: 0;
}
.fade-leave-to {
  display: none;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-to,
.fade-leave {
  visibility: visible;
  opacity: 1;
}
</style>

