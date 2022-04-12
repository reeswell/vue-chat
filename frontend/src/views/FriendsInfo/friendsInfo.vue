
<template>
  <div class="friend-detail">
    <van-nav-bar left-text="返回" left-arrow @click-left="onClickLeft" />
    <div class="containter" v-if="friendsInfo !== null">
      <div class="person-wrapper">
        <img :src="IMG_URL + friendsInfo.avatar" class="img" />
        <p class="info">
          <span>{{ friendsInfo.city }}&nbsp;&nbsp;</span><span>{{ friendsInfo.gender }}&nbsp;&nbsp;</span
          ><span>{{ friendsInfo.age }}岁</span>
        </p>
        <p class="info phone">
          <span>{{ friendsInfo.mobilePhone }}</span>
        </p>
      </div>
    </div>
    <van-cell title="设置备注" :value="remark" v-if="remark !== ''" is-link class="remark" @click="goRemark" />

    <div class="button-type">
      <van-button @click="deleteIt" type="danger">删除好友</van-button>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex'

export default {
  name: 'FriendsInfo',
  data() {
    return {
      friendsInfo: null,
      isMyFriend: false,
      IMG_URL: process.env.VUE_APP_IMG_URL,
      remark: ''
    }
  },
  computed: {
    ...mapState(['userInfo', 'allChatList'])
  },
  created() {
    this.getFriendInfo()
    this.getUserChatLsit()
  },
  mounted() {},
  methods: {
    onClickLeft() {
      this.$router.go(-1)
    },
    async blockFriend() {
      const friendId = this.$route.params.id
      const arr = this.allChatList.filter(item => item.friendId === friendId)
      const roomId = arr[0].id
      const obj = {userId: this.userInfo.id, friendId, roomId}
      try {
        const {msg} = await this.$api.deleteDialog(obj)
        const res = await this.$api.deleteFriend(obj)
        this.$toast(msg)
        const roomArr = [roomId]
        this.$socket.emit('update', roomArr)
        this.$store.dispatch('getUserInfo')
        setTimeout(() => {
          this.$router.push({name: 'Chat'})
        }, 200)
      } catch (error) {
        console.error(error)
      }
    },
    deleteIt() {
      this.$dialog
        .confirm({
          title: '提示',
          message: '您确定要删除该好友？',
          confirmButtonText: '确定',
          confirmButtonColor: '#b532e9'
        })
        .then(() => {
          this.blockFriend()
        })
        .catch(error => {
          console.error(error)
        })
    },
    async getFriendInfo() {
      const params = {id: this.$route.params.id}
      const res = await this.$api.previewUser(params)
      this.friendsInfo = res.data
      this.$store.dispatch('setFriendsInfo', this.friendsInfo)
    },
    async getUserChatLsit() {
      const {data} = await this.$api.getUserInfo()
      const chatList = data.conversationsList
      chatList.forEach(item => {
        if (item.friendId === this.friendsInfo.id) {
          this.remark = item.userName
        }
      })
    },
    goRemark() {
      const id = this.friendsInfo.id
      this.$router.push({name: 'EditRemark', params: {id: id}})
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/color.scss';

.friend-detail {
  .van-nav-bar {
    background-color: $lightBgc;
    &.van-hairline--bottom::after {
      display: none;
    }
  }
  .van-cell {
    background-color: $lightBgc;
    color: $fontWhite;
  }
  .van-cell::after {
    display: none;
  }
  .person-wrapper {
    text-align: center;
    z-index: 2;
    img {
      width: 150px;
      height: 150px;
      border-radius: 50%;
    }
    .name {
      margin-top: 5px;
      font-size: 20px;
      font-weight: 600;
      color: $fontWhite;
    }
    .info {
      font-size: 14px;
      color: $fontGray;
      margin-top: 4px;
      &.phone {
        margin-top: 6px;
      }
    }
  }
  .remark {
    margin-top: 20px;
  }
  .van-button {
    margin-top: 50px;
    left: 50%;
    transform: translateX(-50%);
    width: 90%;
    height: 38px;
    border-radius: 8px;
    line-height: 30px;
    font-size: 16px;
  }
}
</style>

