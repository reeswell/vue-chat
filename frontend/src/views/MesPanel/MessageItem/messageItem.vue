<template>
  <div class="vchat-messageItem mes-box">
    <p v-if="type === 'other'" class="avatar">
      <img :src="IMG_URL + v.avatar" alt="" />
    </p>
    <div v-if="type === 'other' || type === 'mine'" class="messageInfo">
      <p class="info">
        <span v-if="type === 'other' && isshowName" class="nickname">{{ v.nickname }}</span>
        <i>{{ v.time.split(' ')[1].split(':')[0] + ':' + v.time.split(' ')[1].split(':')[1] }}</i>
      </p>
      <p v-if="v.style === 'img'" class="image">
        <img v-lazy="IMG_URL + v.emoji" alt="" title="双击查看原图" />
      </p>
      <div v-if="v.style === 'file'" class="file">
        <img src="../../../assets/imgs/file.png" alt="" />
        <div>
          <p :title="v.mes">
            {{ v.mes.lastIndexOf('.') > 12 ? v.mes.slice(0, 12) + '...' + v.mes.slice(v.mes.lastIndexOf('.')) : v.mes }}
          </p>
          <a :href="IMG_URL + v.emoji" download v-if="type === 'other'">下载</a>
          <p v-if="type === 'mine'">发送成功</p>
        </div>
      </div>
      <p class="mes" v-if="v.style === 'mess'">{{ v.mes }}</p>
    </div>
    <p v-if="type === 'mine'" class="avatar">
      <img :src="IMG_URL + userInfo.avatar" alt="" />
    </p>
  </div>
</template>

<script>
import {mapState} from 'vuex'

export default {
  name: 'messageItem',
  props: ['type', 'v'],

  data() {
    return {
      IMG_URL: process.env.VUE_APP_IMG_URL,
      name: '',
      isshowName: false
    }
  },
  computed: {
    ...mapState(['userInfo', 'allChatList'])
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      // 头部信息初始化
      const id = this.$route.params.id
      if (this.userInfo.id === id) return
      const arr = this.allChatList.filter(item => item.id === id && item.type !== 'friend')
      if (arr.length) {
        this.isshowName = true
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/color.scss';

.mes-box {
  width: 100%;
  display: flex;
  .avatar {
    width: 42px;
    height: 42px;
    color: #fff;
    font-size: 14px;
    text-align: center;
    line-height: 42px;
    border-radius: 50%;
    overflow: hidden;
    img {
      width: 100%;
    }
  }
  .messageInfo {
    max-width: 250px;
    p.info {
      font-size: 14px;
      color: #000;
      margin-bottom: 5px;
      i {
        font-size: 10px;
        color: #b3b3b3;
        font-style: normal;
        margin-left: 5px;
      }
    }
    p.mes {
      background-color: $blueBgc;
      border-radius: 5px;
      padding: 8px;
      box-sizing: border-box;
      position: relative;
      text-align: left;
      word-wrap: break-word;
      font-size: 16px;
      line-height: 1.2;
      word-break: break-all;
      display: inline-block;
      color: $fontWhite;
    }

    p.image {
      max-width: 150px;
      overflow: hidden;
      border-radius: 5px;
      img {
        width: 100%;
      }
    }
    div.file {
      width: 150px;
      height: 80px;
      display: flex;
      justify-content: flex-start;
      align-content: center;
      color: $fontBlack;
      background-color: #fff;
      text-align: left;
      padding: 10px;
      box-sizing: border-box;
      border-radius: 5px;
      img {
        width: 60px;
        height: 60px;
        margin-right: 10px;
      }
      p:nth-of-type(1) {
        font-size: 16px;
        margin-bottom: 8px;
      }
      p:nth-of-type(2) {
        font-size: 12px;
        line-height: 13px;
        color: #888;
        i {
          vertical-align: text-bottom;
        }
      }
      a {
        color: #27cac7;
        font-size: 12px;
      }
    }
  }
}
.other.mes-box .messageInfo {
  text-align: left;
  margin-left: 10px;
  p.emoji {
    margin-left: 20px;
  }
  .nickname {
    color: #26c5dd;
  }
}
.other.mes-box {
  justify-content: flex-start;
}
.mine.mes-box {
  justify-content: flex-end;
}
.mine.mes-box .messageInfo {
  text-align: right;
  margin-right: 10px;
  p.emoji {
    margin-right: 20px;
  }
}
.mine.mes-box {
  justify-content: flex-end;
}
.other.mes-box .messageInfo p.mes {
  background-color: $lightBgc;
}
.other p.mes:before,
.mine p.mes:after {
  width: 0;
  height: 0;
  content: '';
  display: block;
  position: absolute;
  top: 10px;
}
.other p.mes:before {
  left: -11px;
  border-bottom: 5px solid $lightBgc;
  border-left: 10px solid transparent;
  border-right: 5px solid transparent;
  border-top: 0;
  transform: rotate(45deg);
}
.mine p.mes:after {
  right: -10px;
  border-bottom: 5px solid $blueBgc;
  border-left: 5px solid transparent;
  border-right: 10px solid transparent;
  transform: rotate(-45deg);
}
</style>