<template>
  <div class="chat">
    <van-nav-bar title="聊天" @click-right.stop="onClickRight">
      <template #right>
        <van-icon name="add-o" size="18" />
      </template>
    </van-nav-bar>

    <van-overlay :show="show" class="box-wrapper" @click="show = false">
      <div v-show="show" class="right-box" @click.stop="onClickRight">
        <ul>
          <li @click.stop="addFriends"><i class="icon-person_add" />&nbsp;添加好友</li>
          <li @click.stop="addGroup"><i class="icon-group_add" />&nbsp;添加群组</li>
          <li @click.stop="createGroup"><van-icon name="friends" />&nbsp;创建群组</li>
        </ul>
      </div>
    </van-overlay>

    <van-search v-model="value" placeholder="搜索" shape="round" @focus="goSearch" />
    <div class="chat-wrapper">
      <div v-if="getAllChatListUnread > 0" class="all-badge"><van-badge dot /></div>

      <div v-if="groupUnread > 0" class="group-badge"><van-badge :content="groupUnread" /></div>
      <div v-if="getAllChatListUnread > 0" class="unread-badge"><van-badge :content="getAllChatListUnread" /></div>

      <van-tabs v-model="active" animated sticky :scroll="tabScroll">
        <van-tab v-for="(item, index) in contactsList" :key="index" :title="item.name">
          <div v-if="item.List.length" class="dialogue-container">
            <van-swipe-cell v-for="(i, index2) in item.List" :key="index2">
              <li class="seesion-list first-li" @click="goMesPanel(i.id)">
                <div class="list-left">
                  <van-image round width="56px" height="56px" :src="IMG_URL + i.avatar" class="avatar" />
                </div>
                <div class="list-right van-hairline--bottom">
                  <div class="first-line">
                    <p class="name">{{ i.userName }}</p>
                    <span v-if="i.newMesTime" class="time">{{ i.newMesTime }}</span>
                    <van-badge :content="i.unread > 0 ? i.unread : null" color="#3477f5" />
                  </div>
                  <p v-if="i.newMes" class="lastmsg">{{ i.newMes }}</p>
                </div>
              </li>
              <template #right>
                <van-button square type="primary" text="标为已读" @click="readFlag(i.id)" />
              </template>
            </van-swipe-cell>
          </div>
        </van-tab>
      </van-tabs>
    </div>
    <footer-nav />
  </div>
</template>

