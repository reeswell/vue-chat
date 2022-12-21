<template>
  <div class="account-safe">
    <van-nav-bar left-text="返回" title="账户安全" left-arrow @click-left="onClickLeft" />
    <van-cell title="修改手机号码" is-link :value="userInfo.mobilePhone" class="first-cell" @click="goPhone" />

    <van-cell title="修改密码" is-link @click="goPassword" />
  </div>
</template>

<script>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
export default {
  name: 'AccountSafe',
  setup() {
    const router = useRouter()
    const store = useStore()
    const userInfo = computed(() => {
      return store.state.userInfo
    })
    const onClickLeft = () => {
      router.go(-1)
    }
    const goPhone = () => {
      router.push({ name: 'EditPhone' })
    }
    const goPassword = () => {
      router.push({ name: 'EditPassword' })
    }
    return {
      userInfo,
      onClickLeft,
      goPhone,
      goPassword
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/color.scss';

.account-safe {
  min-height: 100vh;
  max-height: 100vh;
  background-color: $deepBgc;
  .first-cell {
    margin-top: 10px;
  }
  .van-nav-bar {
    background-color: $deepBgc;
  }

  .van-cell {
    background-color: $lightBgc;
    color: $fontGray;
  }
}
</style>
