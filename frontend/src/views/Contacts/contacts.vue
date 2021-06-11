<template>
  <div class="contact">
    <van-nav-bar title="聊天" />

    <van-search v-model="value" placeholder="搜索" shape="round" @focus="goSearch" />

    <div class="contact-wrapper">
      <van-tabs v-model="active" animated sticky swipeable>
        <van-tab v-for="(item, index) in chatList" :title="item.name" :key="index">
          <div class="dialogue-container">
            <ul>
              <van-swipe-cell v-for="(i, index) in item.List" :key="index" v-if="item.List.length">
                <li class="seesion-list first-li van-hairline--bottom" @click="goMesPanel(i.id)">
                  <div class="list-left">
                    <van-image round :src="IMG_URL + i.avatar" class="avatar" />
                  </div>
                  <div class="list-right">
                    {{ i.userName }}
                  </div>
                </li>
              </van-swipe-cell>
            </ul>
          </div>
        </van-tab>
      </van-tabs>
    </div>
    <footer-nav></footer-nav>
  </div>
</template>

<script>
import {reactive, toRefs, computed, onBeforeMount} from 'vue'
import {useRouter} from 'vue-router'
import {useStore} from 'vuex'

import footerNav from '@/components/footerNav'

export default {
  name: 'Contact',
  components: {footerNav},

  setup() {
    const router = useRouter()
    const store = useStore()
    const state = reactive({
      value: '',
      active: '',
      IMG_URL: process.env.VUE_APP_IMG_URL,
      chatList: [], //  所有会话类型
      removeSation: {},
      show: false,
      getFriendList: computed(() => {
        return store.getters.getFriendList
      }),
      getGroupList: computed(() => {
        return store.getters.getGroupList
      })
    })
    onBeforeMount(() => {
      init()
    })

    const init = () => {
      const arr = [
        {name: '好友', List: []},
        {name: '群组', List: []}
      ]
      arr[0].List = state.getFriendList
      arr[1].List = state.getGroupList
      state.chatList = arr
    }
    const onClickLeft = () => {
      store.dispatch('getSysInfo')
    }
    const goMesPanel = id => {
      router.push({name: 'MesPanel', params: {id: id}})
    }
    const goSearch = () => {
      router.push({name: 'SearchLocal'})
    }

    return {
      ...toRefs(state),
      onClickLeft,
      goMesPanel,
      goSearch
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/color.scss';

.contact {
  position: relative;
  height: 100%;

  background-color: $deepBgc;
  color: $fontWhite;
  .van-overlay {
    background-color: rgba(0, 0, 0, 0);
  }
  :deep(.van-nav-bar) {
    background-color: $lightBgc;
    &.van-hairline--bottom::after {
      display: none;
    }
  }
  .van-hairline--bottom::after {
    display: block;
  }
  .van-search {
    background-color: $lightBgc;
    .van-search__content {
      background-color: $deepBgc;
      :deep(.van-field__control::placeholder) {
        text-align: center;
        color: $fontGray;
      }
      :deep(.van-field__left-icon) {
        position: relative;
        left: 42%;
        color: $fontGray;
      }
    }
  }
  :deep(.van-tabs__wrap) {
    background-color: $lightBgc;
  }
  :deep(.van-tabs__nav) {
    width: 150px;
    background-color: $lightBgc;
  }

  .dialogue-container {
    top: 100px;
    bottom: 50px;
    width: 100%;
    overflow: hidden;
    .seesion-list {
      height: 55px;
      width: 100%;
      display: flex;
      box-sizing: border-box;
      padding: 10px 12px;
      align-items: center;
      .avatar {
        width: 40px;
        height: 40px;
        margin-right: 12px;
      }
      .list-right {
        flex: 1;
        margin-bottom: 4px;
        font-size: 16px;
      }
    }
    .seesion-list:first-of-type {
      margin-top: 10px;
    }
  }
}
</style>
