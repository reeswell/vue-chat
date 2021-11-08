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
        <van-form @submit="handleLogin">
          <van-cell-group inset>
            <van-field left-icon="manager" v-model="userName" name="userName" placeholder="用户名/手机号码" />
            <van-field left-icon="lock" v-model="password" type="password" name="password" placeholder="密码" />
            <!-- 图形验证码 -->
            <van-field v-model="verifyCode" clearable placeholder="请输入图形校验码">
              <template #right-icon>
                <img v-lazy="picCode" title="看不清？点击刷新" @click="updatePicCode" width="80" height="40" />
              </template>
            </van-field>
          </van-cell-group>

          <div style="margin: 16px">
            <!-- 登录按钮 -->
            <van-button
              v-if="!isLoading"
              round
              size="large"
              color="#007aff"
              native-type="submit"
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
        </van-form>
      </div>
    </transition>

    <!-- 注册 -->
    <transition name="reg-slide">
      <div class="form-container" v-if="switchFlag === 'register'">
        <van-form @submit="handleRegister">
          <van-cell-group inset>
            <van-field left-icon="manager" v-model="userName" name="validateUsername" placeholder="用户名" />
            <van-field left-icon="lock" v-model="password" type="password" name="validatePassword" placeholder="密码" />

            <van-field
              type="tel"
              left-icon="mobilePhone"
              name="validatePhone"
              v-model="mobilePhone"
              placeholder="手机号码"
            />
            <van-field v-model="smsCode" center clearable placeholder="请输入短信验证码">
              <template #button>
                <van-button size="small" type="primary" v-if="!countdownText" @click="handleSendSMSCode"
                  >发送验证码</van-button
                >
                <van-button type="primary" size="small" v-else>{{ countdownText }}s后再试</van-button>
              </template>
            </van-field>
          </van-cell-group>

          <div style="margin: 16px">
            <van-button
              v-if="!isLoading"
              round
              size="large"
              color="#007aff"
              native-type="submit"
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
        </van-form>
      </div>
    </transition>
  </div>
</template>

<script>
let timer
import {reactive, toRefs, nextTick, onMounted} from 'vue'
import {useRouter} from 'vue-router'
import {useStore} from 'vuex'
import {register, login, sendSMSCode} from '@/api/user'

import {Toast} from 'vant'

export default {
  name: 'Login',
  setup() {
    const router = useRouter()
    const store = useStore()

    const state = reactive({
      switchFlag: 'login', // 登录: 1, 注册: 2
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

    const switchForm = flag => {
      flag === 'login' ? (state.isActive = true) : (state.isActive = false)
      state.switchFlag = flag
      state.switchFlag === 'login' && nextTick(() => updatePicCode())
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
    const handleLogin = async () => {
      if (!checkForm(1)) return
      state.isLoading = true // 按钮加载状态
      const {userName, password, verifyCode} = state
      const data = {userName, password, verifyCode}
      try {
        const res = await login(data)
        // console.log(res)
        store.dispatch('setUserInfo', res.data)
        store.dispatch('getUserInfo') // 保存个人信息在localstorage
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
      if (state.mobilePhone.length != 11 || !/^[1][3,4,5,7,8][0-9]{9}$/.test(state.mobilePhone)) {
        {
          return Toast('请输入正确的手机号码')
        }
      }
      try {
        const obj = {mobilePhone: state.mobilePhone}
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
    const updatePicCode = () => {
      state.picCode = `${process.env.VUE_APP_BASE_API}/user/sendPicCode?mt=${Math.random()}`
    }

    return {
      ...toRefs(state),
      switchForm,
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
    .van-hairline--top-bottom::after {
      border-width: 0;
    }
    .van-cell--borderless::after,
    .van-cell:last-child::after {
      display: block;
    }
  }
  .van-cell {
    background-color: $lightBgc;
    color: $fontWhite;
  }
}
</style>
