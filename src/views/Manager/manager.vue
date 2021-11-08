<template>
  <div class="setting">
    <div class="blank"></div>
    <div class="perspn-info" @click="goEdit">
      <div class="avatar">
        <img v-lazy="IMG_URL + userInfo.avatar" alt="" />
      </div>
      <div class="info-detail">
        <p class="name">账号: {{ userInfo.userName }}</p>
        <p class="mobilePhone">手机号: {{ userInfo.mobilePhone }}</p>
        <p class="email">邮箱: {{ userInfo.email }}</p>
      </div>
      <i class="my-icon van-icon van-icon-arrow van-cell__right-icon"></i>
    </div>

    <div class="item-cell">
      <div class="cell van-hairline--bottom" @click="goSelf">
        <div class="pic">
          <img v-lazy="imgList.memo" alt="" />
        </div>
        <p class="title">备忘录</p>
        <i class="item-icon van-icon van-icon-arrow van-cell__right-icon"></i>
      </div>
      <div class="cell van-hairline--bottom" @click="goSafe">
        <div class="pic">
          <img v-lazy="imgList.accountSafe" alt="" />
        </div>
        <p class="title">账户安全</p>
        <i class="item-icon van-icon van-icon-arrow van-cell__right-icon"></i>
      </div>
      <div class="cell" @click="goSysMes">
        <div class="pic">
          <img v-lazy="imgList.sysMes" alt="" />
        </div>
        <p class="title">系统信息</p>
        <van-badge :content="getSysUnReadCount" max="99" class="my-badge" />
        <i class="item-icon van-icon van-icon-arrow van-cell__right-icon"></i>
      </div>
    </div>
    <footer-nav></footer-nav>
  </div>
</template>

<script>
import {reactive, toRefs, computed} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {useStore} from 'vuex'
import footerNav from '@/components/footerNav'

export default {
  name: 'Manager',
  components: {footerNav},

  setup() {
    const route = useRoute()
    const router = useRouter()
    const store = useStore()

    const state = reactive({
      IMG_URL: process.env.VUE_APP_IMG_URL,
      imgList: {
        memo: 'https://cdn.jsdelivr.net/gh/xxydrr/my_pic/img/20210606172321.png',
        accountSafe: 'https://cdn.jsdelivr.net/gh/xxydrr/my_pic/img/20210606172320.png',
        sysMes: 'https://cdn.jsdelivr.net/gh/xxydrr/my_pic/img/20210606172319.png'
      },
      userInfo: computed(() => {
        return store.state.userInfo
      }),

      getSysUnReadCount: computed(() => {
        return store.getters.getSysUnReadCount
      })
    })

    const goEdit = () => {
      router.push({name: 'Edit'})
    }
    const goSysMes = () => {
      router.push({name: 'SysMes'})
    }
    const goSelf = () => {
      const id = state.userInfo.id
      router.push({name: 'MesPanel', params: {id: id}})
    }
    const goSafe = () => {
      router.push({name: 'AccountSafe'})
    }
    return {
      ...toRefs(state),
      goEdit,
      goSysMes,
      goSelf,
      goSafe
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/color.scss';

.setting {
  background-color: $deepBgc;
  color: $fontWhite;
  height: 100%;
  width: 100%;
  .blank {
    box-sizing: border-box;
    height: 50px;
    width: 100%;
  }
  .perspn-info {
    // margin-top: 50px;
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
      .mobilePhone,
      .email {
        margin-top: 6px;
      }
      p {
        margin-bottom: 0;
      }
      .name {
        margin-top: 0;
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
