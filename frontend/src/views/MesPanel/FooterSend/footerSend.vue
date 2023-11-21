<template>
  <div class="foot van-hairline--top">
    <input
      ref="chooseImageRef"
      type="file"
      class="img"
      title="选择图片"
      accept="image/png, image/jpeg, image/gif, image/jpg"
      @change="handleImageChange"
    >
    <input ref="fileRef" type="file" class="img" title="选择图片" @change="fileChange">

    <div class="local-link" @click="show = true">
      <i class="icon-attachment" />
    </div>
    <van-action-sheet
      v-model:show="show"
      :actions="actions"
      cancel-text="取消"
      close-on-click-action
      @cancel="onCancel"
      @select="onSelect"
    />
    <div class="input">
      <input v-model="message" type="text" placeholder="输入消息...">
      <div class="more">
        <van-icon name="smile-o" size="26px" color="#f9cc9d" @click="emojiClick" />
      </div>
    </div>
    <div class="send icon-arrow-up-alt1" :class="upFlag ? 'active' : ''" @click="send(false)" />
  </div>
</template>

<script>
import { formatTime } from '@/utils/tools'
import { reactive, toRefs, ref, watch, computed, inject } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { uploadFile } from '@/api/upload'
import { checkIsFriends } from '@/api/friendly'
import { Toast, Notify } from 'vant'

export default {
  name: 'Sendfoot',
  setup(props, { emit }) {
    const socket = inject('socket')
    const route = useRoute()
    const store = useStore()
    const fileRef = ref(null)
    const chooseImageRef = ref(null)
    const state = reactive({
      message: '',
      show: false,
      actions: [{ name: '图片' }, { name: '文件' }],
      upFlag: false,
      isMyFriend: false

    })
    const userInfo = computed(() => {
      return store.state.userInfo
    })
    const fileChange = async() => {
      const file = fileRef.value.files[0]
      if (file.type.indexOf('image') !== -1) {
        Toast('请选择图片上存!')
        return
      }
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        Toast('文件大小不能超过 2MB!')
        return
      }
      try {
        const formdata = new FormData()
        formdata.append('file', file)
        const result = await uploadFile(formdata)
        if (result.code === 200) {
          send(result.data, 'file')
        } else {
          Toast('上传失败')
        }
        fileRef.value.value = ''
      } catch (error) {
        console.error(error)
      }
    }
    const emojiClick = () => {
      emit('emojiShow')
    }
    const addEmoji = e => {
      state.message += e
    }
    const onCancel = () => {
      Toast('取消')
    }
    const onSelect = item => {
      // 默认情况下点击选项时不会自动收起
      // 可以通过 close-on-click-action 属性开启自动收起

      if (item.name === '图片') {
        chooseImageRef.value.click()
      } else if (item.name === '文件') {
        fileRef.value.click()
      }
    }
    const checkIsMyFriends = async() => {
      const data = {
        roomId: route.params.id
      }
      const res = await checkIsFriends(data)
      state.isMyFriend = res.data.isFriends
      return state.isMyFriend
    }
    const handleImageChange = async() => {
      const file = chooseImageRef.value.files[0]
      if (file.type.indexOf('image') === -1) {
        Toast('只能上传图片!')
        return
      }
      const isLt1M = file.size / 1024 / 1024 < 1
      if (!isLt1M) {
        Toast('图片大小不能超过 1MB!')
        return
      }
      const formdata = new FormData()
      formdata.append('file', file)
      const result = await uploadFile(formdata)
      if (result.code === 200) {
        send(result.data, 'img')
      } else {
        Toast('上传失败')
      }
      chooseImageRef.value.value = ''
    }
    const send = async(params, type = 'mess') => {
      // 发送消息
      if (!state.message && !params) {
        return
      }
      if (route.params.id.split('-').length > 1) {
        const flag = await checkIsMyFriends()
        if (!flag) {
          Notify({ type: 'warning', message: '你已经不是对方好友了！', background: '#e00011' })
          return
        }
      }
      const val = {
        userName: userInfo.value.userName,
        mes: state.message,
        time: formatTime(new Date()),
        avatar: userInfo.value.avatar,
        nickname: userInfo.value.nickname,
        read: [userInfo.value.userName],
        roomId: route.params.id,
        style: 'mess',
        self: userInfo.value.id
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
      emit('chatList', Object.assign({}, val, { type: 'mine' }))
      emit('emojiShow', false)
      socket.emit('mes', val)
      if (type === 'mess') {
        // 清空输入框
        state.message = ''
      }
    }
    watch(
      () => state.message,
      (newval, oldval) => {
        if (state.message === '') {
          state.upFlag = false
        } else {
          state.upFlag = true
        }
      }
    )
    return {
      ...toRefs(state),
      fileChange,
      emojiClick,
      onCancel,
      onSelect,
      handleImageChange,
      send,
      addEmoji,
      chooseImageRef,
      fileRef
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
    height: 40px;
    margin-bottom: 2px;
    text-align: center;
    line-height: 40px;
    color: $fontWhite;
    input {
      display: inline-block;
      width: 100%;
      box-sizing: border-box;

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
      bottom: -2px;
      .vant-icon {
        color: #939ba6;
        font-size: 35px;
      }
    }
  }
}
</style>
