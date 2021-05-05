<template>
  <div class="contact">
    <van-nav-bar title="聊天" />

    <van-search v-model="value" placeholder="搜索" shape="round" @focus="goSearch" />

    <div class="contact-wrapper">
      <van-tabs v-model="active" animated sticky swipeable>
        <van-tab v-for="(item, index) in chatList" :title="item.name" :key="index">
          <div class="dialogue-container">
            <ul>
              <van-swipe-cell v-for="(i, index) in item.List" :key="index" v-if="item.List.length">
                <li class="seesion-list first-li van-hairline--bottom" @click="goMesPanel(i.id)">
                  <div class="list-left">
                    <van-image round :src="IMG_URL + i.avatar" class="avatar" />
                  </div>
                  <div class="list-right">
                    {{ i.userName }}
                  </div>
                </li>
              </van-swipe-cell>
            </ul>
          </div>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
import {mapState, mapGetters} from 'vuex'

export default {
  name: 'Contact',
  data() {
    return {
      value: '',
      active: '',
      IMG_URL: process.env.VUE_APP_IMG_URL,
      // showRight: false,
      chatList: [], //  所有会话类型
      removeSation: {},
      show: false
    }
  },
  computed: {
    ...mapState(['allChatList', 'userInfo']),
    ...mapGetters(['getFriendList', 'getGroupList'])
  },

  created() {
    this.init()
  },

  methods: {
    init() {
      const arr = [
        {name: '好友', List: []},
        {name: '群组', List: []}
      ]
      arr[0].List = this.getFriendList
      arr[1].List = this.getGroupList
      this.chatList = arr
    },
    onClickLeft() {
      this.$store.dispatch('getSysInfo')
      console.log('left')
    },
    goMesPanel(id) {
      this.$router.push({name: 'MesPanel', params: {id: id}})
    },
    goSearch() {
      this.$router.push({name: 'SearchLocal'})
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/color.scss';

.contact {
  position: relative;
  background-color: $deepBgc;
  color: $fontWhite;
  .van-overlay {
    background-color: rgba(0, 0, 0, 0);
  }
  ::v-deep .van-nav-bar {
    background-color: $lightBgc;
    &.van-hairline--bottom::after {
      display: none;
    }
  }
  .van-hairline--bottom::after {
    display: block;
  }
  .van-search {
    background-color: $lightBgc;
    .van-search__content {
      background-color: $deepBgc;
      ::v-deep .van-field__control::placeholder {
        text-align: center;
        color: $fontGray;
      }
      ::v-deep .van-field__left-icon {
        position: relative;
        left: 42%;
        color: $fontGray;
      }
    }
  }
  ::v-deep .van-tabs__wrap {
    background-color: $lightBgc;
  }
  ::v-deep .van-tabs__nav {
    width: 150px;
    background-color: $lightBgc;
  }

  .dialogue-container {
    top: 100px;
    bottom: 50px;
    width: 100%;
    overflow: hidden;
    .seesion-list {
      height: 55px;
      width: 100%;
      display: flex;
      box-sizing: border-box;
      padding: 10px 12px;
      align-items: center;
      .avatar {
        width: 40px;
        height: 40px;
        margin-right: 12px;
      }
      .list-right {
        flex: 1;
        margin-bottom: 4px;
        font-size: 16px;
      }
    }
    .seesion-list:first-of-type {
      margin-top: 10px;
    }
  }
}
</style>
