<template>
  <v-card class="hitokoto">
    <h2>{{ content }}</h2>
    <blockquote>—— {{ from }}</blockquote>
    <v-btn icon :loading="loading" @click="load"><v-icon>refresh</v-icon></v-btn>
  </v-card>
</template>

<script>
import { client } from '@/helpers/http'

export default {
  name: 'hitokoto',
  data () {
    return {
      content: '一起闷声大发财，一起寿命都续掉',
      from: '学蛤笑',
      loading: false
    }
  },
  created () {
    this.load()
  },
  methods: {
    async load () {
      this.loading = true
      try {
        const res = await client.get('https://v1.hitokoto.cn', { params: { c: 'a' } })
        this.content = res.data.hitokoto
        this.from = res.data.from
      } catch (e) {
        this.content = this.$t('hitokoto_error')
        this.from = e.message
      }
      this.loading = false
    }
  }
}
</script>

<style lang="stylus" scoped>
.hitokoto
  text-align end
</style>
