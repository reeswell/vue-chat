<template>
  <div class="sendGroupValidate">
    <van-nav-bar
      title="添加群组"
      left-text="取消"
      right-text="发送"
      @click-left="onClickLeft"
      @click-right="onClickRight"
    />
    <div class="search-result van-hairline--bottom" v-if="groupInfo !== null">
      <div class="seesion-list">
        <div class="list-left">
          <van-image round width="56px" height="56px" :src="IMG_URL + groupInfo.img"
            ><template v-slot:error>加载失败</template></van-image
          >
        </div>
        <div class="list-right">
          <div class="first-line">
            <p class="name">{{ groupInfo.title }}</p>
          </div>
          <p class="lastmsg">
            {{ groupInfo.desc }}
          </p>
        </div>
      </div>
    </div>
    <div class="tip">填写验证信息</div>
    <textarea class="text" maxlength="30" v-model="introduce"></textarea>
  </div>
</template>

<script>
import * as tools from '@/utils/tools'
import {mapState} from 'vuex'
export default {
  name: 'SendGroupValidate',
  data() {
    return {
      IMG_URL: process.env.VUE_APP_IMG_URL,
      introduce: ''
    }
  },
  computed: {
    ...mapState(['userInfo', 'groupInfo', 'sysInfo'])
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1)
    },
    onClickRight() {

      const group = this.groupInfo
      const user = this.userInfo
      const obj = {
        userName: user.userName,
        mes: this.introduce,
        time: tools.formatTime(new Date()),
        avatar: user.avatar,
        nickname: user.nickname,
        signature: user.signature,
        read: [],
        self: user.id,
        otherName: group.otherName,
        otherAvatar: group.otherAvatar,
        groupName: group.title,
        groupId: group._id,
        groupPhoto: group.img,
        roomId: this.$route.params.id + '-' + this.sysInfo.id.split('-')[1],
        state: group.type,
        type: 'validate',
        status: '0'
      }
      this.$socket.emit('sendValidate', obj)
      this.$notify({type: 'success', message: '发送成功'})
      this.$router.push({name: 'Chat'})
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/color.scss';

.sendGroupValidate {
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
  .tip {
    font-size: 14px;
    padding: 20px 8px 6px 8px;
    background-color: $lightBgc;
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
