<template>
  <div class="emoji">
    <ul class="emoji-default">
      <li v-for="(m, n) in emojiJson" :key="n" @click.stop="chooseEmoji(m)">
        {{ m }}
      </li>
    </ul>
  </div>
</template>

<script>
import emojiJson from '@/utils/emoji'

export default {
  name: 'Emoji',
  data() {
    return {
      emojiJson: emojiJson.data.split(',')
    }
  },
  methods: {
    chooseEmoji(me) {
      this.$emit('chooseEmoji', me)
    }
  }
}
</script>

<style lang="scss" scoped>
.emoji {
  width: 100%;
  height: 100%;
  overflow-y: auto;

  .emoji-default {
    text-align: center;
    width: 100%;
    li {
      display: inline-block;
      padding: 5px;
      width: 22px;
      height: 22px;
      line-height: 22px;
      overflow: hidden;
      cursor: pointer;
    }
    li:active {
      background-color: #fff;
    }
  }
}
</style>
