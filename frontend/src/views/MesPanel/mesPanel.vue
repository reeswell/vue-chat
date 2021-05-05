<template>
  <div class="mes-panel">
    <van-nav-bar
      :title="name"
      left-text="返回"
      left-arrow
      v-if="name !== ''"
      @click-left="onClickLeft"
      @click-right.stop="onClickRight"
    >
      <template #right>
        <van-image
          round
          width="30px"
          height="30px"
          :src="IMG_URL + avatar"
          class="avatar"
          v-if="avatar !== '' && !hide"
        />
      </template>
    </van-nav-bar>

    <mes-list :chatList="chatList"></mes-list>
    <transition name="emoji">
      <div class="emoji-container" v-show="emojiFlag">
        <emoji @chooseEmoji="receiveEmoji"></emoji>
      </div>
    </transition>
    <div class="footer-containter" v-if="isShowSend">
      <footer-send @chatList="updateChatList" @emojiShow="emojiShow" ref="send"></footer-send>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import emoji from './Emoji/emoji'
import FooterSend from './FooterSend/footerSend'
import MesList from './MesList/mesList'
export default {
  name: 'MesPanel',
  components: {FooterSend, MesList, emoji},
  data() {
    return {
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
      count: 0
    }
  },
  computed: {
    ...mapState(['userInfo', 'OnlineUser', 'allChatList'])
  },
  created() {
    this.init()
    this.checkIsMyChannel()
  },
  sockets: {
    org(mes) {
      if (mes.roomId === this.$route.params.id) {
        this.chatList.push(Object.assign({}, mes, {type: 'org'}))
      }
    },
    mes(mes) {
      if (mes.roomId === this.$route.params.id) {
        this.chatList.push(Object.assign({}, mes, {type: 'other'}))
        this.$socket.emit('setReadStatus', {roomId: mes.roomId, userName: this.userInfo.userName})
        this.$store.commit('setUnRead', {roomId: mes.roomId, clear: true})
      }
    },
    getHisMeg(mes) {
      if (mes.length) {
        this.$store.commit('updateAllChatList', mes[mes.length - 1])
      }
      this.chatList = mes.map(item => {
        if (item.type !== 'org') {
          if (item.userName === this.userInfo.userName) {
            item.type = 'mine'
          } else {
            item.type = 'other'
          }
        }
        return item
      })
    }
  },
  methods: {
    init() {
      // 设置服务器信息为已读状态也本地设置为已读,获取聊天记录
      this.$socket.emit('setReadStatus', {roomId: this.$route.params.id, userName: this.userInfo.userName})
      this.$store.commit('setUnRead', {roomId: this.$route.params.id, clear: true})
      this.$socket.emit('getHisMeg', {roomId: this.$route.params.id, offset: 1, limit: 100})

      // 头部信息初始化
      const id = this.$route.params.id

      if (this.userInfo.id === id) {
        // this.avatar = this.userInfo.avatar
        this.name = '备忘录'
        this.hide = true
        return
      }
      const arr = this.allChatList.filter(item => item.id === id)
      this.avatar = arr[0].avatar
      this.name = arr[0].userName
      this.friendId = arr[0].friendId
    },

    async checkIsMyChannel() {
      const params = {id: this.$route.params.id}
      if (params.id.split('-').length > 1) return
      if (params.id === this.userInfo.id) return
      const userId = this.userInfo.id

      const res = await this.$api.getGroupInfo(params)
      const groupUsers = res.users
      const holderId = groupUsers.filter(item => item.holder === 1)[0].userId['_id']

      const channelArr = this.allChatList.filter(item => item.type === 'channel' && item.id === params.id)
      if (channelArr.length && userId !== holderId) {
        this.isShowSend = false
      } else {
        this.isShowSend = true
      }
    },
    onRefresh() {
      console.log('gogo')
      setTimeout(() => {
        Toast('刷新成功')
        this.isLoading = false
        this.count++
      }, 1000)
    },
    onClickLeft() {
      this.$router.go(-1)
    },
    onClickRight() {
      const routeId = this.$route.params.id
      console.log(routeId)
      if (routeId.split('-').length > 1) {
        return this.$router.push({name: 'FriendsInfo', params: {id: this.friendId}})
      }
      const aa = '123'
      this.$router.push({name: 'GroupInfo', params: {id: routeId, aa}})
    },
    updateChatList(val) {
      this.chatList.push(val)
    },
    emojiShow(flag = true) {
      this.emojiFlag = flag && !this.emojiFlag
    },

    receiveEmoji(m) {
      this.$refs.send.addEmoji(m)
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
  ::v-deep .van-nav-bar__content {
    height: 40px;
  }

  ::v-deep .van-nav-bar__left {
    padding: 10px;
  }
  .avatar {
    right: -5px;
  }
}
</style>
