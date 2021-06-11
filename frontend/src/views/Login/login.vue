<template>
  <div class="login">
    <!-- 登录 -->
    <div class="top-tip">
      <div class="login-entry">
        <span @click="switchForm('login')" :class="isActive ? '' : 'font-active'">登录</span>
        <span>或</span>
        <span @click="switchForm('register')" :class="isActive ? 'font-active' : ''">注册</span>
      </div>
    </div>
    <transition name="login-slide">
      <div class="form-container" v-if="switchFlag === 'login'">
        <!-- 手机号码 -->
        <div class="input-wrapper" :class="[focusIndex === 1 ? 'focus-a' : '']">
          <van-icon name="manager" class="icon" />

          <input
            type="text"
            class="mobile-phone"
            @focus="handleFocus(1)"
            @blur="handleBlur"
            v-model="userName"
            maxlength="11"
            placeholder="用户名/手机号码"
            autocomplete="off"
          />
        </div>
        <!-- 密码 -->
        <div class="input-wrapper" :class="[focusIndex === 2 ? 'focus-a' : '']">
          <van-icon name="lock" class="icon" />

          <input
            type="password"
            class="u-password"
            @focus="handleFocus(2)"
            @blur="handleBlur"
            v-model="password"
            maxlength="10"
            placeholder="密码"
            autocomplete="off"
          />
        </div>
        <!-- 图形验证码 -->
        <div class="input-wrapper" :class="[focusIndex === 3 ? 'focus-a' : '']">
          <input
            type="text"
            class="verify-code"
            @focus="handleFocus(3)"
            @blur="handleBlur"
            v-model="verifyCode"
            maxlength="4"
            placeholder="验证码"
            autocomplete="off"
          />
          <div @click="updatePicCode">
            <img class="pic-code" v-lazy="picCode" title="看不清？点击刷新" />
          </div>
        </div>
        <!-- 登录按钮 -->
        <van-button
          v-if="!isLoading"
          round
          size="large"
          color="#007aff"
          @click="handleLogin"
          text="登录"
          class="login-btn"
        />
        <van-button
          v-else
          size="large"
          loading
          loading-type="spinner"
          loading-text="正在登录 ..."
          color="#007aff"
          class="login-btn"
        />
      </div>
    </transition>

    <!-- 注册 -->
    <transition name="reg-slide">
      <div class="form-container" v-if="switchFlag === 'register'">
        <!-- 用户名 -->

        <div class="input-wrapper" :class="[focusIndex === 1 ? 'focus-a' : '']">
          <!-- <van-icon name="user" class="icon" /> -->
          <van-icon name="manager" class="icon" />

          <input
            type="text"
            class="u-name"
            @focus="handleFocus(1)"
            @blur="handleBlur"
            v-model="userName"
            maxlength="12"
            placeholder="用户名"
            autocomplete="off"
          />
        </div>
        <!-- 密码 -->
        <div class="input-wrapper" :class="[focusIndex === 2 ? 'focus-a' : '']">
          <van-icon name="lock" class="icon" />
          <input
            type="password"
            class="u-password"
            @focus="handleFocus(2)"
            @blur="handleBlur"
            v-model="password"
            maxlength="10"
            placeholder="密码"
            autocomplete="off"
          />
        </div>
        <!-- 手机号 -->
        <div class="input-wrapper" :class="[focusIndex === 3 ? 'focus-a' : '']">
          <!-- <van-icon name="phone-circle" class="icon" /> -->
          <van-icon name="phone" class="icon" />
          <input
            type="text"
            class="mobile-phone"
            @focus="handleFocus(3)"
            @blur="handleBlur"
            v-model="mobilePhone"
            maxlength="11"
            placeholder="手机号码"
            autocomplete="off"
          />
        </div>
        <!-- 短信验证码 -->
        <div class="input-wrapper" :class="[focusIndex === 4 ? 'focus-a' : '']">
          <van-icon name="comment-circle" class="icon" />
          <input
            type="text"
            class="sms"
            @focus="handleFocus(4)"
            @blur="handleBlur"
            v-model="smsCode"
            maxlength="6"
            placeholder="短信验证码"
            autocomplete="off"
          />
          <van-button type="primary" class="send-sms" size="small" v-if="!countdownText" @click="handleSendSMSCode"
            >获取验证码</van-button
          >
          <van-button type="primary" class="send-sms" size="small" v-else>{{ countdownText }}s后再试</van-button>
        </div>
        <!-- 注册按钮 -->
        <van-button
          v-if="!isLoading"
          round
          size="large"
          color="#007aff"
          @click="handleRegister"
          text="注册"
          class="login-btn"
        />
        <van-button
          v-else
          size="large"
          loading
          loading-type="spinner"
          loading-text="正在注册 ..."
          color="#007aff"
          class="login-btn"
        />
      </div>
    </transition>
  </div>
</template>

<script>
let timer
import {reactive, toRefs, nextTick, onMounted, computed} from 'vue'
import {useRouter} from 'vue-router'
import {useStore} from 'vuex'
import api from '@/api'

import {Toast} from 'vant'

