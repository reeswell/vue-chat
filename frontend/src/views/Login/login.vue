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
          <div @click="_updatePicCode">
            <img ref="picCode" class="pic-code" src="" title="看不清？点击刷新" />
          </div>
        </div>
        <!-- 登录按钮 -->
        <van-button v-if="!isLoading" round size="large" color="#007aff" @click="login" text="登录" class="login-btn" />
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
          <van-button type="info" class="send-sms" size="small" v-if="!countdownText" @click="sendSMSCode"
            >获取验证码</van-button
          >
          <van-button type="info" class="send-sms" size="small" v-else>{{ countdownText }}s后再试</van-button>
        </div>
        <!-- 注册按钮 -->
        <van-button
          v-if="!isLoading"
          round
          size="large"
          color="#007aff"
          @click="register"
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
export default {
  name: 'Login',
  data() {
    return {
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
      isActive: true
    }
  },
  created() {
    this.$nextTick(() => this._updatePicCode())
  },
  methods: {
    handleFocus(index) {
      this.focusIndex = index
    },
    // 处理输入框失焦
    handleBlur() {
      this.focusIndex = 0
    },
    // 切换表单 & 做一些重置操作
    switchForm(flag) {
      flag === 'login' ? (this.isActive = true) : (this.isActive = false)
      this.switchFlag = flag
      this.switchFlag === 'login' && this.$nextTick(() => this._updatePicCode())
      this.focusIndex = 0 // 重置表单索引
      this.isLoading = false // 重置登录 或 注册按钮状态
      let resetData = ['userName', 'password', 'verifyCode', 'mobilePhone', 'smsCode']
      for (let item of resetData) {
        this[item] = ''
      }
    },

    // 表单验证
    _checkForm(flag) {
      let toast = text => {
        this.$toast(text)
        return false
      }

      switch (flag) {
        case 1:
          if (!this.userName) return toast('请输入用户名')
          if (!this.password) return toast('请输入密码')
          if (!this.verifyCode) return toast('请输入验证码')
          break
        case 2:
          if (!this.userName) return toast('请输入用户名')
          if (this.userName.length > 12 || this.userName.length < 3) return toast('请输入3-12位的用户名')
          if (!this.password) return toast('请输入密码')
          if (this.mobilePhone.length != 11 || !/^[1][3,4,5,7,8][0-9]{9}$/.test(this.mobilePhone))
            return toast('请输入正确的手机号码')
          if (!this.smsCode) return toast('请输入短信验证码')
          break
      }

      return true
    },

    // 注册

    async register() {
      if (!this._checkForm(2)) return
      this.isLoading = true // 按钮加载状态
      const {userName, password, mobilePhone, smsCode} = this.$data
      const data = {userName, password, mobilePhone, smsCode}
      // console.log(data);
      try {
        const res = await this.$api.register(data)
        this.isLoading = false
        this.countdownText = ''
        clearInterval(timer)
        setTimeout(() => this.switchForm('login'), 1000)
      } catch (error) {
        this.isLoading = false
        console.log(error)
      }
    },

    // 登录

    async login() {
      if (!this._checkForm(1)) return
      this.isLoading = true // 按钮加载状态
      const {userName, password, verifyCode} = this.$data
      const data = {userName, password, verifyCode}
      try {
        const res = await this.$api.login(data)
        console.log(res)
        this.$store.dispatch('setUserInfo', res.data)
        this.$store.dispatch('getUserInfo') //保存个人信息在localstorage
        this.$store.dispatch('setUserToken', res.token)

        setTimeout(() => this.$router.push({name: 'Chat'}), 1000)
      } catch (error) {
        console.log(error)
      } finally {
        this.isLoading = false // 重置按钮状态
      }
    },

    // 发送短信验证码
    async sendSMSCode() {
      // 手机号码错误
      if (this.mobilePhone.length != 11 || !/^[1][3,4,5,7,8][0-9]{9}$/.test(this.mobilePhone))
        return this.$toast('请输入正确的手机号码')

      try {
        const obj = {mobilePhone: this.mobilePhone}
        const res = await this.$api.sendSMSCode(obj)

        if (res.code === 200) {
          // 免费短信服务次数用完，就以弹框方式发送
          this.$toast(res.msg)
          this.smsCode = res.smsCode

          this.cDTime = 60 // 首先恢复为 60 s
          timer = setInterval(() => {
            if (this.cDTime <= 0) {
              this.countdownText = ''
              clearInterval(timer) // 清除定时器
              return
            }
            this.countdownText = this.cDTime--
          }, 1000)
        } else if (res.code === 4010) {
          timer = setInterval(() => {
            if (res.time <= 0) {
              this.countdownText = ''
              clearInterval(timer) // 清除定时器
              this.cDTime = 60
              return
            }
            this.countdownText = res.time--
          }, 1000)
        }
        // 反馈消息
      } catch (error) {
        console.log(error)
      }
    },

    // 更新图形验证码

    _updatePicCode() {
      this.$refs.picCode['src'] = this.$api.sendPicCode()
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
