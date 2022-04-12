<template>
  <div class="edit-name">
    <van-nav-bar
      left-text="返回"
      right-text="保存"
      title="设置名字"
      left-arrow
      @click-left="onClickLeft"
      @click-right="save"
    />
    <van-field v-model="value" placeholder="请输入名字" maxlength="20" />
  </div>
</template>

<script>
export default {
  name: 'EditName',
  data() {
    return {
      value: ''
    }
  },
  created() {
    this.value = this.$store.state.userInfo.nickname
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1)
    },
    async save() {
      try {
        const obj = {
          nickname: this.value
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

.edit-name {
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
