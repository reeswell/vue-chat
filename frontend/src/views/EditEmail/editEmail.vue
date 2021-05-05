<template>
  <div class="edit-email">
    <van-nav-bar
      left-text="返回"
      right-text="保存"
      title="设置邮箱"
      left-arrow
      @click-left="onClickLeft"
      @click-right="save"
    />

    <van-field
      type="email"
      v-model="value"
      placeholder="请输入邮箱"
      :error-message="!emailValid ? '请输入正确的邮箱格式！' : ''"
    />
  </div>
</template>

<script>
const reg = /^[A-Za-z0-9._%-]+@([A-Za-z0-9-]+\.)+[A-Za-z]{2,4}$/
export default {
  name: 'Editemail',
  data() {
    return {
      value: ''
    }
  },
  created() {
    this.value = this.$store.state.userInfo.email
  },
  computed: {
    emailValid() {
      return reg.test(this.value)
    }
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1)
    },
    async save() {
      if (!this.emailValid) return
      try {
        const obj = {
          email: this.value
        }
        const {data} = await this.$api.updateUserInfo(obj)
        this.$store.dispatch('setUserInfo', data)
        this.$router.push({name: 'Edit'})
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/color.scss';

.edit-email {
  min-height: 100vh;
  max-height: 100vh;
  background-color: $deepBgc;

  .van-nav-bar {
    background-color: $deepBgc;
  }

  .van-cell {
    background-color: $lightBgc;
    color: $fontGray;
  }
}
</style>
