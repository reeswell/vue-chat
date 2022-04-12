<template>
  <div class="edit-remark">
    <van-nav-bar
      left-text="返回"
      right-text="完成"
      title="设置备注"
      left-arrow
      @click-left="onClickLeft"
      @click-right="save"
    />
    <van-field v-model="value" placeholder="请输入名字" maxlength="20" />
  </div>
</template>

<script>
import {mapState} from 'vuex'

export default {
  name: 'EditName',
  data() {
    return {
      value: ''
    }
  },
  created() {
    this.init()
  },
  computed: {
    ...mapState(['allChatList', 'userInfo'])
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1)
    },
    init() {
      const id = this.$route.params.id
      this.allChatList.forEach(item => {
        if (item.friendId === id) {
          this.value = item.userName
        }
      })
    },
    async save() {
      const id = this.$route.params.id

      try {
        const obj = {
          userId: this.userInfo.id,
          friendId: id,
          remark: this.value
        }

        const {msg} = await this.$api.modifyFriendRemark(obj)
        this.$store.dispatch('getUserInfo')
        this.$toast(msg)

        this.$router.push({name: 'Chat'})
      } catch (error) {
        console.error(error)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/color.scss';

.edit-remark {
  min-height: 100vh;
  max-height: 100vh;
  background-color: $deepBgc;
  .van-cell {
    background-color: $lightBgc;
    color: $fontWhite;
  }
  .van-nav-bar {
    background-color: $deepBgc;
  }
}
</style>
