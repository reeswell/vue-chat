
<template>
  <div class="friend-detail">
    <van-nav-bar left-text="返回" left-arrow @click-left="onClickLeft" />
    <div class="person-wrapper van-hairline--bottom" v-if="friendsInfo !== null">
      <img :src="IMG_URL + friendsInfo.avatar" width="50px" height="45px" />
      <p class="name">{{ friendsInfo.nickname }}</p>
      <p class="date">
        <span>{{ friendsInfo.province }}</span
        ><span>{{ friendsInfo.city }}</span
        ><span>{{ friendsInfo.gender }}</span
        ><span>{{ friendsInfo.age }}</span>
      </p>
    </div>
    <div class="button-type" v-if="friendsInfo !== null && friendsInfo.userName !== this.userInfo.userName">
      <van-button @click="mesCheck" type="info">加为好友</van-button>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex'

export default {
  name: 'FriendDetail',
  data() {
    return {
      friendsInfo: null,
      isMyFriend: false,
      IMG_URL: process.env.VUE_APP_IMG_URL
    }
  },
  computed: {
    ...mapState(['userInfo'])
  },
  created() {
    this.getUserInfo()
  },
  mounted() {},
  methods: {
    onClickLeft() {
      this.$router.go(-1)
    },
    mesCheck() {
      console.log('mesCheck')
      this.$router.push({name: 'SendFriendValidate', params: {id: this.$route.params.id}})
    },
    blockFriend() {
      console.log('blockFriend')
    },
    async getUserInfo() {
      const params = {id: this.$route.params.id}
      const res = await this.$api.previewUser(params)
      console.log(res)
      this.friendsInfo = res.data
      this.$store.dispatch('setFriendsInfo', this.friendsInfo)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/color.scss';

.friend-detail {
  .van-hairline--bottom::after {
    display: none;
  }
  .van-nav-bar {
    background-color: $lightBgc;
  }
  .person-wrapper {
    margin-top: -10px;
    text-align: center;
    z-index: 2;
    img {
      border-radius: 50%;
    }
    .name {
      margin-top: 5px;
      font-size: 20px;
      font-weight: 600;
      color: $fontWhite;
    }
    .date {
      font-size: 14px;
      color: $fontGray;
      margin-top: 4px;
    }
    ::v-deep .van-hairline--bottom::after {
      display: block;
    }
  }
  .van-button {
    margin-top: 25px;
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
