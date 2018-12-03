<template>
  <v-container fluid>
    <v-layout fill-height>
      <v-flex>
        <v-card>
          <v-card-title class="headline" v-text="$t('batch_upload')" />
          <v-card-text>
            <v-combobox v-model="tags" :label="$t('tags')" hide-selected multiple chips clearable/>
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
    </v-layout>
  </v-container>
</template>

<script>
import { request } from '@/http'
import { calcHash } from '@/utils'

export default {
  name: 'BatchUpload',
  data () {
    return {
      allProgress: 0,
      currentProgress: 0,
      log: '',
      tags: ['Batch'],
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
          this.tips = this.$t('hashing', [file.name])
          const hash = await calcHash(file, (p) => {
            this.currentProgress = Math.round(p * 100)
          })
          try {
            await request({ url: '/api/file/provide', params: { hash } })
            const form = new FormData()
            form.append('file', file)
            this.tips = this.$t('uploading', [file.name])
            await request({
              url: '/api/file/provide',
              method: 'POST',
              data: form,
              onUploadProgress: e => {
                this.currentProgress = Math.round((e.loaded * 100) / e.total)
              }
            })
          } catch (e) {
            console.log(e.message)
          }
          this.tips = this.$t('creating', [file.name])
          const id = await request({
            url: '/api/file',
            params: { entry: this.$store.state.entry },
            method: 'POST',
            data: { hash, tags: this.tags, name: file.name },
            onUploadProgress: e => {
              this.currentProgress = Math.round((e.loaded * 100) / e.total)
            }
          })
          this.log += `${file.name} → ${id}<br/>`
          this.allProgress = (++count) * 100 / files.length
        }
        this.$store.commit('updateMessage', this.$t('upload_finished'))
      }
    }
  }
}
</script>
