<template>
  <div class="search-group">
    <van-search v-model="keyword" show-action placeholder="群id" @search="showSearch" @cancel="onCancel" />

    <div class="search-result" v-if="groupInfo !== null">
      <div class="seesion-list" @click="previewGroup(groupInfo.id)">
        <div class="list-left">
          <van-image round width="56px" height="56px" :src="IMG_URL + groupInfo.avatar"
            ><template v-slot:error>加载失败</template></van-image
          >
        </div>
        <div class="list-right">
          <div class="first-line">
            <p class="name">{{ groupInfo.username }}</p>
          </div>
          <p class="lastmsg">{{ groupInfo.nickname }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {reactive, toRefs, computed} from 'vue'
import {useRouter} from 'vue-router'
import {useStore} from 'vuex'
import {huntGroups} from '@/api/group'
export default {
  name: 'SearchGroup',
  setup() {
    const router = useRouter()
    const store = useStore()
    const state = reactive({
      keyword: '',
      groupInfo: null,
      IMG_URL: process.env.VUE_APP_IMG_URL,
      allChatList: computed(() => {
        return store.state.allChatList
      })
    })
    const onCancel = () => {
      router.go(-1)
    }
    const previewGroup = id => {
      const isGroup = state.allChatList.filter(item => item.id === id)
      if (isGroup.length) return router.push({name: 'MesPanel', params: {id: id}})
      router.push({name: 'GroupDetail', params: {id: id}})
    }
    const showSearch = async () => {
      console.log('showSearch')
      const data = {keyword: state.keyword}
      try {
        const res = await huntGroups(data)
        state.groupInfo = res.data
      } catch (error) {
        console.log(error)
      }
    }
    return {
      ...toRefs(state),
      onCancel,
      previewGroup,
      showSearch
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/color.scss';

.search-group {
  .search-result {
    .seesion-list {
      height: 76px;
      width: 100%;
      display: flex;
      box-sizing: border-box;
      padding: 10px 12px;
      background-color: $lightBgc;

      .avatar {
        margin-right: 12px;
      }
      .list-right {
        flex: 1;
        margin-left: 20px;
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
}
</style>
