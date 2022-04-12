
<template>
  <div class="edit-gender">
    <van-nav-bar
      left-text="返回"
      right-text="保存"
      title="设置手机号"
      left-arrow
      @click-left="onClickLeft"
      @click-right="save"
    />
    <van-radio-group v-model="radio" direction="horizontal">
      <van-radio name="女">女</van-radio>
      <van-radio name="男">男</van-radio>
      <van-radio name="保密">保密</van-radio>
    </van-radio-group>
  </div>
</template>

<script>
export default {
  name: 'EditGender',
  data() {
    return {
      radio: 'secret'
    }
  },
  created() {
    this.radio = this.$store.state.userInfo.gender
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1)
    },
    async save() {
      try {
        const obj = {
          gender: this.radio
        }
        const {data} = await this.$api.updateUserInfo(obj)
        this.$store.dispatch('setUserInfo', data)
        this.$router.push({name: 'Edit'})
      } catch (error) {
        console.error(error)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/color.scss';

.edit-gender {
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
  .van-radio-group {
    margin-top: 8px;
    text-align: center;
    align-items: center;
    justify-content: center;
  }
}
</style>