export default {
  name: 'Login',
  setup() {
    const router = useRouter()
    const store = useStore()

    const state = reactive({
      switchFlag: 'login', // 登录: 1, 注册: 2
      focusIndex: 0, // 输入框聚焦索引
      userName: '', // 用户名
      password: '', // 密码
      mobilePhone: '', // 手机号
      verifyCode: '', // 图形验证码
      smsCode: '', // 短信验证码
      isLoading: false, // 登录 或 注册按钮状态
      countdownText: '', // 倒计时文本
      cDTime: 60, // 60 秒倒计时
      isActive: true,
      picCode: ''
    })
    onMounted(() => {
      nextTick(() => updatePicCode())
    })
    const handleFocus = index => {
      state.focusIndex = index
    }
    // 处理输入框失焦
    const handleBlur = () => {
      state.focusIndex = 0
    }
    const switchForm = flag => {
      flag === 'login' ? (state.isActive = true) : (state.isActive = false)
      state.switchFlag = flag
      state.switchFlag === 'login' && nextTick(() => updatePicCode())
      state.focusIndex = 0 // 重置表单索引
      let resetData = ['userName', 'password', 'verifyCode', 'mobilePhone', 'smsCode']
      for (let item of resetData) {
        state[item] = ''
      }
      state.isLoading = false // 重置登录 或 注册按钮状态
    }
    // 表单验证
    const checkForm = flag => {
      let toast = text => {
        Toast(text)
        return false
      }

      switch (flag) {
        case 1:
          if (!state.userName) return toast('请输入用户名')
          if (!state.password) return toast('请输入密码')
          if (!state.verifyCode) return toast('请输入验证码')
          break
        case 2:
          if (!state.userName) return toast('请输入用户名')
          if (state.userName.length > 12 || state.userName.length < 3) return toast('请输入3-12位的用户名')
          if (!state.password) return toast('请输入密码')
          if (state.mobilePhone.length != 11 || !/^[1][3,4,5,7,8][0-9]{9}$/.test(state.mobilePhone))
            return toast('请输入正确的手机号码')
          if (!state.smsCode) return toast('请输入短信验证码')
          break
      }
      return true
    }
    // 注册
    const handleRegister = async () => {
      if (!checkForm(2)) return
      state.isLoading = true // 按钮加载状态
      const {userName, password, mobilePhone, smsCode} = state
      const data = {userName, password, mobilePhone, smsCode}
      // console.log(data);
      try {
        const res = await api.register(data)
        state.isLoading = false
        state.countdownText = ''
        clearInterval(timer)
        setTimeout(() => switchForm('login'), 1000)
      } catch (error) {
        state.isLoading = false
        console.log(error)
      }
    }
    // 登录
    const handleLogin = async () => {
      if (!checkForm(1)) return
      state.isLoading = true // 按钮加载状态
      const {userName, password, verifyCode} = state
      const data = {userName, password, verifyCode}
      try {
        const res = await api.login(data)
        // console.log(res)
        store.dispatch('setUserInfo', res.data)
        store.dispatch('getUserInfo') //保存个人信息在localstorage
        store.dispatch('setUserToken', res.token)

        setTimeout(() => router.push({name: 'Chat'}), 1000)
      } catch (error) {
        console.log(error)
      } finally {
        state.isLoading = false // 重置按钮状态
      }
    }
    // 发送短信验证码
    const handleSendSMSCode = async () => {
      // 手机号码错误
      if (state.mobilePhone.length != 11 || !/^[1][3,4,5,7,8][0-9]{9}$/.test(state.mobilePhone))
        return Toast('请输入正确的手机号码')

      try {
        const obj = {mobilePhone: state.mobilePhone}
        const res = await api.sendSMSCode(obj)

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
              clearInterval(timer) // 清除定时器
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
    // 更新图形验证码
    const updatePicCode = () => {
      state.picCode = api.sendPicCode()
    }

    return {
      ...toRefs(state),
      handleFocus,
      handleBlur,
      switchForm,
      checkForm,
      handleRegister,
      handleLogin,
      handleSendSMSCode,
      updatePicCode
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/color.scss';

// 登录 、注册切换动画
.login-slide-enter,
.reg-slide-enter {
  opacity: 0;
}
.login-slide-enter-active,
.reg-slide-enter-active {
  transition: all 0.5s ease;
}
.login-slide-leave-active,
.reg-slide-leave-active {
  display: none;
}

.login {
  min-height: 100vh;
  max-height: 100vh;
  background: $lightBgc;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;

  .top-tip {
    position: absolute;
    overflow: hidden;
    width: 100%;
    top: 20%;
    left: 0;
    text-align: center;
    .login-entry {
      display: inline-block;
      margin-left: 20px;
      margin-top: 16px;
      text-align: right;
      letter-spacing: 2px;
      font-size: 20px;
      color: $fontWhite;
      .font-active {
        color: $blueBgc;
        font-size: 24px;
      }
    }
  }
  .form-container {
    width: 80%;
    box-sizing: border-box;
    border-radius: 10px;
    padding: 14px;
    .input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
      padding-top: 0;
      .icon {
        display: inline-block;
        margin-right: 10px;
        font-size: 20px;
        color: $fontWhite;
      }
      input {
        background-color: $lightBgc;
      }
      .u-name,
      .u-password,
      .verify-code,
      .mobile-phone,
      .sms {
        flex: 1;
        width: 0;
        height: 60px;
        font-size: 20px;
        letter-spacing: 2px;
        line-height: 60px;
        color: $fontWhite;
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

      .pic-code {
        flex-basis: 30%;
      }
      &::before {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        content: '';
        height: 1px;
        background: $fontGray;
      }
      &::after {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        content: '';
        height: 2px;
        background: $blueBgc;
        transform: scaleX(0);
        transition: transform 200ms cubic-bezier(0, 0, 0.2, 1) 0ms;
      }
    }
    .focus-a::after {
      transform: scaleX(1);
    }
    .login-btn {
      margin-top: 14px;
      height: 48px;
      line-height: 48px;
      text-align: center;
      color: #fff;
      background: $blueBgc;
    }
  }
}
</style>
