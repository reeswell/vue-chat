<template>
  <div class="createGroup">
    <van-nav-bar title="创建群聊" left-text="返回" left-arrow @click-left="onClickLeft" />
    <van-form @submit="onSubmit">
      <van-field
        v-model="groupInfo.groupCode"
        type="groupCode"
        name="群id"
        label="群id"
        placeholder="请输入唯一的群id"
        required
        :error-message="groupCodeValid ? '' : '6-12位的数字字母或下划线'"
      />
      <van-field
        v-model="groupInfo.groupName"
        name="群名称"
        label="群名称"
        placeholder="群名称"
        required
        :error-message="groupnameValid ? '' : '请填写群名称'"
      />
      <van-field
        v-model="groupInfo.groupDesc"
        type="groupCode"
        name="群简介"
        label="群简介"
        placeholder="群简介"
        required
        :error-message="validateDesc ? '' : '请填写100字以内的群简介'"
      />
      <van-radio-group v-model="radio" direction="horizontal">
        <van-radio name="group">普通群</van-radio>
        <van-radio name="channel">广播群</van-radio>
      </van-radio-group>
      <div style="margin: 16px">
        <van-button round block type="primary" native-type="submit"> 提交 </van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import { reactive, toRefs, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { addConversationList } from '@/api/user'
import { createGroup } from '@/api/group'
import { Toast } from 'vant'
const groupnameReg = /^[\u4e00-\u9fa5_a-zA-Z0-9!！￥@#$,，.。？?、/;:：；|~·]{2,10}$/
const groupCodeReg = /^[0-9a-zA-Z_]{6,12}$/
export default {
  name: 'CreateGroup',
  setup() {
    const router = useRouter()
    const store = useStore()
    const state = reactive({
      groupInfo: {
        groupCode: '',
        groupName: '',
        groupDesc: '',
        groupImage: '/img/group.jpg'
      },
      radio: 'group'
    })
    const groupnameValid = computed(() => {
      return groupnameReg.test(state.groupInfo.groupName)
    })
    const groupCodeValid = computed(() => {
      return groupCodeReg.test(state.groupInfo.groupCode)
    })
    const validateDesc = computed(() => {
      return state.groupInfo.groupDesc && state.groupInfo.groupDesc.length < 100
    })
    const onSubmit = async values => {
      if (!groupnameValid.value && !groupCodeValid.value && !validateDesc.value) return
      const obj = {
        groupCode: state.groupInfo.groupCode,
        groupImage: state.groupInfo.groupImage,
        groupName: state.groupInfo.groupName,
        groupDesc: state.groupInfo.groupDesc,
        userName: store.state.userInfo.userName,
        type: state.radio
      }
      try {
        const { data } = await createGroup(obj)
        const r = {
          userName: store.state.userInfo.userName,
          obj: {
            userName: state.groupInfo.groupName,
            avatar: state.groupInfo.groupImage,
            id: data._id,
            type: state.radio
          }
        }
        await addConversationList(r)
        store.dispatch('setConversationsList', r.obj)
        Toast('创建成功')
        router.push({ name: 'Chat' })
      } catch (error) {
        console.error(error)
      }
    }
    const onClickLeft = () => {
      router.go(-1)
    }

    return {
      ...toRefs(state),
      groupnameValid,
      groupCodeValid,
      validateDesc,
      onSubmit,
      onClickLeft
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/color.scss';

.createGroup {
  background-color: $deepBgc;

  .van-nav-bar {
    background-color: $deepBgc;
  }

  .van-cell {
    background-color: $deepBgc;
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
