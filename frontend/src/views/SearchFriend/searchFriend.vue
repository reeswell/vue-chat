
<template>
  <div class="search-friend">
    <van-search v-model="keyword" show-action placeholder="用户名/手机号" @search="showSearch" @cancel="onCancel" />
    <div class="search-result" v-if="friendsInfo !== null">
      <div class="seesion-list" @click="previewUser(friendsInfo.id)">
        <div class="list-left">
          <van-image round width="56px" height="56px" :src="IMG_URL + friendsInfo.avatar"
            ><template v-slot:error>加载失败</template></van-image
          >
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
import {mapState} from 'vuex'

export default {
  name: 'searchFriend',
  data() {
    return {
      keyword: '',
      IMG_URL: process.env.VUE_APP_IMG_URL,

      friendsInfo: null
    }
  },
  computed: {
    ...mapState(['allChatList', 'userInfo'])
  },
  methods: {
    onCancel() {
      this.$router.go(-1)
    },
    async checkIsMyfriends() {
      const data = {
        roomId: this.$route.params.id
      }
      const res = await this.$api.checkIsFriends(data)
      this.isMyFriend = res.data.isFriends
      return this.isMyFriend
    },
    async previewUser(id) {
      if (id === this.userInfo.id) {
        return this.$router.push({name: 'MesPanel', params: {id: id}})
      }
      const isFriend = this.allChatList.filter(item => item.friendId === id)
      const isMyfriends = await this.checkIsMyfriends()
      if (isFriend.length && isMyfriends) return this.$router.push({name: 'MesPanel', params: {id: isFriend[0].id}})
      this.$router.push({name: 'FriendDetail', params: {id: id}})
    },
    async showSearch() {
      console.log('showSearch')
      const data = {keyword: this.keyword}
      try {
        const res = await this.$api.addFriends(data)
        this.friendsInfo = res.data
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/color.scss';

.search-friend {
  .van-search {
    background-color: $lightBgc;
    .van-search__content {
      background-color: $deepBgc;
      ::v-deep .van-field__control::placeholder {
        color: $fontGray;
      }
      ::v-deep .van-field__left-icon {
        color: $fontGray;
      }
    }
    .van-search__action {
      color: $fontWhite;
    }
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
