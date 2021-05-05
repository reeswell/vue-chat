<template>
  <div class="edit-age">
    <van-nav-bar
      left-text="返回"
      right-text="保存"
      title="设置年龄"
      left-arrow
      @click-left="onClickLeft"
      @click-right="save"
    />

    <van-field v-model="value" placeholder="请输入年龄" :error-message="!ageValid ? '请输入合法的年龄' : ''" />
  </div>
</template>

<script>
const reg = /^(?:[1-9][0-9]?|1[01][0-9]|120)$/
export default {
  name: 'EditAge',
  data() {
    return {
      value: ''
    }
  },
  created() {
    this.value = this.$store.state.userInfo.age
  },
  computed: {
    ageValid() {
      return reg.test(this.value)
    }
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1)
    },
    async save() {
      if (!this.ageValid) return
      try {
        const obj = {
          age: this.value
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

.edit-age {
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
