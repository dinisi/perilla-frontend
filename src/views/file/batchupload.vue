<template>
  <v-container>
    <v-flex wrap>
      <v-card class="fill">
        <v-card-title class="headline" v-text="$t('batch_upload')" />
        <v-card-text>
          <v-combobox v-model="tags" :label="$t('tags')" hide-selected multiple chips clearable/>
          <z-markdown-editor v-model="description" />

          <input ref="file" type="file" multiple/>
          <pre v-text="$t('all_progress')"/>
          <v-progress-linear v-model="allProgress"/>
          <pre v-text="tips"/>
          <v-progress-linear v-model="currentProgress"/>
          <pre v-html="log"/>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" @click="upload" v-text="$t('upload')" />
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-container>
</template>

<script>
import zMarkdownEditor from '@/components/zMarkdownEditor.vue'
import { request } from '@/http'

export default {
  name: 'BatchUpload',
  components: {
    zMarkdownEditor
  },
  data () {
    return {
      allProgress: 0,
      currentProgress: 0,
      log: '',
      tags: ['Batch'],
      description: '',
      tips: ''
    }
  },
  methods: {
    async upload () {
      const files = this.$refs.file.files
      if (files) {
        let count = 0
        for (let file of files) {
          this.currentProgress = 0
          this.tips = this.$t('uploading', [file.name])
          const form = new FormData()
          form.append('file', file)
          if (this.description) {
            form.append('description', this.description)
          }
          if (this.tags) {
            form.append('tags', JSON.stringify(this.tags))
          }
          try {
            const id = await request({
              url: '/api/file',
              params: { entry: this.$store.state.entry },
              method: 'POST',
              data: form,
              onUploadProgress: e => {
                this.currentProgress = Math.round((e.loaded * 100) / e.total)
              }
            })
            this.log += `${file.name} → ${id}<br/>`
          } catch (e) {
            this.$store.commit('updateMessage', e.message)
          }
          this.allProgress = (++count) * 100 / files.length
        }
        this.$store.commit('updateMessage', this.$t('upload_finished'))
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.fill
  height 100%
  overflow hidden
</style>
