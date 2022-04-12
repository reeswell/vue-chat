<template>
  <div class="edit-password">
    <van-nav-bar left-text="返回" title="设置密码" left-arrow @click-left="onClickLeft" />
    <div class="form-container">
      <van-field
        v-model="password"
        type="password"
        label="输入旧密码"
        :error-message="!passwordValid ? '请输入6～16位字母数字和符号' : ''"
        placeholder="请输入密码"
        required
      />

      <van-field
        v-model="newPassword"
        type="password"
        label="输入新密码"
        :error-message="!passwordValid2 ? '请输入6～16位字母数字和符号' : ''"
        placeholder="请输入密码"
        required
      />
      <van-field
        v-model="surePassword"
        type="password"
        label="确认新密码"
        placeholder="确认新密码"
        :error-message="surePwdValid ? '' : '两次输入密码不一致'"
        required
      />
    </div>
    <van-button type="info" size="large" class="btn" round @click="submit">确认修改</van-button>
  </div>
</template>

<script>
const reg = /^[\w_-]{6,16}$/
export default {
  name: 'EditPassword',
  data() {
    return {
      password: '',
      newPassword: '',
      surePassword: ''
    }
  },
  created() {},
  computed: {
    passwordValid() {
      return reg.test(this.password)
    },
    passwordValid2() {
      return reg.test(this.newPassword)
    },
    surePwdValid() {
      return this.newPassword === this.surePassword
    }
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1)
    },
    async submit() {
      try {
        if (!this.passwordValid && !this.passwordValid2 && !this.surePwdValid) return
        const obj = {password: this.password, newPassword: this.newPassword}
        const {msg} = await this.$api.updatedUserPassword(obj)
        this.$toast(msg)
        setTimeout(() => this.$router.push({name: 'Manager'}), 2000)
      } catch (error) {
        console.error(error)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/color.scss';

.edit-password {
  min-height: 100vh;
  max-height: 100vh;
  width: 100%;
  text-align: center;
  background-color: $deepBgc;

  .van-nav-bar {
    background-color: $deepBgc;
  }

  .van-cell {
    background-color: $lightBgc;
    color: $fontGray;
  }
  .form-container {
    margin: 20px auto;
    width: 90%;
    box-sizing: border-box;
    border-radius: 10px;
    padding-left: 5px;
    padding-top: 10px;
    background: $lightBgc;
    box-shadow: -2px 3px 23px 1px rgba(0, 0, 0, 0.1);
    ::v-deep .van-field__control::-webkit-input-placeholder {
      font-size: 16px;
    }
  }
  .btn {
    width: 80%;
  }
}
</style>
