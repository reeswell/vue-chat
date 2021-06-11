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
    <van-button type="primary" size="large" class="btn" round @click="submit">确认修改</van-button>
  </div>
</template>

<script>
import {reactive, toRefs, computed} from 'vue'
import {useRouter} from 'vue-router'
import {Toast} from 'vant'

import api from '@/api'
const reg = /^[\w_-]{6,16}$/
export default {
  name: 'EditPassword',
  setup() {
    const router = useRouter()
    const state = reactive({
      password: '',
      newPassword: '',
      surePassword: ''
    })
    const passwordValid = computed(() => {
      return reg.test(state.password)
    })
    const passwordValid2 = computed(() => {
      return reg.test(state.newPassword)
    })
    const surePwdValid = computed(() => {
      return state.newPassword === state.surePassword
    })

    const onClickLeft = () => {
      router.go(-1)
    }
    const submit = async () => {
      try {
        if (!passwordValid && !passwordValid2 && !surePwdValid) return
        const obj = {password: state.password, newPassword: state.newPassword}
        const {msg} = await api.updatedUserPassword(obj)
        Toast(msg)
        setTimeout(() => router.push({name: 'Manager'}), 2000)
      } catch (error) {
        console.log(error)
      }
    }
    return {
      ...toRefs(state),
      passwordValid,
      passwordValid2,
      surePwdValid,
      onClickLeft,
      submit
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
    :deep .van-field__control::-webkit-input-placeholder {
      font-size: 16px;
    }
  }
  .btn {
    width: 80%;
  }
}
</style>
