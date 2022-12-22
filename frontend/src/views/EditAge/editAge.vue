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
import { reactive, toRefs, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { updateUserInfo } from '@/api/user'

const reg = /^(?:[1-9][0-9]?|1[01][0-9]|120)$/
export default {
  name: 'EditAge',
  setup() {
    const router = useRouter()
    const store = useStore()
    const state = reactive({
      value: store.state.userInfo.age
    })
    const ageValid = computed(() => {
      return reg.test(state.value)
    })
    const onClickLeft = () => {
      router.go(-1)
    }
    const save = async() => {
      if (!ageValid.value) return
      try {
        const obj = {
          age: state.value
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
      ageValid,
      onClickLeft,
      save
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
