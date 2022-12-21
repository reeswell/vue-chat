<template>
  <div class="login">
    <!-- 登录 -->
    <div class="top-tip">
      <div class="login-entry">
        <span :class="isActive ? '' : 'font-active'" @click="switchForm('login')">登录</span>
        <span>或</span>
        <span :class="isActive ? 'font-active' : ''" @click="switchForm('register')">注册</span>
      </div>
    </div>
    <transition name="login-slide">
      <div v-if="switchFlag === 'login'" class="form-container">
        <!-- 手机号码 -->
        <div class="input-wrapper" :class="[focusIndex === 1 ? 'focus-a' : '']">
          <van-icon name="manager" class="icon" />

          <input
            v-model="userName"
            type="text"
            class="mobile-phone"
            maxlength="11"
            placeholder="用户名/手机号码"
            autocomplete="off"
            @focus="handleFocus(1)"
            @blur="handleBlur"
          >
        </div>
        <!-- 密码 -->
        <div class="input-wrapper" :class="[focusIndex === 2 ? 'focus-a' : '']">
          <van-icon name="lock" class="icon" />

          <input
            v-model="password"
            type="password"
            class="u-password"
            maxlength="10"
            placeholder="密码"
            autocomplete="off"
            @focus="handleFocus(2)"
            @blur="handleBlur"
          >
        </div>
        <!-- 图形验证码 -->
        <div class="input-wrapper" :class="[focusIndex === 3 ? 'focus-a' : '']">
          <input
            v-model="verifyCode"
            type="text"
            class="verify-code"
            maxlength="4"
            placeholder="验证码"
            autocomplete="off"
            @focus="handleFocus(3)"
            @blur="handleBlur"
          >
          <div @click="updatePicCode">
            <div v-html="picCode" />
          </div>
        </div>
        <!-- 登录按钮 -->
        <van-button
          v-if="!isLoading"
          round
          size="large"
          color="#007aff"
          text="登录"
          class="login-btn"
          @click="handleLogin"
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
      <div v-if="switchFlag === 'register'" class="form-container">
        <!-- 用户名 -->

        <div class="input-wrapper" :class="[focusIndex === 1 ? 'focus-a' : '']">
          <!-- <van-icon name="user" class="icon" /> -->
          <van-icon name="manager" class="icon" />

          <input
            v-model="userName"
            type="text"
            class="u-name"
            maxlength="12"
            placeholder="用户名"
            autocomplete="off"
            @focus="handleFocus(1)"
            @blur="handleBlur"
          >
        </div>
        <!-- 密码 -->
        <div class="input-wrapper" :class="[focusIndex === 2 ? 'focus-a' : '']">
          <van-icon name="lock" class="icon" />
          <input
            v-model="password"
            type="password"
            class="u-password"
            maxlength="10"
            placeholder="密码"
            autocomplete="off"
            @focus="handleFocus(2)"
            @blur="handleBlur"
          >
        </div>
        <!-- 手机号 -->
        <div class="input-wrapper" :class="[focusIndex === 3 ? 'focus-a' : '']">
          <!-- <van-icon name="phone-circle" class="icon" /> -->
          <van-icon name="phone" class="icon" />
          <input
            v-model="mobilePhone"
            type="text"
            class="mobile-phone"
            maxlength="11"
            placeholder="手机号码"
            autocomplete="off"
            @focus="handleFocus(3)"
            @blur="handleBlur"
          >
        </div>
        <!-- 短信验证码 -->
        <div class="input-wrapper" :class="[focusIndex === 4 ? 'focus-a' : '']">
          <van-icon name="comment-circle" class="icon" />
          <input
            v-model="smsCode"
            type="text"
            class="sms"
            maxlength="6"
            placeholder="短信验证码"
            autocomplete="off"
            @focus="handleFocus(4)"
            @blur="handleBlur"
          >
          <van-button
            v-if="!countdownText"
            type="primary"
            class="send-sms"
            size="small"
            @click="handleSendSMSCode"
          >获取验证码</van-button>
          <van-button v-else type="primary" class="send-sms" size="small">{{ countdownText }}s后再试</van-button>
        </div>
        <!-- 注册按钮 -->
        <van-button
          v-if="!isLoading"
          round
          size="large"
          color="#007aff"
          text="注册"
          class="login-btn"
          @click="handleRegister"
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
import { reactive, toRefs, nextTick, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { register, login, sendSMSCode } from '@/api/user'
import axios from 'axios'
import { Toast } from 'vant'

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
      const resetData = ['userName', 'password', 'verifyCode', 'mobilePhone', 'smsCode']
      for (const item of resetData) {
        state[item] = ''
      }
      state.isLoading = false // 重置登录 或 注册按钮状态
    }
    // 表单验证
    const checkForm = flag => {
      const toast = text => {
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
          if (state.mobilePhone.length !== 11 || !/^[1][3,4,5,7,8][0-9]{9}$/.test(state.mobilePhone)) { return toast('请输入正确的手机号码') }
          if (!state.smsCode) return toast('请输入短信验证码')
          break
      }
      return true
    }
    // 注册
    const handleRegister = async() => {
      if (!checkForm(2)) return
      state.isLoading = true // 按钮加载状态
      const { userName, password, mobilePhone, smsCode } = state
      const data = { userName, password, mobilePhone, smsCode }
      // console.log(data);
      try {
        await register(data)
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
    const handleLogin = async() => {
      if (!checkForm(1)) return
      state.isLoading = true // 按钮加载状态
      const { userName, password, verifyCode } = state
      const data = { userName, password, verifyCode }
      try {
        const res = await login(data)
        // console.log(res)
        store.dispatch('setUserInfo', res.data)
        store.dispatch('getUserInfo') // 保存个人信息在localstorage
        store.dispatch('setUserToken', res.token)

        setTimeout(() => router.push({ name: 'Chat' }), 1000)
      } catch (error) {
        console.error(error)
      } finally {
        state.isLoading = false // 重置按钮状态
      }
    }
    // 发送短信验证码
    const handleSendSMSCode = async() => {
      // 手机号码错误
      if (state.mobilePhone.length !== 11 || !/^[1][3,4,5,7,8][0-9]{9}$/.test(state.mobilePhone)) { return Toast('请输入正确的手机号码') }

      try {
        const obj = { mobilePhone: state.mobilePhone }
        const res = await sendSMSCode(obj)

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
    const updatePicCode = async() => {
      const res = await axios.get(`${process.env.VUE_APP_BASE_API}/user/sendPicCode`, {
        params: {
          mt: Math.random()
        }
      })
      state.picCode = res.data
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
