<template>
  <div class="mes-panel">
    <loading v-show="Loading" />
    <van-nav-bar
      v-if="name !== ''"
      :title="name"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
      @click-right.stop="onClickRight"
    >
      <template #right>
        <van-image
          v-if="avatar !== '' && !hide"
          round
          width="30px"
          height="30px"
          :src="IMG_URL + avatar"
          class="avatar"
        />
      </template>
    </van-nav-bar>

    <mes-list :chat-list="chatList" />
    <transition name="emoji">
      <div v-show="emojiFlag" class="emoji-container">
        <emoji @chooseEmoji="receiveEmoji" />
      </div>
    </transition>
    <div v-if="isShowSend" class="footer-containter">
      <footer-send ref="send" @chatList="updateChatList" @emojiShow="emojiShow" />
    </div>
  </div>
</template>

<script>
import emoji from './Emoji/emoji'
import FooterSend from './FooterSend/footerSend'
import loading from '@/components/loading'

import MesList from './MesList/mesList'
import { ref, toRefs, ref, computed, onMounted, inject, onBeforeMount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { getGroupInfo } from '@/api/group'
import { Toast } from 'vant'
export default {
  name: 'MesPanel',
  components: { FooterSend, MesList, emoji, loading },
  setup() {
    const socket = inject('socket')
    const route = useRoute()
    const router = useRouter()
    const store = useStore()
    const send = ref(null)
    const state = ref({
      chatList: [],
      offset: 1,
      limit: 50,
      emojiFlag: false,
      isShowSend: true,
      avatar: '',
      name: '',
      hide: false,
      friendId: '',
      IMG_URL: process.env.VUE_APP_IMG_URL,
      isLoading: false,
      Loading: false,
      count: 0

    })
    const userInfo = computed(() => {
      return store.state.userInfo
    })

    const allChatList = computed(() => {
      return store.state.allChatList
    })
    onBeforeMount(() => {
      init()
      checkIsMyChannel()
    })
    onMounted(() => {
      socket.on('org', mes => {
        if (mes.roomId === route.params.id) {
          state.chatList.push(Object.assign({}, mes, { type: 'org' }))
        }
      })
      socket.on('mes', mes => {
        if (mes.roomId === route.params.id) {
          state.chatList.push(Object.assign({}, mes, { type: 'other' }))
          socket.emit('setReadStatus', { roomId: mes.roomId, userName: userInfo.value.userName })
          store.commit('setUnRead', { roomId: mes.roomId, clear: true })
        }
      })
      socket.on('getHisMeg', mes => {
        if (mes.length) {
          store.commit('updateAllChatList', mes[mes.length - 1])
        }
        state.chatList = mes.map(item => {
          if (item.type !== 'org') {
            if (item.userName === userInfo.value.userName) {
              item.type = 'mine'
            } else {
              item.type = 'other'
            }
          }
          return item
        })
      })
    })
    const init = () => {
      state.Loading = true
      // 设置服务器信息为已读状态也本地设置为已读,获取聊天记录
      socket.emit('setReadStatus', { roomId: route.params.id, userName: userInfo.value.userName })
      store.commit('setUnRead', { roomId: route.params.id, clear: true })
      socket.emit('getHisMeg', { roomId: route.params.id, offset: 1, limit: 100 })
      state.Loading = false

      // 头部信息初始化
      const id = route.params.id

      if (userInfo.value.id === id) {
        // this.avatar = this.userInfo.avatar
        state.name = '备忘录'
        state.hide = true
        return
      }
      const arr = allChatList.value.filter(item => item.id === id)
      state.avatar = arr[0].avatar
      state.name = arr[0].userName
      state.friendId = arr[0].friendId
    }

    const checkIsMyChannel = async() => {
      const params = { id: route.params.id }
      if (params.id.split('-').length > 1) return
      if (params.id === userInfo.value.id) return
      const userId = userInfo.value.id

      const res = await getGroupInfo(params)
      const groupUsers = res.users
      const holderId = groupUsers.filter(item => item.holder === 1)[0].userId['_id']

      const channelArr = allChatList.value.filter(item => item.type === 'channel' && item.id === params.id)
      if (channelArr.length && userId !== holderId) {
        state.isShowSend = false
      } else {
        state.isShowSend = true
      }
    }
    const onRefresh = () => {
      console.log('gogo')
      setTimeout(() => {
        Toast('刷新成功')
        state.isLoading = false
        state.count++
      }, 1000)
    }
    const onClickLeft = () => {
      router.go(-1)
    }
    const onClickRight = () => {
      const routeId = route.params.id
      console.log(routeId)
      if (routeId.split('-').length > 1) {
        return router.push({ name: 'FriendsInfo', params: { id: state.friendId }})
      }
      const aa = '123'
      router.push({ name: 'GroupInfo', params: { id: routeId, aa }})
    }
    const updateChatList = val => {
      state.chatList.push(val)
    }
    const emojiShow = (flag = true) => {
      state.emojiFlag = flag && !state.emojiFlag
    }

    const receiveEmoji = m => {
      send.value.addEmoji(m)
    }

    return {
      ...toRefs(state),
      send,
      onRefresh,
      onClickLeft,
      onClickRight,
      updateChatList,
      emojiShow,
      receiveEmoji
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/assets/scss/color.scss';

.mes-panel {
  background-color: $deepBgc;
  .van-nav-bar {
    background-color: $lightBgc;
  }
  .emoji-container {
    position: absolute;
    z-index: 2;
    right: 0;
    bottom: 46px;
    box-sizing: border-box;
    width: 50vw;
    height: 140px;
    background-color: $deepBgc;
    border: 1px solid $lightGray;
    border-radius: 8px;
  }

  .emoji-enter,
  .emoji-leave-to {
    opacity: 0;
    transform: translateY(20px);
  }
  .emoji-enter-active,
  .emoji-leave-active {
    transition: all 0.1s ease;
  }
  .footer-containter {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 50px;
  }
  :deep(.van-nav-bar__content) {
    height: 40px;
  }
  :deep(.van-nav-bar__left) {
    padding: 10px;
  }
  .avatar {
    right: -5px;
  }
}
</style>
