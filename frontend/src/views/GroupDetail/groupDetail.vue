<template>
  <div class="groupDetail">
    <van-nav-bar left-text="返回" left-arrow @click-left="onClickLeft" />

    <template v-if="groupInfo !== null">
      <div v-for="img in imageList" v-lazy:background-image="IMG_URL + img" :key="img" class="lazy"></div>
    </template>
    <div class="groupDetail-container" v-if="groupInfo !== null">
      <van-cell title="群名称" :value="groupInfo.title" />
      <van-cell title="创建时间" :value="groupInfo.createDate.split('T')[0]" />
      <van-cell :value="'共' + managers.length + '人'" is-link class="my-van-cell">
        <!-- 使用 title 插槽来自定义标题 -->
        <template #title>
          <span class="custom-title">管理员</span>
          <van-tag v-for="item in managers" :key="item._id"
            ><img v-lazy="IMG_URL + item.userId.avatar" alt="" width="20" height="20" class="img"
          /></van-tag>
        </template>
      </van-cell>
      <div class="button-type">
        <van-button type="primary" @click="mesCheck">申请加群</van-button>
      </div>
    </div>
  </div>
</template>

<script>
import {reactive, toRefs, inject, onBeforeMount} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {useStore} from 'vuex'
import {getGroupInfo} from '@/api/group'
export default {
  name: 'GroupDetail',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const store = useStore()
    const state = reactive({
      imageList: [],
      groupInfo: null,
      managers: [],
      groupUsers: [],
      IMG_URL: process.env.VUE_APP_IMG_URL,
      holderId: ''
    })
    const onClickLeft = () => {
      router.go(-1)
    }
    const mesCheck = () => {
      console.log('mesCheck')
      router.push({name: 'SendGroupValidate', params: {id: state.holderId}})
    }
    const blockGroup = () => {
      console.log('blockFriend')
    }
    const getGroupInfo = async () => {
      const params = {id: route.params.id}
      const res = await getGroupInfo(params)
      state.groupInfo = res.data
      state.groupUsers = res.users
      state.imageList.push(state.groupInfo.img)
      state.managers = state.groupUsers.filter(item => item.holder === 1 || item.manager === 1)
      state.holderId = state.groupUsers.filter(item => item.holder === 1)[0].userId['_id']
      state.groupInfo.otherAvatar = state.groupUsers.filter(item => item.holder === 1)[0].userId['avatar']
      state.groupInfo.otherName = state.groupUsers.filter(item => item.holder === 1)[0].userId['nickname']
      store.dispatch('setGroupInfo', state.groupInfo)
    }
    onBeforeMount(() => {
      getGroupInfo()
    })
    return {
      ...toRefs(state),
      onClickLeft,
      mesCheck,
      blockGroup,
      getGroupInfo
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/color.scss';

.groupDetail {
  .van-nav-bar {
    background: transparent;
    z-index: 11;
  }
  .van-cell {
    background-color: $lightBgc;
    color: $fontWhite;
  }
  .my-van-cell::after {
    display: none;
  }

  .van-hairline--bottom::after {
    border-bottom-width: 0;
  }
  .van-tag--default {
    background-color: #fff;
  }
  .lazy {
    position: fixed;
    top: 0;
    left: 0;
    box-sizing: border-box;
    width: 100%;
    height: 250px;
    background-color: #fff;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    border-radius: 0 0 12px 12px;
    z-index: 10;
  }
  .groupDetail-container {
    margin-top: 204px;
    .van-button {
      margin-top: 25px;
      left: 50%;
      transform: translateX(-50%);
      width: 90%;
      height: 38px;
      border-radius: 8px;
      line-height: 30px;
      font-size: 16px;
    }

    .img {
      border-radius: 50%;
    }
  }
}
</style>
