<template>
  <div class="sys-mes">
    <van-nav-bar title="通知" left-text="返回" left-arrow @click-left="onClickLeft" />
    <div v-if="sysNewsList.length" class="sys-notice">
      <ul>
        <van-swipe-cell>
          <li v-for="(item, index) in sysNewsList" :key="index" class="seesion-list first-li">
            <div class="list-left">
              <van-image round width="56px" height="56px" :src="IMG_URL + item.avatar" class="avatar" />
            </div>
            <div class="list-right">
              <div class="first-line">
                <p class="name">{{ item.nickname }}</p>
                <span class="time">{{ item.time }}</span>
              </div>
              <p class="lastmsg">{{ item.mes }}</p>
            </div>
            <div class="my-button">
              <van-button
                v-if="item.status === '0'"
                type="primary"
                size="mini"
                @click.stop="goDetail(item.self)"
              >查看</van-button>
              <van-button v-else type="default" size="mini">已查看</van-button>
            </div>
          </li>
          <template #right>
            <van-button square type="danger" text="删除" />
          </template>
        </van-swipe-cell>
      </ul>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs, computed, onMounted, inject, onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

export default {
  name: 'SysMes',
  setup() {
    const socket = inject('socket')
    const router = useRouter()
    const store = useStore()
    const state = reactive({
      offset: 1,
      limit: 10,
      IMG_URL: process.env.VUE_APP_IMG_URL,
      sysNewsList: computed(() => {
        return store.state.sysNewsList
      }),
      sysInfo: computed(() => {
        return store.state.sysInfo
      }),
      userInfo: computed(() => {
        return store.state.userInfo
      }),
      getSysUnRead: computed(() => {
        return store.getters.getSysUnRead
      })
    })

    const init = () => {
      if (!state.getSysUnRead.length || state.getSysUnRead[0].count === 0) return
      console.log('333333')
      store.commit('setUnRead', { roomId: state.sysInfo.id, clear: true })
      socket.emit('setReadStatus', { roomId: state.sysInfo.id, userName: state.userInfo.userName })
      socket.emit('getSysMeg', { roomId: state.sysInfo.id, offset: state.offset, limit: state.limit })
    }
    const onClickLeft = () => {
      console.log('onClickLeft')
      router.go(-1)
    }

    const goDetail = id => {
      console.log('goDetail')
      router.push({ name: 'ApplyDetail', params: { id: id }})
    }

    onBeforeMount(() => {
      init()
    })
    onMounted(() => {
      socket.on('getSysMeg', mes => {
        store.dispatch('setSysNewsList', mes)
      })
    })
    onMounted(() => {
      // 获取系统消息
      socket.on('getSysMeg', mes => {
        console.log(mes)
        store.dispatch('setSysNewsList', mes)
      })
    })

    return {
      ...toRefs(state),

      onClickLeft,
      goDetail
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/color.scss';

.sys-mes {
  background-color: $deepBgc;

  .van-nav-bar {
    background-color: $deepBgc;
  }

  .van-cell {
    background-color: $lightBgc;
    color: $fontGray;
  }
  .sys-notice {
    top: 100px;
    bottom: 50px;
    width: 100%;
    overflow: hidden;
    .seesion-list {
      height: 76px;
      width: 100%;
      display: flex;
      box-sizing: border-box;
      padding: 10px 12px;
      align-items: center;
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
          height: 20px;
          .name {
            flex: 1;
            margin-bottom: 4px;
            font-size: 16px;
            color: $fontWhite;
            font-weight: 700;
          }
          .time {
            width: 70px;
            color: $fontGray;
            font-size: 10px;
          }
        }
        .lastmsg {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          margin-bottom: 0;
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
  .van-swipe-cell {
    .van-swipe-cell__right,
    .van-swipe-cell__left {
      button {
        height: 76px;
        width: 50px;
      }
    }
  }
}
</style>
