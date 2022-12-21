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
import { reactive, toRefs, computed, onBeforeMount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { Toast } from 'vant'
import { modifyFriendRemark } from '@/api/user'
export default {
  name: 'EditName',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const store = useStore()
    const state = reactive({
      value: '',
      allChatList: computed(() => {
        return store.state.allChatList
      }),
      userInfo: computed(() => {
        return store.state.userInfo
      })
    })
    onBeforeMount(() => {
      init()
    })
    const onClickLeft = () => {
      router.go(-1)
    }
    const init = () => {
      const id = route.params.id
      state.allChatList.forEach(item => {
        if (item.friendId === id) {
          state.value = item.userName
        }
      })
    }
    const save = async() => {
      const id = route.params.id
      try {
        const obj = {
          userId: state.userInfo.id,
          friendId: id,
          remark: state.value
        }
        const { msg } = await modifyFriendRemark(obj)
        store.dispatch('getUserInfo')
        Toast(msg)

        router.push({ name: 'Chat' })
      } catch (error) {
        console.log(error)
      }
    }
    return {
      ...toRefs(state),
      onClickLeft,
      save
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
