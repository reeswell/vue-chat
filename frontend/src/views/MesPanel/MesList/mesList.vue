<template>
  <div class="message-list" ref="messageList">
    <ul ref="msglist" class="chat-message">
      <li :class="[{org: v.type === 'org'}]" v-for="(v, i) in chatList" :key="i">
        <template v-if="v.type === 'other'">
          <message-item type="other" :v="v" class="other"></message-item>
        </template>
        <template v-if="v.type === 'mine'">
          <message-item type="mine" :v="v" class="mine"></message-item>
        </template>
        <template v-if="v.type === 'org' && v.roomId.split('-').length > 1">
          <span>现在可以开始聊天了</span>
        </template>
        <template v-if="v.type === 'org' && v.roomId.split('-').length == 1">
          <span>
            系统消息：<span class="org-hightlight">{{ v.nickname }}</span
            >加入群聊！</span
          >
        </template>
      </li>
    </ul>
  </div>
</template>

<script>
import messageItem from '../MessageItem/messageItem'

export default {
  name: 'MesList',
  components: {
    messageItem
  },
  props: ['chatList'],
  data() {
    return {}
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/color.scss';

.message-list {
  overflow-y: auto;
  .chat-message {
    overflow-y: auto;
    position: absolute;
    box-sizing: border-box;
    padding: 2px 8px;
    top: 40px;
    bottom: 50px;
    left: 0;
    right: 0;
    width: 100%;

    background-color: $deepBgc;
    li {
      width: 100%;
      margin: 12px 0 -4px 0;
      text-align: center;
    }
    .org {
      width: 100%;
      font-size: 12px;
      color: $fontWhite;
      box-sizing: border-box;
    }
    .org .org-hightlight {
      color: $fontWhite;
      margin: 0 5px;
    }
  }
}
</style>













