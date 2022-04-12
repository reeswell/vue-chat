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
        <van-button round block type="info" native-type="submit"> 提交 </van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
const groupnameReg = /^[\u4e00-\u9fa5_a-zA-Z0-9!！￥@#$,，.。？?、/;:：；|~·]{2,10}$/
const groupCodeReg = /^[0-9a-zA-Z_]{6,12}$/
export default {
  name: 'CreateGroup',
  data() {
    return {
      groupInfo: {
        groupCode: '',
        groupName: '',
        groupDesc: '',
        groupImage: '/img/group.jpg'
      },
      radio: 'group'
    }
  },
  computed: {
    groupnameValid() {
      return groupnameReg.test(this.groupInfo.groupName)
    },
    groupCodeValid() {
      return groupCodeReg.test(this.groupInfo.groupCode)
    },
    validateDesc() {
      return this.groupInfo.groupDesc && this.groupInfo.groupDesc.length < 100
    }
  },
  methods: {
    async onSubmit(values) {
      if (!this.groupnameValid && !this.groupnameValid && !this.validateDesc) return
      const obj = {
        groupCode: this.groupInfo.groupCode,
        groupImage: this.groupInfo.groupImage,
        groupName: this.groupInfo.groupName,
        groupDesc: this.groupInfo.groupDesc,
        userName: this.$store.state.userInfo.userName,
        type: this.radio
      }
      try {
        const {data} = await this.$api.createGroup(obj)
        const r = {
          userName: this.$store.state.userInfo.userName,
          obj: {
            userName: this.groupInfo.groupName,
            avatar: this.groupInfo.groupImage,
            id: data._id,
            type: this.radio
          }
        }
        await this.$api.addConversationList(r)
        this.$store.dispatch('setConversationsList', r.obj)
        this.$toast('创建成功')
        this.$router.push({name: 'Chat'})
      } catch (error) {
        console.error(error)
      }
    },
    onClickLeft() {
      this.$router.go(-1)
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
