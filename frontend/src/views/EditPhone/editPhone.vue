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
        <van-button type="info" class="send-sms" size="normal" v-if="!countdownText" @click="sendSMSCode"
          >获取验证码</van-button
        >
        <van-button type="info" class="send-sms" size="normal" v-else>{{ countdownText }}s后再试</van-button>
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
    <van-button type="info" size="large" class="btn" round @click="submit">确认修改</van-button>
  </div>
</template>

<script>
let timer
const reg = /^1[3|4|5|7|8]\d{9}$/
export default {
  name: 'EditPhone',
  data() {
    return {
      value: '',
      smsCode: '', // 短信验证码
      mobilePhone: '', // 手机号
      newMobilePhone: '',
      countdownText: '', // 倒计时文本
      cDTime: 60 // 60 秒倒计时
    }
  },
  created() {
    this.mobilePhone = this.$store.state.userInfo.mobilePhone
  },
  computed: {
    phoneValid() {
      return reg.test(this.mobilePhone)
    },
    phoneValid2() {
      return reg.test(this.newMobilePhone)
    }
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1)
    },
    async submit() {
      try {
        if (!this.smsCode) return this.$toast('请输入短信验证码')
        if (!this.phoneValid || !this.phoneValid2) return
        if (this.mobilePhone !== this.$store.state.userInfo.mobilePhone) return this.$toast('原手机号码不正确')
        const obj = {mobilePhone: this.mobilePhone, newMobilePhone: this.newMobilePhone, smsCode: this.smsCode}
        const {data} = await this.$api.updatedUserPhone(obj)
        clearInterval(timer)

        this.$store.dispatch('setUserInfo', data)
        this.$router.push({name: 'Manager'})
      } catch (error) {
        console.log(error)
      }
    },
    async sendSMSCode() {
      try {
        const res = await this.$api.sendSMSCode(this.mobilePhone)
        console.log(res)

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
              clearInterval(timer)
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
    ::v-deep .van-field__control::-webkit-input-placeholder {
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
