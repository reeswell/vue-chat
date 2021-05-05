<template>
  <!-- 底部导航 -->
  <footer id="tabNav">
    <section
      v-for="(item, index) of NavList"
      :key="index"
      :class="{active: activeNavIndex === index}"
      @click="clickTab(index, item.name)"
    >
      <van-icon :name="item.icon" size="24" :badge="item.unread" />
      <div>{{ item.title }}</div>
    </section>
  </footer>
</template>

<script>
import {mapState, mapGetters} from 'vuex'

export default {
  name: 'FooterNav',
  props: {
    activeNavIndex: {type: Number, default: 0}
  },
  data() {
    return {
      NavList: [
        {title: '联系人', name: 'Contact', icon: 'friends', unread: null},
        {title: '聊天', name: 'Chat', icon: 'chat', unread: null},
        {title: '我的', name: 'Manager', icon: 'manager', unread: null}
      ]
    }
  },
  computed: {
    ...mapState(['unRead']),
    ...mapGetters(['getSysUnReadCount', 'getAllChatListUnread'])
  },
  watch: {
    unRead: {
      handler(item) {
        if (item.length > 0 && this.getSysUnReadCount !== null) {
          this.NavList.forEach((e, i) => {
            if (e.name === 'Manager') {
              e.unread = this.getSysUnReadCount
            }
          })
        }
        if (item.length > 0 && this.getAllChatListUnread !== 0) {
          this.NavList.forEach((e, i) => {
            if (e.name === 'Chat') {
              e.unread = this.getAllChatListUnread
            }
          })
        }
        if (!item.length || this.getAllChatListUnread === 0) {
          this.NavList.forEach((e, i) => {
            if (e.name === 'Chat') {
              e.unread = null
            }
          })
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    clickTab(index, name) {
      if (this.activeNavIndex === index) return
      this.$router.push({name})
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/color.scss';

#tabNav {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  height: 50px;
  display: flex;
  background: $lightBgc;
  z-index: 100;
  section {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    color: $fontGray;
  }
  section[data-v-3cf4060b] {
    font-size: 12px;
  }
  .van-icon {
    margin-bottom: -6px;
  }
  .active {
    color: $blueBgc;
  }
}
</style>
