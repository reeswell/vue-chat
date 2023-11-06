
<template>
  <div class="search-friend">
    <van-search v-model="keyword" show-action placeholder="用户名/手机号" @search="showSearch" @cancel="onCancel" />
    <div v-if="friendsInfo !== null" class="search-result">
      <div class="seesion-list" @click="previewUser(friendsInfo.id)">
        <div class="list-left">
          <van-image
            round
            width="56px"
            height="56px"
            :src="IMG_URL + friendsInfo.avatar"
          ><template #error>加载失败</template></van-image>
        </div>
        <div class="list-right">
          <div class="first-line">
            <p class="name">{{ friendsInfo.userName }}</p>
          </div>
          <p class="lastmsg">{{ friendsInfo.nickname }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, toRefs, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { addFriends } from '@/api/user'
import { checkIsFriends } from '@/api/friendly'
export default {
  name: 'SearchFriend',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const store = useStore()
    const state = ref({
      keyword: '',
      IMG_URL: process.env.VUE_APP_IMG_URL,
      friendsInfo: null

    })
    const allChatList = computed(() => {
      return store.state.allChatList
    })
    const userInfo = computed(() => {
      return store.state.userInfo
    })
    const onCancel = () => {
      router.go(-1)
    }
    const checkIsMyFriends = async() => {
      const data = {
        roomId: route.params.id
      }
      const res = await checkIsFriends(data)
      const isMyFriend = res.data.isFriends
      return isMyFriend
    }
    const previewUser = async id => {
      if (id === userInfo.value.id) {
        return router.push({ name: 'MesPanel', params: { id: id }})
      }
      const isFriend = allChatList.value.filter(item => item.friendId === id)
      const isMyFriends = await checkIsFriends()
      if (isFriend.length && isMyFriends) return router.push({ name: 'MesPanel', params: { id: isFriend[0].id }})
      router.push({ name: 'FriendDetail', params: { id: id }})
    }
    const showSearch = async() => {
      const data = { keyword: state.keyword }
      try {
        const res = await addFriends(data)
        state.friendsInfo = res.data
      } catch (error) {
        console.log(error)
      }
    }
    return {
      ...toRefs(state),

      onCancel,
      checkIsMyFriends,
      previewUser,
      showSearch
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/color.scss';

.search-friend {
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
          .name {
            flex: 1;
            margin-bottom: 4px;
            font-size: 16px;
            color: $fontWhite;
            font-weight: 700;
          }
        }
        .lastmsg {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          margin-bottom: 0;
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
}
</style>
