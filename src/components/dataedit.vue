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
import { generateData as generateTrad } from '@/helpers/traditional'

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
        try {
          let raw = await generateTrad(this.$refs.files.files)
          if (raw.spj) raw.spj.file = await this.upload(raw.spj.file)
          for (let subtask of raw.subtasks) {
            for (let runcase of subtask.runcases) {
              runcase.input = await this.upload(runcase.input)
              runcase.output = await this.upload(runcase.output)
            }
          }
          this.realval = raw
          this.$store.commit('updateMessage', this.$t('upload_finished'))
        } catch (e) {
          this.$store.commit('updateMessage', e.message)
        }
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
        this.$store.commit('updateMessage', e.message)
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
