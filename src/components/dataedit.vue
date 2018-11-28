<template>
  <div>
    <div v-if="channel === 'bzoj' || channel === 'uoj' || channel === 'loj' || channel === 'hdu' || channel === 'poj'">
      <v-text-field v-model="remote_id" :label="$t('id')" type="number"/>
    </div>
    <div v-else-if="channel === 'traditional'">
      <input type="file" multiple ref="files">
      <v-btn color="primary" @click="applyTrad" v-text="$t('apply')" :loading="trad.apply_loading"/>
    </div>
    <z-json-editor v-model="realval"/>
  </div>
</template>

<script>
import { calcHash } from '@/utils'
import zJsonEditor from '@/components/zjsoneditor.vue'
import { request } from '@/http'

export default {
  name: 'dataEdit',
  components: {
    zJsonEditor
  },
  props: ['value', 'channel'],
  model: {
    prop: 'value',
    event: 'update'
  },
  data () {
    return {
      realval: {
        //
      },
      remote_id: null,
      trad: {
        apply_loading: false
      }
    }
  },
  mounted () {
    this.realval = this.value || {}
  },
  watch: {
    realval: {
      handler: function (val) {
        this.$emit('update', val)
      },
      deep: true
    },
    value: {
      handler: function (val) {
        this.realval = val || {}
      },
      deep: true
    },
    remote_id: function (val) {
      val = parseInt(val)
      if (typeof val === 'number') {
        this.realval = { id: val }
      }
    }
  },
  methods: {
    async applyTrad () {
      if (this.$refs.files && this.$refs.files.files) {
        this.trad.apply_loading = true
        const files = this.$refs.files.files
        let map = new Map()
        for (let file of files) {
          let filename = file.name
          filename = filename.substring(0, filename.lastIndexOf('.'))
          if (!filename) continue
          let ext = file.name.substr(filename.length + 1)
          if (!ext) continue
          console.log(filename)
          console.log(ext)
          map[filename] = map[filename] || {}
          if (['in'].includes(ext)) {
            map[filename].input = map[filename].input || file
          }
          if (['ans', 'out'].includes(ext)) {
            map[filename].output = map[filename].output || file
          }
        }
        let runcases = []
        for (let key in map) {
          if (map[key].input && map[key].output) {
            runcases.push({
              input: await this.upload(map[key].input),
              output: await this.upload(map[key].output),
              desc: key
            })
          }
        }
        this.realval = {
          subtasks: [
            {
              name: 'Default',
              timeLimit: 1,
              memoryLimit: 524288,
              score: 100,
              runcases,
              dependency: []
            }
          ]
        }
        this.$store.commit('updateMessage', this.$t('upload_finished'))
        this.trad.apply_loading = false
      }
    },
    async upload (file) {
      this.$store.commit('updateMessage', this.$t('hashing', [file.name]))
      const hash = await calcHash(file)
      try {
        await request({ url: '/api/file/provide', params: { hash } })
        const form = new FormData()
        form.append('file', file)
        this.$store.commit('updateMessage', this.$t('uploading', [file.name]))
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
      this.$store.commit('updateMessage', this.$t('creating', [file.name]))
      const id = await request({
        url: '/api/file',
        params: { entry: this.$store.state.entry },
        method: 'POST',
        data: { hash, tags: ['TestData'], name: file.name }
      })
      return id
    }
  }
}
</script>
