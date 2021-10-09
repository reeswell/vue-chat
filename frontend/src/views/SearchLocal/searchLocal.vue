<template>
  <div class="search-local">
    <van-search v-model="keyword" show-action placeholder="请输入搜索关键词" @search="onSearch" @cancel="onCancel" />
    <div class="result">
      <ul>
        <li class="seesion-list first-li" v-for="(item, index) in result" :key="index" @click="goMesPanel(item.id)">
          <div class="list-left">
            <van-image round :src="IMG_URL + item.avatar" class="avatar" />
          </div>
          <div class="list-right">
            {{ item.username }}
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import {reactive, toRefs, computed} from 'vue'
import {useRouter} from 'vue-router'
import {useStore} from 'vuex'
export default {
  name: 'SearchLocal',
  setup() {
    const router = useRouter()
    const store = useStore()
    const state = reactive({
      keyword: '',
      active: '',
      IMG_URL: process.env.VUE_APP_IMG_URL,
      chatList: [], //  所有会话类型
      show: false
    })
    const result = computed(() => {
      if (state.keyword) {
        return store.state.allChatList.filter(item => item.username.includes(state.keyword))
      }
    })
    const onSearch = () => {
      console.log('onSearch')
    }
    const onCancel = () => {
      state.keyword = ''
      router.go(-1)
    }
    const goMesPanel = id => {
      router.push({name: 'MesPanel', params: {id: id}})
    }
    return {
      ...toRefs(state),
      result,
      onSearch,
      onCancel,
      goMesPanel
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/color.scss';

.search-local {
  position: relative;
  bottom: 0;
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
      color: $fontWhite;
    }
  }
  .seesion-list:first-of-type {
    margin-top: 10px;
  }
}
</style>