<script>
import { reactive, toRefs, inject, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

import footerNav from '@/components/footerNav'

export default {
  name: 'Chats',
  components: { footerNav },

  setup() {
    const router = useRouter()
    const store = useStore()
    const socket = inject('socket')
    const state = reactive({
      value: '',
      active: '',
      IMG_URL: process.env.VUE_APP_IMG_URL,
      groupUnread: null,
      contactsList: [], // 会话列表
      removeSation: {},
      show: false

    })
    const unRead = computed(() => {
      return store.state.unRead
    })

    const allChatList = computed(() => {
      return store.state.allChatList
    })
    const userInfo = computed(() => {
      return store.state.userInfo
    })
    const getAllChatListUnread = computed(() => {
      return store.getters.getAllChatListUnread
    })
    watch(
      () => unRead.value,
      (list, oldList) => {
        const chatList = allChatList.value
        const arr = [
          { name: 'all', List: [] },
          { name: 'group', List: [] },
          { name: 'unread', List: [] }
        ]
        const unReadArr = []
        const groupArr = []
        chatList.forEach((item, i) => {
          list.forEach(m => {
            if (item.id === m.roomId) {
              chatList[i] = Object.assign({}, item, { unread: m.count })
            }
          })
        })
        let groupUnread = 0
        chatList.map(item => {
          if (item.type === 'group' || item.type === 'channel') {
            if (item.unread) {
              groupUnread++
            }
            groupArr.push(item)
          }
          if (item.unread > 0) {
            unReadArr.push(item)
          }
        })
        arr[2].List = unReadArr
        arr[1].List = groupArr
        state.groupUnread = groupUnread

        arr[0].List = chatList
        state.contactsList = arr

        state.contactsList.forEach((v, i) => {
          v.List.forEach((r, x) => {
            list.forEach(m => {
              if (r.id === m.roomId) {
                state.contactsList[i].List[x] = Object.assign({}, r, { unread: m.count })
              }
            })
          })
        })
      },
      {
        deep: true,
        immediate: true
      }
    )
    const onClickLeft = () => {
      store.dispatch('getSysInfo')
    }
    const goSearch = () => {
      router.push({ name: 'SearchLocal' })
    }
    const onClickRight = () => {
      state.show = !state.show
    }
    const addFriends = () => {
      state.show = false
      router.push({ name: 'SearchFriend' })
    }
    const addGroup = () => {
      state.show = false
      router.push({ name: 'SearchGroup' })
    }
    const createGroup = () => {
      state.show = false
      router.push({ name: 'CreateGroup' })
    }
    const createChannel = () => {
      state.show = false
      router.push({ name: 'CreateChannel' })
    }
    const goMesPanel = id => {
      router.push({ name: 'MesPanel', params: { id: id }})
    }
    const readFlag = id => {
      // 设置服务器信息为已读状态也本地设置为已读
      socket.emit('setReadStatus', { roomId: id, userName: userInfo.value.userName })
      store.commit('setUnRead', { roomId: id, clear: true })
    }
    const tabScroll = () => {
      console.log('66')
    }

    return {
      ...toRefs(state),
      onClickLeft,
      goSearch,
      onClickRight,
      addFriends,
      addGroup,
      createGroup,
      createChannel,
      goMesPanel,
      readFlag,
      tabScroll,
      getAllChatListUnread
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/color.scss';

.chat {
  position: relative;
  background-color: $deepBgc;
  height: 100%;

  .van-overlay {
    background-color: rgba(0, 0, 0, 0);
  }

  .box-wrapper {
    z-index: 2;

    .right-box {
      position: absolute;
      right: 40px;
      top: 20px;
      border-radius: 8px;
      width: 110px;
      background-color: #4c4c4c;

      &.right-box::after {
        content: '';
        display: block;
        position: absolute;
        border-style: solid;
        border-color: #4c4c4c transparent;
        width: 0;
        top: 10px;
        right: -10px;
        border-width: 0 15px 15px 0;
        transform: skewX(30deg);
        transform: rotate(0.2turn);
      }

      ul {
        padding: 4px 0 4px 5px;

        li {
          padding: 6px;
          vertical-align: bottom;
          color: #fff;
        }
      }
    }
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
    width: 250px;
    background-color: $lightBgc;
  }

  .chat-wrapper {
    position: relative;

    .all-badge {
      position: absolute;
      left: 52px;
      top: 6px;
      z-index: 1;

      .van-badge--dot {
        background-color: $blueBgc;
      }
    }

    .group-badge {
      position: absolute;
      left: 142px;
      top: 6px;
      z-index: 1;
    }

    .unread-badge {
      position: absolute;
      left: 230px;
      top: 6px;
      z-index: 1;
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

  .dialogue-container {
    position: relative;
    left: 0;
    right: 0;
    top: 0;

    .seesion-list {
      height: 76px;
      width: 100%;
      display: flex;
      box-sizing: border-box;
      padding: 10px 12px;

      .avatar {
        margin-right: 12px;
      }

      .list-right {
        flex: 1;
        display: flex;
        flex-direction: column;
        height: 56px;
        overflow: hidden;

        .first-line {
          display: inline-flex;
          margin-top: 0;

          .name {
            flex: 1;
            margin-top: 0;
            font-size: 16px;
            color: $fontWhite;
            font-weight: 700;
          }

          .time {
            width: 50px;
            color: $fontGray;
            font-size: 10px;
          }

          .van-badge {
            position: absolute;
            top: 30px;
            right: 18px;
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

    .seesion-list:first-of-type {
      margin-top: 10px;
    }
  }
}
</style>
