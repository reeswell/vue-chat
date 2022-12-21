
<template>
  <div class="friend-detail">
    <van-nav-bar left-text="返回" left-arrow @click-left="onClickLeft" />
    <div v-if="friendsInfo !== null" class="containter">
      <div class="person-wrapper">
        <img v-lazy="IMG_URL + friendsInfo.avatar" class="img">
        <p class="info">
          <span>{{ friendsInfo.city }}&nbsp;&nbsp;</span><span>{{ friendsInfo.gender }}&nbsp;&nbsp;</span><span>{{ friendsInfo.age }}岁</span>
        </p>
        <p class="info phone">
          <span>{{ friendsInfo.mobilePhone }}</span>
        </p>
      </div>
    </div>
    <van-cell v-if="remark !== ''" title="设置备注" :value="remark" is-link class="remark" @click="goRemark" />

    <div class="button-type">
      <van-button type="danger" @click="deleteIt">删除好友</van-button>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs, computed, inject, onBeforeMount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { deleteDialog, previewUser, getUserInfo } from '@/api/user'
import { deleteFriend } from '@/api/friendly'
import { Dialog, Toast } from 'vant'

export default {
  name: 'FriendsInfo',
  setup() {
    const socket = inject('socket')
    const route = useRoute()
    const router = useRouter()
    const store = useStore()
    const state = reactive({
      friendsInfo: null,
      isMyFriend: false,
      IMG_URL: process.env.VUE_APP_IMG_URL,
      remark: '',
      userInfo: computed(() => {
        return store.state.userInfo
      }),
      allChatList: computed(() => {
        return store.state.allChatList
      })
    })

    const onClickLeft = () => {
      router.go(-1)
    }
    const blockFriend = async() => {
      console.log('blockFriend')
      const friendId = route.params.id
      const arr = state.allChatList.filter(item => item.friendId === friendId)
      const roomId = arr[0].id
      const obj = { userId: state.userInfo.id, friendId, roomId }
      try {
        const { msg } = await deleteDialog(obj)
        await deleteFriend(obj)
        Toast(msg)
        const roomArr = [roomId]
        socket.emit('update', roomArr)
        store.dispatch('getUserInfo')
        setTimeout(() => {
          router.push({ name: 'Chat' })
        }, 200)
      } catch (error) {
        console.log(error)
      }
    }
    const deleteIt = () => {
      Dialog.confirm({
        title: '提示',
        message: '您确定要删除该好友？',
        confirmButtonText: '确定',
        confirmButtonColor: '#b532e9'
      })
        .then(() => {
          blockFriend()
        })
        .catch(error => {
          console.log(error)
        })
    }
    const getFriendInfo = async() => {
      const params = { id: route.params.id }
      const res = await previewUser(params)
      state.friendsInfo = res.data
      store.dispatch('setFriendsInfo', state.friendsInfo)
    }
    const getUserChatLsit = async() => {
      const { data } = await getUserInfo()
      const chatList = data.conversationsList
      chatList.forEach(item => {
        if (item.friendId === state.friendsInfo.id) {
          state.remark = item.userName
        }
      })
    }
    const goRemark = async() => {
      const id = state.friendsInfo.id
      router.push({ name: 'EditRemark', params: { id: id }})
    }
    onBeforeMount(() => {
      getFriendInfo()
      getUserChatLsit()
    })

    return {
      ...toRefs(state),
      onClickLeft,
      blockFriend,
      deleteIt,
      goRemark
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

