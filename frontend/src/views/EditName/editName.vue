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
import { reactive, toRefs } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { updateUserInfo } from '@/api/user'

export default {
  name: 'EditName',
  setup() {
    const router = useRouter()
    const store = useStore()
    const state = reactive({
      value: ''
    })
    state.value = store.state.userInfo.nickname
    const onClickLeft = () => {
      router.go(-1)
    }
    const save = async() => {
      try {
        const obj = {
          nickname: state.value
        }
        const { data } = await updateUserInfo(obj)
        store.dispatch('setUserInfo', data)
        router.push({ name: 'Edit' })
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
