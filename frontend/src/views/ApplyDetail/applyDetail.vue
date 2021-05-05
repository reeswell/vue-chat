<template>
  <div class="apply-detail">
    <van-nav-bar title="通知" left-text="返回" left-arrow @click-left="onClickLeft" />
    <div class="sys-notice van-hairline--bottom">
      <div class="seesion-list first-li" @click="goMesPanel">
        <div class="list-left">
          <van-image round width="56px" height="56px" :src="IMG_URL + InfoList.avatar" class="avatar" />
        </div>
        <div class="list-right">
          <div class="first-line">
            <p class="name">{{ InfoList.nickname }}</p>
          </div>
          <!-- <p class="lastmsg"><span>province.</span><span>city. </span><span>gender </span><span>age </span></p> -->
          <p class="lastmsg" v-if="InfoList.state === 'friend'">添加您为好友</p>
          <p class="lastmsg" v-if="InfoList.state === 'group'">申请加入{{ InfoList.groupName }}群</p>
        </div>
      </div>

      <!-- <div class="my-button">
            <van-button type="primary" size="mini">查看</van-button>
          </div> -->
    </div>

    <div class="info">
      <div class="dec-info">附加信息</div>
      <div class="add-info">{{ InfoList.mes }}</div>
    </div>
    <div class="button">
      <van-button type="primary" @click.stop="agree">同意</van-button>
    </div>
    <div class="button">
      <van-button type="danger" @click.stop="refuse">拒绝</van-button>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex'

export default {
  name: 'ApplyDetail',
  data() {
    return {
      InfoList: {},
      IMG_URL: process.env.VUE_APP_IMG_URL
    }
  },
  computed: {
    ...mapState(['userInfo', 'sysNewsList'])
  },
  created() {
    this.getInfoList()
  },
  methods: {
    getInfoList() {
      this.InfoList = this.sysNewsList.filter(item => (item.self = this.$route.params.id))[0]
    },
    onClickLeft() {
      console.log('onClickLeft')
      this.$router.go(-1)
    },
    goMesPanel() {
      console.log('goMesPanel')
    },
    agree() {
      console.log('agree')

      this.$socket.emit('agree', this.InfoList)
      this.InfoList.status = '1'

      this.$store.commit('updateSysNewsList', this.InfoList)

      this.$router.push({name: 'Chat'})
    },
    refuse() {
      console.log('refuse')

      this.InfoList.status = '2'
      this.$socket.emit('refuse', this.InfoList)

      this.$store.commit('updateSysNewsList', this.InfoList)
      this.$router.push({name: 'Chat'})
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/color.scss';

.apply-detail {
  background-color: $fontBlack;

  .van-nav-bar {
    background-color: $fontBlack;
  }
  .sys-notice {
    .seesion-list {
      height: 76px;
      width: 100%;
      display: flex;
      box-sizing: border-box;
      padding: 10px 12px;
      align-items: center;
      color: $fontWhite;
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
  .info {
    padding: 10px 16px;
    display: inline-flex;

    align-items: center;
    .dec-info {
      padding-right: 20px;
      color: $fontGray;
    }
    .add-info {
      color: $fontWhite;
    }
  }
  .button {
    margin-top: 20px;
    text-align: center;
    .van-button {
      width: 90%;
      border-radius: 20px;
    }
  }
}
</style>
