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
import {reactive, toRefs, computed} from 'vue'
import {useRouter} from 'vue-router'
import {useStore} from 'vuex'
import api from '@/api'
const reg = /^[A-Za-z0-9._%-]+@([A-Za-z0-9-]+\.)+[A-Za-z]{2,4}$/
export default {
  name: 'Editemail',

  setup() {
    const router = useRouter()
    const store = useStore()
    const state = reactive({
      value: store.state.userInfo.email
    })
    const emailValid = computed(() => {
      return reg.test(state.value)
    })
    const onClickLeft = () => {
      router.go(-1)
    }
    const save = async () => {
      if (!emailValid) return
      try {
        const obj = {
          email: state.value
        }
        const {data} = await api.updateUserInfo(obj)
        store.dispatch('setUserInfo', data)
        router.push({name: 'Edit'})
      } catch (error) {
        console.log(error)
      }
    }
    return {
      ...toRefs(state),
      emailValid,
      onClickLeft,
      save
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
