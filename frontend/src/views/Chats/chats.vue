<template>
  <div class="chat">
    <van-nav-bar title="聊天"  @click-right.stop="onClickRight">
      <template #right>
        <van-icon name="add-o" size="18" />
      </template>
    </van-nav-bar>

    <van-overlay :show="show" @click="show = false" class="box-wrapper">
      <div class="right-box" v-show="show" @click.stop="onClickRight">
        <ul>
          <li @click.stop="addFriends"><i class="icon-person_add" /></i>&nbsp;添加好友</li>
          <li @click.stop="addGroup"><i class="icon-group_add"></i>&nbsp;添加群组</li>
          <li @click.stop="createGroup"><van-icon name="friends" />&nbsp;创建群组</li>
        </ul>
      </div>
    </van-overlay>

    <van-search v-model="value" placeholder="搜索" shape="round"  @focus="goSearch" />
      <div class="chat-wrapper">
      <div class="all-badge" v-if="getAllChatListUnread>0"><van-badge dot/></div>

      <div class="group-badge" v-if="groupUnread>0"><van-badge :content="groupUnread"/></div>
      <div class="unread-badge" v-if="getAllChatListUnread>0"><van-badge :content="getAllChatListUnread"/></div>

         <van-tabs v-model="active" animated sticky :scroll="tabScroll">
          <van-tab v-for="(item,index) in contactsList" :title=" item.name" :key="index">

            <div class="dialogue-container">

            <van-swipe-cell 
            v-for="(i,index) in item.List" :key="index" v-if="item.List.length">
              <li class="seesion-list first-li" @click="goMesPanel(i.id)">
                <div class="list-left">
                  <van-image round width="56px" height="56px" :src="IMG_URL+i.avatar" class="avatar" />
                </div>
                <div class="list-right van-hairline--bottom">
                  <div class="first-line">
                    <p class="name">{{i.userName}}</p>
                    <span class="time" v-if="i.newMesTime">{{i.newMesTime}}</span>
                    <van-badge :content="i.unread>0?i.unread:null" color="#3477f5">
                    </van-badge>
                  </div>
                  <p class="lastmsg" v-if="i.newMes">{{i.newMes}}</p>
                </div>
              </li>
              <template #right>
                <van-button square type="primary" text="标为已读" @click="readFlag(i.id)"/>
              </template>
            </van-swipe-cell>
            </div>
          </van-tab>
    </van-tabs>
      </div>
  </div>
</template>

<script>
import {mapState, mapGetters} from 'vuex'

export default {
  name: 'Chats',
  data() {
    return {
      value: '',
      active: '',
      IMG_URL: process.env.VUE_APP_IMG_URL,
      groupUnread: null,
      contactsList: [], // 会话列表
      removeSation: {},
      show: false
    }
  },
  computed: {
    ...mapState(['conversationsList', 'unRead', 'allChatList', 'userInfo']),
    ...mapGetters(['getConversationsList', 'getGroupUnread', 'getAllChatListUnread'])
  },
  watch: {
    unRead: {
      handler(list) {
        const chatList = this.allChatList
        const arr = [
          {name: 'all', List: []},
          {name: 'group', List: []},
          {name: 'unread', List: []}
        ]
        let unReadArr = []
        let groupArr = []
        chatList.forEach((item, i) => {
          list.forEach(m => {
            if (item.id === m.roomId) {
              this.$set(chatList, i, Object.assign({}, item, {unread: m.count}))
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
        this.groupUnread = groupUnread

        arr[0].List = chatList
        this.contactsList = arr

        this.contactsList.forEach((v, i) => {
          v.List.forEach((r, x) => {
            list.forEach(m => {
              if (r.id === m.roomId) {
                this.$set(this.contactsList[i].List, x, Object.assign({}, r, {unread: m.count}))
              }
            })
          })
        })
      },
      deep: true,
      immediate: true
    }
  },
  created() {},

  methods: {
    onClickLeft() {
      this.$store.dispatch('getSysInfo')
    },
    goSearch() {
      this.$router.push({name: 'SearchLocal'})
    },
    onClickRight() {
      this.show = !this.show
    },
    addFriends() {
      this.show = false
      this.$router.push({name: 'SearchFriend'})
    },
    addGroup() {
      this.show = false
      this.$router.push({name: 'SearchGroup'})
    },
    createGroup() {
      this.show = false
      this.$router.push({name: 'CreateGroup'})
    },
    createChannel() {
      this.show = false
      this.$router.push({name: 'CreateChannel'})
    },
    goMesPanel(id) {
      this.$router.push({name: 'MesPanel', params: {id: id}})
    },
    readFlag(id) {
      // 设置服务器信息为已读状态也本地设置为已读
      this.$socket.emit('setReadStatus', {roomId: id, userName: this.userInfo.userName})
      this.$store.commit('setUnRead', {roomId: id, clear: true})
    },
    tabScroll() {
    //  do noting
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/color.scss';

.chat {
  position: relative;
  background-color: $deepBgc;
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

  ::v-deep .van-nav-bar {
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
      ::v-deep .van-field__control::placeholder {
        text-align: center;
        color: $fontGray;
      }
      ::v-deep .van-field__left-icon {
        position: relative;
        left: 42%;
        color: $fontGray;
      }
    }
  }
  ::v-deep .van-tabs__wrap {
    background-color: $lightBgc;
  }
  ::v-deep .van-tabs__nav {
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
        .first-line {
          display: inline-flex;
          .name {
            flex: 1;
            margin-bottom: 4px;
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
    .seesion-list:first-of-type {
      margin-top: 10px;
    }
  }
}
</style>
