<template>
  <div class="edit">
    <van-nav-bar
      left-text="返回"
      right-text="保存"
      left-arrow
      @click-left="onClickLeft"
      @click-right="saveNewUserInfo"
    />
    <van-uploader
      ref="fileListRef"
      v-model="fileList"
      :before-read="beforeRead"
      :after-read="afterRead"
      :preview-full-image="false"
      :deletable="false"
      :max-count="1"
    >
      <img v-if="imgSrc" v-lazy="imgSrc" class="img" alt="">
      <img v-else v-lazy="errorImg" class="img" alt="">
    </van-uploader>
    <div class="edit-container">
      <van-cell title="邮箱" is-link :value="userInfo.email" @click="goEmail" />
      <van-cell title="名字" is-link :value="userInfo.nickname" @click="goName" />
      <van-cell title="性别" is-link :value="userInfo.gender" @click="goGender" />
      <van-cell title="年龄" is-link :value="userInfo.age" @click="goAge" />
      <van-cell title="城市" is-link :value="area" @click="showPopup" />
      <div class="sign-out" @click="logout">退出登录</div>
      <van-popup v-model:show="show" position="bottom" :style="{height: '38%'}">
        <van-area
          ref="myAreaRef"
          :area-list="areaList"
          :columns-num="2"
          title="标题"
          @change="onChange"
          @confirm="onConfirm"
          @cancel="onCancel"
        />
      </van-popup>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs, nextTick, ref, computed, inject, onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { updateUserConversations, updateUserInfo } from '@/api/user'
import { uploadFile } from '@/api/upload'
import { Dialog } from 'vant'
import AreaList from '@/utils/area'

export default {
  name: 'Edit',

  setup() {
    const myAreaRef = ref(null)
    const fileListRef = ref(null)
    const socket = inject('socket')
    const router = useRouter()
    const store = useStore()
    const state = reactive({
      show: false,
      areaList: AreaList,
      IMG_URL: process.env.VUE_APP_IMG_URL,
      fileList: [],
      avatorImg: {},
      urlName: '',
      area: '',
      imgSrc: '',
      errorImg: 'https://img.yzcdn.cn/vant/cat.jpeg',
      userInfo: computed(() => {
        return store.state.userInfo
      }),
      getAllChatListRoomId: computed(() => {
        return store.getters.getAllChatListRoomId
      })
    })
    onBeforeMount(() => {
      state.area = state.userInfo.province + ' ' + state.userInfo.city
      state.imgSrc = state.IMG_URL + state.userInfo.avatar
    })

    const beforeRead = file => {
      const url = window.URL || window.webkitURL || window.mozURL
      const src = url.createObjectURL(file) // 本地临时的地址
      state.imgSrc = src
      return true
    }
    const logout = () => {
      Dialog.confirm({
        title: '提示',
        message: '您确定退出账号吗？',
        confirmButtonText: '确定',
        confirmButtonColor: '#b532e9'
      })
        .then(() => {
          // 删除本地用户 token && 刷新组件
          store.dispatch('logOut')
          router.push({ name: 'Login' })
        })
        .catch(error => {
          console.log(error)
        })
    }
    const afterRead = async file => {
      const formdata = new window.FormData()
      formdata.append('file', file.file)

      const { data } = await uploadFile(formdata)
      state.urlName = data
      state.imgSrc = state.IMG_URL + data
      nextTick(() => {
        fileListRef.deleteFile(file, 0)
      })
    }
    // 弹出层显示
    const showPopup = () => {
      state.show = true
    }
    // value=0改变省，1改变市，2改变区
    const onChange = areaVal => {
      let areaName = ''
      for (var i = 0; i < areaVal.length; i++) {
        areaName = areaName + (i === 0 ? '' : ' ') + areaVal[i].name
      }
      state.area = areaName
    }
    // 确定选择城市
    const onConfirm = val => {
      state.show = false // 关闭弹框
    }
    // 取消选中城市
    const onCancel = () => {
      state.show = false
      myAreaRef.reset() // 重置城市列表
    }
    const saveNewUserInfo = async() => {
      const unlink = state.userInfo.avatar
      try {
        const obj = {
          area: state.area.split(' '),
          avatar: state.urlName,
          unlink
        }
        const { data } = await updateUserInfo(obj)
        const parma = { id: data.id }
        await updateUserConversations(parma)

        store.dispatch('setUserInfo', data)
        const roomArr = state.getAllChatListRoomId
        socket.emit('update', roomArr)

        router.push({ name: 'Manager' })
      } catch (error) {
        console.log(error)
      }
    }
    const onClickLeft = () => {
      router.go(-1)
    }

    const goEmail = () => {
      router.push({ name: 'EditEmail' })
    }
    const goName = () => {
      router.push({ name: 'EditName' })
    }
    const goGender = () => {
      router.push({ name: 'EditGender' })
    }
    const goAge = () => {
      router.push({ name: 'EditAge' })
    }

    return {
      ...toRefs(state),
      myAreaRef,
      fileListRef,
      beforeRead,
      logout,
      afterRead,
      showPopup,
      onChange,
      onConfirm,
      onCancel,
      saveNewUserInfo,
      onClickLeft,
      goEmail,
      goName,
      goGender,
      goAge
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/color.scss';

.edit {
  overflow: hidden;
  min-height: 100vh;
  max-height: 100vh;
  background-color: $deepBgc;
  width: 100%;
  .van-cell {
    background-color: $lightBgc;
    color: $fontGray;
  }
  .van-cell::after {
    border-bottom: 1px solid $fontGray;
  }
  .van-nav-bar {
    background: transparent;
  }
  .van-hairline--bottom::after {
    border-bottom-width: 0;
  }
  .van-tag--default {
    background-color: $fontWhite;
  }
  .van-uploader {
    z-index: 1;
    top: -30px;
    left: 50%;
    transform: translateX(-50%);
    .img {
      width: 150px;
      height: 150px;
      border-radius: 50%;
    }
  }
  .edit-container {
    position: relative;
    top: -20px;
  }
  .sign-out {
    margin-top: 20px;
    line-height: 45px;
    color: $fontWhite;
    background-color: $lightBgc;
    text-align: center;
  }
  .sign-out:active {
    color: red;
  }
}
</style>
