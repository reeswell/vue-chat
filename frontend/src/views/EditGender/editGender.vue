
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
import {reactive, toRefs} from 'vue'
import {useRouter} from 'vue-router'
import {useStore} from 'vuex'
import api from '@/api'
export default {
  name: 'EditGender',
  setup() {
    const router = useRouter()
    const store = useStore()
    const state = reactive({
      radio: store.state.userInfo.gender
    })
    const onClickLeft = () => {
      router.go(-1)
    }
    const save = async () => {
      try {
        const obj = {
          gender: state.radio
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
      onClickLeft,
      save
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
