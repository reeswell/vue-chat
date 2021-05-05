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
      <img v-if="imgSrc" class="img" :src="imgSrc" alt="" />
      <img v-else class="img" src="https://img.yzcdn.cn/vant/cat.jpeg " alt="" />
    </van-uploader>
    <div class="edit-container">
      <van-cell title="邮箱" is-link :value="userInfo.email" @click="goEmail" />
      <van-cell title="名字" is-link :value="userInfo.nickname" @click="goName" />
      <van-cell title="性别" is-link :value="userInfo.gender" @click="goGender" />
      <van-cell title="年龄" is-link :value="userInfo.age" @click="goAge" />
      <van-cell title="城市" is-link @click="showPopup" :value="area"></van-cell>
      <div class="sign-out" @click="logout">退出登录</div>

      <van-popup v-model="show" position="bottom" :style="{height: '38%'}">
        <van-area
          :area-list="areaList"
          :columns-num="2"
          ref="myArea"
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
import {mapGetters, mapState} from 'vuex'
import AreaList from '@/utils/area'
export default {
  name: 'Edit',

  data() {
    return {
      show: false,
      area: '',
      areaList: AreaList,
      IMG_URL: process.env.VUE_APP_IMG_URL,
      fileList: [],
      avatorImg: {},
      urlName: '',
      imgSrc: '',
      show: false
    }
  },
  computed: {
    ...mapState(['userInfo']),
    ...mapGetters(['getAllChatListRoomId'])
  },
  created() {
    this.imgSrc = this.IMG_URL + this.userInfo.avatar
    this.area = this.userInfo.province + ' ' + this.userInfo.city
    console.log(this.getAllChatListRoomId)
  },
  methods: {
    beforeRead(file) {
      const url = window.URL || window.webkitURL || window.mozURL
      const src = url.createObjectURL(file) // 本地临时的地址
      this.imgSrc = src
      return true
    },
    logout() {
      this.$dialog
        .confirm({
          title: '提示',
          message: '您确定退出账号吗？',
          confirmButtonText: '确定',
          confirmButtonColor: '#b532e9'
        })
        .then(() => {
          // 删除本地用户 token && 刷新组件
          this.$store.dispatch('logOut')
          this.$router.push({name: 'Login'})
        })
        .catch(error => {
          console.log(error)
        })
    },
    async afterRead(file) {
      const formdata = new window.FormData()
      formdata.append('file', file.file)

      const {data} = await this.$api.uploadFile(formdata)
      this.urlName = data
      this.imgSrc = this.IMG_URL + data
      this.$nextTick(() => {
        this.$refs.fileListRef.deleteFile(file, 0)
      })
    },
    // 弹出层显示
    showPopup() {
      this.show = true
    },
    //value=0改变省，1改变市，2改变区
    onChange(picker, index, value) {
      let val = picker.getValues()
      let areaName = ''
      for (var i = 0; i < val.length; i++) {
        areaName = areaName + (i == 0 ? '' : ' ') + val[i].name
      }
      this.area = areaName
    },
    //确定选择城市
    onConfirm(val) {
      this.show = false //关闭弹框
    },
    //取消选中城市
    onCancel() {
      this.show = false
      this.$refs.myArea.reset() // 重置城市列表
    },
    async saveNewUserInfo() {
      console.log(this.area.split(' '))
      const unlink = this.userInfo.avatar
      try {
        const obj = {
          area: this.area.split(' '),
          avatar: this.urlName,
          unlink
        }
        const {data} = await this.$api.updateUserInfo(obj)
        const parma = {id: data.id}
        await this.$api.updateUserConversations(parma)

        this.$store.dispatch('setUserInfo', data)
        const roomArr = this.getAllChatListRoomId
        this.$socket.emit('update', roomArr)

        this.$router.push({name: 'Manager'})
      } catch (error) {
        console.log(error)
      }
    },
    onClickLeft() {
      this.$router.go(-1)
    },

    goEmail() {
      this.$router.push({name: 'EditEmail'})
    },
    goName() {
      this.$router.push({name: 'EditName'})
    },
    goGender() {
      this.$router.push({name: 'EditGender'})
    },
    goAge() {
      this.$router.push({name: 'EditAge'})
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
