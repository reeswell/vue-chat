<template>
  <div class="foot van-hairline--top">
    <input
      type="file"
      class="img"
      title="选择图片"
      @change="InmageChange"
      ref="chooseInmage"
      accept="image/png, image/jpeg, image/gif, image/jpg"
    />
    <input type="file" class="img" title="选择图片" @change="fileChange" ref="uploadFile" />

    <div class="local-link" @click="show = true">
      <i class="icon-attachment"></i>
    </div>
    <van-action-sheet
      v-model="show"
      :actions="actions"
      cancel-text="取消"
      close-on-click-action
      @cancel="onCancel"
      @select="onSelect"
    ></van-action-sheet>
    <div class="input">
      <input type="text" placeholder="输入消息..." v-model="message" />
      <div class="more">
        <van-icon name="smile-o" size="26px" color="#f9cc9d" @click="emojiClick"> </van-icon>
      </div>
    </div>
    <div class="send icon-arrow-up-alt1" :class="upFlag ? 'active' : ''" @click="send(false)"></div>
  </div>
</template>

<script>
import {formatTime} from '@/utils/tools'
import {mapState} from 'vuex'
export default {
  name: 'sendfoot',
  data() {
    return {
      message: '',
      show: false,
      actions: [{name: '图片'}, {name: '文件'}],
      upFlag: false,
      isMyFriend: false
    }
  },
  computed: {
    ...mapState(['userInfo'])
  },
  watch: {
    message: function (newval, oldval) {
      if (this.message == '') {
        this.upFlag = false
      } else {
        this.upFlag = true
      }
    }
  },

  methods: {
    async fileChange() {
      const file = this.$refs.uploadFile.files[0]
      if (file.type.indexOf('image') !== -1) {
        this.$toast('请选择图片上存!')
        return
      }
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$toast('文件大小不能超过 2MB!')
        return
      }
      try {
        const formdata = new FormData()
        formdata.append('file', file)
        const result = await this.$api.uploadFile(formdata)
        if (result.code === 200) {
          this.send(result.data, 'file')
        } else {
          this.$toast('上传失败')
        }
        this.$refs['uploadFile'].value = ''
      } catch (error) {
        console.log(error)
      }
    },
    emojiClick() {
      this.$emit('emojiShow')
    },
    addEmoji(e) {
      this.message += e
    },
    onCancel() {
      this.$toast('取消')
    },
    onSelect(item) {
      // 默认情况下点击选项时不会自动收起
      // 可以通过 close-on-click-action 属性开启自动收起

      if (item.name === '图片') {
        this.$refs.chooseInmage.click()
      } else if (item.name === '文件') {
        console.log('文件')
        this.$refs.uploadFile.click()
      }
    },
    async checkIsMyfriends() {
      const data = {
        roomId: this.$route.params.id
      }
      const res = await this.$api.checkIsFriends(data)
      this.isMyFriend = res.data.isFriends
      return this.isMyFriend
    },
    async InmageChange() {
      const file = this.$refs.chooseInmage.files[0]
      if (file.type.indexOf('image') === -1) {
        this.$toast('只能上传图片!')
        return
      }
      const isLt1M = file.size / 1024 / 1024 < 1
      if (!isLt1M) {
        this.$toast('图片大小不能超过 1MB!')
        return
      }
      const formdata = new FormData()
      formdata.append('file', file)
      const result = await this.$api.uploadFile(formdata)
      if (result.code === 200) {
        this.send(result.data, 'img')
      } else {
        this.$toast('上传失败')
      }
      this.$refs['chooseInmage'].value = ''
    },
    async send(params, type = 'mess') {
      // 发送消息
      if (!this.message && !params) {
        return
      }
      if (this.$route.params.id.split('-').length > 1) {
        const flag = await this.checkIsMyfriends()
        if (!flag) {
          this.$notify({type: 'warning', message: '你已经不是对方好友了！', background: '#e00011'})
          return
        }
      }
      const val = {
        userName: this.userInfo.userName,
        mes: this.message,
        time: formatTime(new Date()),
        avatar: this.userInfo.avatar,
        nickname: this.userInfo.nickname,
        read: [this.userInfo.userName],
        roomId: this.$route.params.id,
        style: 'mess',
        self: this.userInfo.id
      }
      if (type === 'img') {
        val.style = 'img'
        val.mes = '图片'
        val.emoji = params
      } else if (type === 'file') {
        val.style = 'file'
        val.mes = params.split('-')[params.split('-').length - 1]
        val.emoji = params
      }
      this.$emit('chatList', Object.assign({}, val, {type: 'mine'}))
      this.$emit('emojiShow', false)
      this.$socket.emit('mes', val)
      if (type === 'mess') {
        // 清空输入框
        this.message = ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/color.scss';

.foot {
  display: flex;

  align-items: center;
  background-color: $deepBgc;
  .van-action-sheet {
    color: $fontWhite;
    .van-action-sheet__item {
      background-color: $deepBgc;
    }
    .van-action-sheet__gap {
      background-color: $deepBgc;
    }
    .van-action-sheet__cancel {
      color: $fontWhite;

      background-color: $deepBgc;
    }
  }
  .local-link,
  .send {
    width: 45px;
    text-align: center;
    line-height: 50px;
    color: #939ba6;
  }
  .local-link {
    height: 50px;
    text-align: center;

    i {
      font-size: 26px;
      line-height: 50px;
    }
  }
  .send {
    font-size: 34px;
    &.icon-arrow-up-alt1 {
      color: $fontGray;
      &.active {
        color: $blueBgc;
      }
    }
  }

  .send:active {
    &.icon-arrow-up-alt1 {
      font-size: 42px;
    }
  }
  .img {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 0;
    height: 0;
    opacity: 0;
    z-index: -2;
  }
  .input {
    flex: 1;
    // position: relative;
    // width: 45px;
    height: 40px;
    text-align: center;
    line-height: 40px;
    // color: #f9cc9d;
    color: $fontWhite;
    // padding-right: 10px 36px 10px 15px;
    input {
      display: inline-block;
      width: 100%;
      box-sizing: border-box;

      // padding: 10px 36px 10px 15px;
      padding-left: 20px;
      padding-right: 36px;
      border: 1px solid $fontGray;
      border-radius: 60px;
      background-color: $deepBgc;
    }
    input::placeholder {
      color: #939ba6;
    }
    .more {
      position: absolute;
      right: 54px;
      bottom: -4px;
      .vant-icon {
        color: #939ba6;
        font-size: 35px;
      }
    }
  }
}
</style>
