<template>
  <div class="apply-detail">
    <van-nav-bar title="通知" left-text="返回" left-arrow @click-left="onClickLeft" />
    <div class="sys-notice van-hairline--bottom">
      <div class="seesion-list first-li">
        <div class="list-left">
          <van-image round width="56px" height="56px" :src="IMG_URL + InfoList.avatar" class="avatar" />
        </div>
        <div class="list-right">
          <div class="first-line">
            <p class="name">{{ InfoList.nickname }}</p>
          </div>
          <p v-if="InfoList.state === 'friend'" class="lastmsg">添加您为好友</p>
          <p v-if="InfoList.state === 'group'" class="lastmsg">申请加入{{ InfoList.groupName }}群</p>
        </div>
      </div>
    </div>

    <div class="info">
      <div class="dec-info">附加信息</div>
      <div class="add-info">{{ InfoList.mes }}</div>
    </div>
    <div class="button">
      <van-button type="primary" @click.stop="agree">同意</van-button>
    </div>
    <div class="button">
      <van-button type="danger" @click.stop="refuse">拒绝</van-button>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs, computed, inject, onBeforeMount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
export default {
  name: 'ApplyDetail',
  setup() {
    const socket = inject('socket')
    const route = useRoute()
    const router = useRouter()
    const store = useStore()
    const state = reactive({
      InfoList: {},
      IMG_URL: process.env.VUE_APP_IMG_URL

    })

    const sysNewsList = computed(() => {
      return store.state.sysNewsList
    })
    const getInfoList = () => {
      state.InfoList = sysNewsList.value.filter(item => (item.self = route.params.id))[0]
    }
    const onClickLeft = () => {
      console.log('onClickLeft')
      router.go(-1)
    }
    const agree = () => {
      socket.emit('agree', state.InfoList)
      state.InfoList.status = '1'

      store.commit('updateSysNewsList', state.InfoList)

      router.push({ name: 'Chat' })
    }
    const refuse = () => {
      state.InfoList.status = '2'
      socket.emit('refuse', state.InfoList)

      store.commit('updateSysNewsList', state.InfoList)
      router.push({ name: 'Chat' })
    }
    onBeforeMount(() => {
      getInfoList()
    })

    return {
      ...toRefs(state),

      getInfoList,
      onClickLeft,
      agree,
      refuse
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/color.scss';

.apply-detail {
  background-color: $fontBlack;

  .van-nav-bar {
    background-color: $fontBlack;
  }
  .sys-notice {
    .seesion-list {
      height: 76px;
      width: 100%;
      display: flex;
      box-sizing: border-box;
      padding: 10px 12px;
      align-items: center;
      color: $fontWhite;
      background-color: $lightBgc;

      .avatar {
        margin-right: 12px;
      }
      .list-right {
        flex: 1;

        display: flex;
        flex-direction: column;
        height: 56px;

        .first-line {
          display: inline-flex;
          margin-top: 0;

          .name {
            flex: 1;
            margin-top: 4px;
            color: $fontWhite;
            font-weight: 700;
          }
        }
        .lastmsg {
          white-space: nowrap;
          width: 100%;
          overflow: hidden;
          font-size: 14px !important;
          margin-top: -4px;
          padding-right: 12px;
          flex: 1;
          font-size: 16px;
          max-width: 260px;
          min-height: 39px;
          line-height: 1.2;
          text-overflow: ellipsis;
          color: $fontGray;
        }
      }
    }
  }
  .info {
    padding: 10px 16px;
    display: inline-flex;

    align-items: center;
    .dec-info {
      padding-right: 20px;
      color: $fontGray;
    }
    .add-info {
      color: $fontWhite;
    }
  }
  .button {
    margin-top: 20px;
    text-align: center;
    .van-button {
      width: 90%;
      border-radius: 20px;
    }
  }
}
</style>
