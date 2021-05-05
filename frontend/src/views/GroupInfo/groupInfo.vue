<template>
  <div class="groupInfo">
    <van-nav-bar left-text="返回" left-arrow @click-left="onClickLeft" @click-right="onClickRight">
      <template #right>
        <van-icon name="clear" size="24" class="icon" />
      </template>
    </van-nav-bar>
    <div
      v-for="img in imageList"
      v-lazy:background-image="IMG_URL + img"
      :key="img"
      class="lazy"
      v-if="groupInfo !== null"
    ></div>

    <div class="groupInfo-container" v-if="groupInfo !== null">
      <van-cell title="群ID" :value="groupInfo.groupCode" />

      <van-cell title="群名称" :value="groupInfo.title" />
      <van-cell title="创建时间" :value="groupInfo.createDate.split('T')[0]" />
      <van-cell :value="'共' + managers.length + '人'" is-link>
        <!-- 使用 title 插槽来自定义标题 -->
        <template #title>
          <span class="custom-title">管理员</span>
          <van-tag v-for="(item, index) in managers" :key="item._id"
            ><img :src="IMG_URL + item.userId.avatar" alt="" width="20" height="20" class="img"
          /></van-tag>
        </template>
      </van-cell>
    </div>
    <div class="groupuser">
      <van-tabs line-height="0px">
        <van-tab :title="'群成员' + groupUsers.length + '人'">
          <div class="dialogue-container">
            <ul>
              <li
                class="seesion-list first-li"
                v-for="(item, index) in groupUsers"
                :key="index"
                @click="previewUser(item.userId._id)"
              >
                <div class="list-left">
                  <van-image round :src="IMG_URL + item.userId.avatar" class="avatar" />
                </div>
                <div class="list-right">
                  {{ item.userId.nickname }}
                </div>
              </li>
            </ul>
          </div>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex'

export default {
  name: 'GroupInfo',
  data() {
    return {
      AA: '8',
      imageList: [],
      groupInfo: null,
      managers: [],
      groupUsers: [],
      IMG_URL: process.env.VUE_APP_IMG_URL,
      holderId: ''
    }
  },
  created() {
    this.getGroupInfo()
  },
  computed: {
    ...mapState(['userInfo', 'allChatList'])
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1)
    },
    mesCheck() {
      console.log('mesCheck')
      this.$router.push({name: 'SendGroupValidate', params: {id: this.holderId}})
    },
    blockGroup() {
      console.log('blockFriend')
    },
    previewUser(id) {
      if (id === this.userInfo.id) {
        return this.$router.push({name: 'MesPanel', params: {id: id}})
      }
      const isFriend = this.allChatList.filter(item => item.friendId === id)
      if (isFriend.length) return this.$router.push({name: 'MesPanel', params: {id: isFriend[0].id}})
      this.$router.push({name: 'FriendDetail', params: {id: id}})
    },
    async getGroupInfo() {
      const params = {id: this.$route.params.id}

      const res = await this.$api.getGroupInfo(params)
      this.groupInfo = res.data
      this.groupUsers = res.users
      this.imageList.push(this.groupInfo.img)
      this.managers = this.groupUsers.filter(item => item.holder === 1 || item.manager === 1)
      this.holderId = this.groupUsers.filter(item => item.holder === 1)[0].userId['_id']
      this.groupInfo.otherAvatar = this.groupUsers.filter(item => item.holder === 1)[0].userId['avatar']
      this.groupInfo.otherName = this.groupUsers.filter(item => item.holder === 1)[0].userId['nickname']
      this.$store.dispatch('setGroupInfo', this.groupInfo)
    },
    onClickRight() {
      console.log('onClickRight')
      this.$dialog
        .confirm({
          title: '提示',
          message: '您确定退出该群吗？',
          confirmButtonText: '确定',
          confirmButtonColor: '#b532e9'
        })
        .then(() => {
          // 删除groupUser && 删除会话列表
          const id = this.$route.params.id
          const obj = {userId: this.userInfo.id, groupId: id}
          const {msg} = this.$api.quitGroup(obj)
          this.$store.dispatch('getUserInfo')
          this.$router.push({name: 'Chat'})
        })
        .catch(error => {
          console.log(error)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/color.scss';

.groupInfo {
  .van-cell {
    background-color: $lightBgc;
    color: $fontWhite;
  }
  .van-nav-bar {
    background: transparent;
    z-index: 11;
    .icon {
      color: rgb(129, 129, 129);
    }
  }
  .van-hairline--bottom::after {
    border-bottom-width: 0;
  }
  .van-tag--default {
    background-color: #fff;
  }
  .lazy {
    position: fixed;
    z-index: 10;
    top: 0;
    left: 0;
    box-sizing: border-box;
    width: 100%;
    height: 250px;
    background-color: #fff;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    border-radius: 0 0 12px 12px;
  }
  .groupInfo-container {
    margin-top: 204px;
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

    .img {
      border-radius: 50%;
    }
  }
  .groupuser {
    margin-top: 20px;
    ::v-deep .van-tabs__nav {
      background-color: $blueBgc;
      height: 38px;
      padding-bottom: 0;
      .van-tab__text {
        color: #fff;
        font-size: 16px;
      }
    }
    .dialogue-container {
      width: 100%;
      overflow: hidden;
      .seesion-list {
        height: 40px;
        width: 100%;
        display: flex;
        box-sizing: border-box;
        padding: 10px 12px;
        align-items: center;
        background-color: $lightBgc;
        .avatar {
          width: 30px;
          height: 30px;
          margin-right: 12px;
        }
        .list-right {
          flex: 1;
          margin-bottom: 4px;
          font-size: 14px;
          color: $fontWhite;
        }
      }
      .seesion-list:first-of-type {
        margin-top: 10px;
      }
    }
  }
}
</style>
