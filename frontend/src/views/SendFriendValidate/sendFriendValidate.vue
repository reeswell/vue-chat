<template>
  <div class="send-friend-validate">
    <van-nav-bar
      title="添加好友"
      left-text="取消"
      right-text="发送"
      @click-left="onClickLeft"
      @click-right="onClickRight"
    />
    <div v-if="friendsInfo !== null" class="search-result">
      <div class="seesion-list">
        <div class="list-left">
          <van-image
            round
            width="56"
            height="56"
            :src="IMG_URL + friendsInfo.avatar"
          ><template #error>加载失败</template></van-image>
        </div>
        <div class="list-right">
          <div class="first-line">
            <p class="name">{{ friendsInfo.nickname }}</p>
          </div>
          <p class="lastmsg">
            {{ friendsInfo.province }} <span>{{ friendsInfo.city }}</span><span>{{ friendsInfo.gender }}</span><span>{{ friendsInfo.age }}</span>
          </p>
        </div>
      </div>
    </div>
    <div class="tip">填写验证信息</div>
    <textarea v-model="introduce" class="text" maxlength="30" />
  </div>
</template>

<script>
import * as tools from '@/utils/tools'
import { reactive, toRefs, computed, inject } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { Notify } from 'vant'
export default {
  name: 'SendFriendValidate',
  setup() {
    const socket = inject('socket')
    const router = useRouter()
    const store = useStore()
    const state = reactive({
      introduce: '',
      IMG_URL: process.env.VUE_APP_IMG_URL

    })
    const userInfo = computed(() => {
      return store.state.userInfo
    })
    const friendsInfo = computed(() => {
      return store.state.friendsInfo
    })
    const sysInfo = computed(() => {
      return store.state.sysInfo
    })
    const onClickLeft = () => {
      router.go(-1)
    }
    const onClickRight = () => {
      const friend = friendsInfo.value
      const user = userInfo.value
      const obj = {
        userName: user.userName,
        mes: state.introduce,
        time: tools.formatTime(new Date()),
        avatar: user.avatar,
        nickname: user.nickname,
        signature: user.signature,
        read: [],
        self: user.id,
        other: friend.id,
        otherName: friend.nickname,
        otherAvatar: friend.avatar,
        otherUserName: friend.userName,
        friendRoom: user.id + '-' + friend.id,
        roomId: friend.id + '-' + sysInfo.value.id.split('-')[1],
        state: 'friend',
        type: 'validate',
        status: '0'
      }
      socket.emit('sendValidate', obj)
      Notify({ type: 'success', message: '发送成功' })
      router.push({ name: 'Chat' })
    }

    return {
      ...toRefs(state),
      onClickLeft,
      onClickRight,
      friendsInfo
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/color.scss';

.send-friend-validate {
  background-color: $deepBgc;

  .van-nav-bar {
    background-color: $lightBgc;
  }
  .search-result {
    .seesion-list {
      height: 76px;
      width: 100%;
      display: flex;
      box-sizing: border-box;
      padding: 10px 12px;
      background-color: $lightBgc;

      .avatar {
        margin-right: 12px;
      }
      .list-right {
        flex: 1;
        margin-left: 20px;
        display: flex;
        flex-direction: column;
        height: 56px;
        .first-line {
          display: inline-flex;
          margin-top: 0;

          .name {
            flex: 1;
            margin-top: 4px;
            font-size: 16px;
            color: $fontWhite;
            font-weight: 700;
          }
        }
        .lastmsg {
          white-space: nowrap;
          width: 100%;
          overflow: hidden;
          font-size: 14px !important;
          margin-top: -4px;
          padding-right: 12px;
          flex: 1;
          font-size: 16px;
          max-width: 260px;
          min-height: 39px;
          line-height: 1.2;
          text-overflow: ellipsis;
          color: $fontGray;
        }
      }
    }
  }
  .tip {
    font-size: 14px;
    padding: 20px 8px 6px 8px;
    background-color: $deepBgc;
    color: $fontGray;
  }
  .text {
    padding: 8px 12px;
    box-sizing: border-box;
    width: 100%;
    border: none;
    background-color: $lightBgc;
    color: $fontWhite;
  }
}
</style>
