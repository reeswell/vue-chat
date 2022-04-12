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
            <p class="name">{{ groupInfo.userName }}</p>
          </div>
          <p class="lastmsg">{{ groupInfo.nickname }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex'

export default {
  name: 'SearchGroup',
  data() {
    return {
      keyword: '',
      groupInfo: null,
      IMG_URL: process.env.VUE_APP_IMG_URL
    }
  },
  computed: {
    ...mapState(['allChatList'])
  },
  methods: {
    onCancel() {
      this.$router.go(-1)
    },
    previewGroup(id) {
      const isGroup = this.allChatList.filter(item => item.id === id)
      if (isGroup.length) return this.$router.push({name: 'MesPanel', params: {id: id}})
      this.$router.push({name: 'GroupDetail', params: {id: id}})
    },
    async showSearch() {
      const data = {keyword: this.keyword}
      try {
        const res = await this.$api.huntGroups(data)
        this.groupInfo = res.data
      } catch (error) {
        console.error(error)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/color.scss';

.search-group {
  .van-search {
    background-color: $lightBgc;
    .van-search__content {
      background-color: $deepBgc;
      ::v-deep .van-field__control::placeholder {
        color: $fontGray;
      }
      ::v-deep .van-field__left-icon {
        color: $fontGray;
      }
    }
    .van-search__action {
      color: $fontWhite;
    }
  }
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
