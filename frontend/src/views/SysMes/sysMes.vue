<template>
  <div class="sys-mes">
    <van-nav-bar title="通知" left-text="返回" left-arrow @click-left="onClickLeft" />
    <div class="sys-notice" v-if="sysNewsList.length">
      <ul>
        <van-swipe-cell>
          <li class="seesion-list first-li" v-for="(item, index) in sysNewsList" :key="index">
            <div class="list-left">
              <van-image round width="56px" height="56px" :src="IMG_URL + item.avatar" class="avatar" />
            </div>
            <div class="list-right">
              <div class="first-line">
                <p class="name">{{ item.nickname }}</p>
                <span class="time">{{ item.time }}</span>
              </div>
              <p class="lastmsg">{{ item.mes }}</p>
            </div>
            <div class="my-button">
              <van-button type="primary" size="mini" v-if="item.status === '0'" @click.stop="goDetail(item.self)"
                >查看</van-button
              >
              <van-button type="default" size="mini" v-else>已查看</van-button>
            </div>
          </li>
          <template #right>
            <van-button square type="danger" text="删除" />
          </template>
        </van-swipe-cell>
      </ul>
    </div>
  </div>
</template>

<script>
import {mapState, mapGetters} from 'vuex'

export default {
  name: 'SysMes',
  data() {
    return {
      offset: 1,
      limit: 10,
      IMG_URL: process.env.VUE_APP_IMG_URL
    }
  },
  computed: {
    ...mapState(['sysNewsList', 'sysInfo', 'userInfo']),
    ...mapGetters(['getSysUnRead'])
  },

  created() {
    this.init()
  },
  sockets: {
    //获取系统消息

    getSysMeg(mes) {
      console.log(mes)
      this.$store.dispatch('setSysNewsList', mes)
    }
  },
  methods: {
    init() {
      if (!this.getSysUnRead.length || this.getSysUnRead[0].count === 0) return
      console.log('333333')
      this.$store.commit('setUnRead', {roomId: this.sysInfo.id, clear: true})
      this.$socket.emit('setReadStatus', {roomId: this.sysInfo.id, userName: this.userInfo.userName})
      this.$socket.emit('getSysMeg', {roomId: this.sysInfo.id, offset: this.offset, limit: this.limit})
    },
    onClickLeft() {
      console.log('onClickLeft')
      this.$router.go(-1)
    },
    onClickRight() {
      console.log('onClickRight')
    },
    goMesPanel() {
      console.log('goMesPanel')
    },
    goDetail(id) {
      console.log('goDetail')
      this.$router.push({name: 'ApplyDetail', params: {id: id}})
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/color.scss';

.sys-mes {
  background-color: $deepBgc;

  .van-nav-bar {
    background-color: $deepBgc;
  }

  .van-cell {
    background-color: $lightBgc;
    color: $fontGray;
  }
  .sys-notice {
    top: 100px;
    bottom: 50px;
    width: 100%;
    overflow: hidden;
    .seesion-list {
      height: 76px;
      width: 100%;
      display: flex;
      box-sizing: border-box;
      padding: 10px 12px;
      align-items: center;
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
          height: 20px;
          .name {
            flex: 1;
            margin-bottom: 4px;
            font-size: 16px;
            color: $fontWhite;
            font-weight: 700;
          }
          .time {
            width: 70px;
            color: $fontGray;
            font-size: 10px;
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
  .van-swipe-cell {
    .van-swipe-cell__right,
    .van-swipe-cell__left {
      button {
        height: 76px;
        width: 50px;
      }
    }
  }
}
</style>
