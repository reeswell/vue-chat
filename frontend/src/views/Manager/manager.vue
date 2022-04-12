<template>
  <div class="setting">
    <div class="perspn-info" @click="goEdit">
      <div class="avatar">
        <img :src="IMG_URL + userInfo.avatar" alt="" />
      </div>
      <div class="info-detail">
        <p class="name">账号: {{ userInfo.userName }}</p>
        <p class="phone">手机号: {{ userInfo.mobilePhone }}</p>
        <p class="email">邮箱: {{ userInfo.email }}</p>
      </div>
      <i class="my-icon van-icon van-icon-arrow van-cell__right-icon"></i>
    </div>

    <div class="item-cell">
      <div class="cell van-hairline--bottom" @click="goSelf">
        <div class="pic">
          <img src="../../assets/imgs/Saved Message.png" alt="" />
        </div>
        <p class="title">备忘录</p>
        <i class="item-icon van-icon van-icon-arrow van-cell__right-icon"></i>
      </div>
      <div class="cell van-hairline--bottom" @click="goSafe">
        <div class="pic">
          <img src="../../assets/imgs/Privacy and Storage.png" alt="" />
        </div>
        <p class="title">账户安全</p>
        <i class="item-icon van-icon van-icon-arrow van-cell__right-icon"></i>
      </div>
      <div class="cell" @click="goSysMes">
        <div class="pic">
          <img src="../../assets/imgs/Nofifications and Sounds.png" alt="" />
        </div>
        <p class="title">系统信息</p>
        <van-badge :content="getSysUnReadCount" max="99" class="my-badge" />
        <i class="item-icon van-icon van-icon-arrow van-cell__right-icon"></i>
      </div>
    </div>
  </div>
</template>

<script>
import {mapState, mapGetters} from 'vuex'

export default {
  name: 'Manager',
  data() {
    return {
      IMG_URL: process.env.VUE_APP_IMG_URL
    }
  },
  computed: {
    ...mapState(['userInfo']),
    ...mapGetters(['getSysUnReadCount'])
  },
  methods: {
    goEdit() {
      this.$router.push({name: 'Edit'})
    },
    goSysMes() {
      this.$router.push({name: 'SysMes'})
    },
    goSelf() {
      const id = this.userInfo.id
      this.$router.push({name: 'MesPanel', params: {id: id}})
    },
    goSafe() {
      this.$router.push({name: 'AccountSafe'})
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/color.scss';

.setting {
  background-color: $deepBgc;
  color: $fontWhite;
  .perspn-info {
    margin-top: 50px;
    display: flex;
    align-items: center;
    padding: 15px 10px;
    box-sizing: border-box;
    height: 100px;
    background-color: $lightBgc;
    .avatar {
      img {
        border-radius: 50%;
        width: 70px;
        height: 70px;
        background-color: #666;
      }
    }

    .info-detail {
      flex: 1;
      flex-direction: column;
      justify-content: center;
      margin-left: 10px;
      font-size: 14px;
      .phone,
      .email {
        margin-top: 6px;
      }
    }
    .my-icon {
      width: 10px;
      height: 10px;
      top: -5px;
    }
  }
  .item-cell {
    background-color: $lightBgc;
    margin-top: 20px;
    .cell {
      display: flex;
      height: 50px;
      box-sizing: border-box;
      align-items: center;
      padding: 5px 10px;
      .pic {
        img {
          width: 30px;
          height: 30px;
        }
      }
      .title {
        margin-left: 10px;
      }
      .my-badge {
        position: absolute;
        right: 30px;
      }
      .item-icon {
        position: absolute;
        right: 10px;
      }
    }
  }
}
</style>
