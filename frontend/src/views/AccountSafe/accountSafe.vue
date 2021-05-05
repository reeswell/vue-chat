<template>
  <div class="account-safe">
    <van-nav-bar left-text="返回" title="账户安全" left-arrow @click-left="onClickLeft" />
    <van-cell title="修改手机号码" is-link :value="userInfo.mobilePhone" @click="goPhone" class="first-cell" />

    <van-cell title="修改密码" is-link @click="goPassword" />
  </div>
</template>

<script>
import {mapState} from 'vuex'

export default {
  name: 'AccountSafe',
  data() {
    return {}
  },
  computed: {
    ...mapState(['userInfo'])
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1)
    },
    goPhone() {
      this.$router.push({name: 'EditPhone'})
    },
    goPassword() {
      this.$router.push({name: 'EditPassword'})
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
