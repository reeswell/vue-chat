<template>
  <div class="footer">
    <div class="nav">
      <router-link
        v-for="item in NavList"
        :key="item.name"
        :to="item.name"
        class="van-tab"
        :class="{ active: $route.name === item.name }"
      >
        <van-icon :name="item.icon" :badge="item.unread" />
        <div class="nav-name">{{ item.title }}</div>
      </router-link>
    </div>
  </div>
</template>

<script>
import { ref, toRefs, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
export default {
  name: 'FooterNav',

  props: {
    activeNavIndex: { type: Number, default: 0 }
  },
  setup(props) {
    const router = useRouter()
    const store = useStore()
    const state = ref({
      NavList: [
        { title: '联系人', name: 'Contact', icon: 'friends', unread: null },
        { title: '聊天', name: 'Chat', icon: 'chat', unread: null },
        { title: '我的', name: 'Manager', icon: 'manager', unread: null }
      ],
      active: 1

    })
    const unRead = computed(() => {
      return store.state.unRead
    })
    const getSysUnReadCount = computed(() => {
      return store.getters.getSysUnReadCount
    })
    const getAllChatListUnread = computed(() => {
      return store.getters.getAllChatListUnread
    })
    const activeNavIndex = computed(() =>
      props.activeNavIndex
    )
    watch(
      () => unRead.value,
      item => {
        if (item.length > 0 && getSysUnReadCount.value !== null) {
          state.NavList.forEach((e, i) => {
            if (e.name === 'Manager') {
              e.unread = getSysUnReadCount.value
            }
          })
        }
        if (item.length > 0 && getAllChatListUnread.value !== 0) {
          state.NavList.forEach((e, i) => {
            if (e.name === 'Chat') {
              e.unread = getAllChatListUnread.value
            }
          })
        }
        if (!item.length || getAllChatListUnread.value === 0) {
          state.NavList.forEach((e, i) => {
            if (e.name === 'Chat') {
              e.unread = null
            }
          })
        }
      },
      {
        deep: true,
        immediate: true
      }
    )
    const clickTab = (index, name) => {
      if (activeNavIndex.value === index) return
      router.push({ name })
    }
    return {
      ...toRefs(state),
      clickTab
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/color.scss';

.footer {
  position: fixed;
  left: 0;
  bottom: 0;
  height: 50px;
  width: 100%;
  background: $lightBgc;

  .nav {
    display: flex;
    width: 100%;
    height: 100%;
    flex-direction: row;

    .active {
      color: $blueBgc;
    }

    :deep(.van-tab) {
      flex-direction: column;
    }

    i {
      font-size: 18px;
    }

    :deep(.van-badge) {
      background-color: $redBadge;
    }
  }
}
</style>
