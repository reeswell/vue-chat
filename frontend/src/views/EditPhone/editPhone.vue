<template>
  <div class="edit-phone">
    <van-nav-bar left-text="返回" title="设置手机号" left-arrow @click-left="onClickLeft" />
    <div class="form-container">
      <!-- 手机号 -->

      <div class="input-wrapper">
        <van-field
          type="text"
          class="mobile-phone"
          v-model="mobilePhone"
          maxlength="11"
          placeholder="现在的手机号码"
          :error-message="!phoneValid ? '请输入正确的电话号码！' : ''"
          autocomplete="off"
        />
      </div>
      <!-- 短信验证码 -->
      <div class="input-wrapper">
        <input type="text" class="sms" v-model="smsCode" maxlength="6" placeholder="短信验证码" autocomplete="off" />
        <van-button type="primary" class="send-sms" size="normal" v-if="!countdownText" @click="sendSMSCode"
          >获取验证码</van-button
        >
        <van-button type="primary" class="send-sms" size="normal" v-else>{{ countdownText }}s后再试</van-button>
      </div>
      <div class="input-wrapper">
        <van-field
          type="text"
          class="mobile-phone"
          v-model="newMobilePhone"
          maxlength="11"
          placeholder="新手机号码"
          :error-message="!phoneValid2 ? '请输入正确的电话号码！' : ''"
          autocomplete="off"
        />
      </div>
    </div>
    <van-button type="primary" size="large" class="btn" round @click="submit">确认修改</van-button>
  </div>
</template>

<script>
import {reactive, toRefs} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {useStore} from 'vuex'
import {Toast} from 'vant'

import api from '@/api'
let timer
const reg = /^1[3|4|5|7|8]\d{9}$/
export default {
  name: 'EditPhone',
  setup() {
    const router = useRouter()
    const store = useStore()
    const state = reactive({
      value: '',
      smsCode: '', // 短信验证码
      mobilePhone: store.state.userInfo.mobilePhone || '', // 手机号
      newMobilePhone: '',
      countdownText: '', // 倒计时文本
      cDTime: 60 // 60 秒倒计时
    })
    const phoneValid = () => {
      return reg.test(state.mobilePhone)
    }
    const phoneValid2 = () => {
      return reg.test(state.newMobilePhone)
    }
    const onClickLeft = () => {
      router.go(-1)
    }
    const submit = async () => {
      try {
        if (!state.smsCode) return Toast('请输入短信验证码')
        if (!phoneValid || !phoneValid2) return
        if (state.mobilePhone !== store.state.userInfo.mobilePhone) return Toast('原手机号码不正确')
        const obj = {mobilePhone: state.mobilePhone, newMobilePhone: state.newMobilePhone, smsCode: state.smsCode}
        const {data} = await api.updatedUserPhone(obj)
        clearInterval(timer)

        store.dispatch('setUserInfo', data)
        router.push({name: 'Manager'})
      } catch (error) {
        console.log(error)
      }
    }
    const sendSMSCode = async () => {
      try {
        const res = await api.sendSMSCode(state.mobilePhone)
        if (res.code === 200) {
          // 免费短信服务次数用完，就以弹框方式发送
          Toast(res.msg)
          state.smsCode = res.smsCode
          state.cDTime = 60 // 首先恢复为 60 s
          timer = setInterval(() => {
            if (state.cDTime <= 0) {
              state.countdownText = ''
              clearInterval(timer) // 清除定时器
              return
            }
            state.countdownText = state.cDTime--
          }, 1000)
        } else if (res.code === 4010) {
          timer = setInterval(() => {
            if (res.time <= 0) {
              state.countdownText = ''
              clearInterval(timer)
              state.cDTime = 60
              return
            }
            state.countdownText = res.time--
          }, 1000)
        }
        // 反馈消息
      } catch (error) {
        console.log(error)
      }
    }
    return {
      ...toRefs(state),
      phoneValid,
      phoneValid2,
      onClickLeft,
      submit,
      sendSMSCode
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/color.scss';

.edit-phone {
  min-height: 100vh;
  max-height: 100vh;
  width: 100%;
  text-align: center;
  background-color: $deepBgc;

  .van-nav-bar {
    background-color: $lightBgc;
  }
  .form-container {
    margin: 20px auto;
    width: 85%;
    box-sizing: border-box;
    border-radius: 10px;
    padding-left: 5px;
    padding-top: 10px;
    background: $deepBgc;
    box-shadow: -2px 3px 23px 1px rgba(0, 0, 0, 0.1);
    :deep .van-field__control::-webkit-input-placeholder {
      font-size: 20px;
    }
    .input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
      padding-top: 12px;
      background: $deepBgc;
      .van-cell {
        background-color: $lightBgc;
        color: $fontGray;
      }
      .mobile-phone,
      .sms {
        padding-left: 10px;
        flex: 1;
        width: 0;
        height: 60px;
        font-size: 24px;
        letter-spacing: 2px;
        color: $fontWhite;
        background-color: $lightBgc;

        caret-color: $blueBgc;
        -webkit-caret-color: $blueBgc;
        -moz-caret-color: $blueBgc;
        -o-caret-color: $blueBgc;
        -ms-caret-color: $blueBgc;
        &::-webkit-input-placeholder {
          color: $fontGray;
          font-size: 14px;
          letter-spacing: 2px;
        }
      }
      .sms {
        margin-right: 10px;
      }
      .pic-code {
        flex-basis: 30%;
      }
      &::before {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        content: '';
        height: 2px;
        background: rgba(0, 0, 0, 0.1);
      }
      &::after {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        content: '';
        height: 2px;
        background: $blue;
        transform: scaleX(0);
        transition: transform 200ms cubic-bezier(0, 0, 0.2, 1) 0ms;
      }
    }
  }
  .btn {
    width: 80%;
  }
}
</style>
