<template>
  <div>
    <div v-if="channel === 'bzoj' || channel === 'uoj' || channel === 'loj' || channel === 'hdu' || channel === 'poj' || channel === 'traditional'">
      <select-file v-model="realval.file"/>
      <input type="file" ref="common_file">
      <v-btn color="primary" @click="commonUpload" v-text="common.file.disabled ? $t('upload_finished') : $t('upload')" :disabled="common.file.disabled" :loading="common.file.loading"/>
      <v-select :items="languages" v-model="realval.language" :label="$t('language')"/>
    </div>
    <z-json-editor v-model="realval" v-else/>
  </div>
</template>

<script>
import zJsonEditor from '@/components/zjsoneditor.vue'
import selectFile from '@/components/selectfile.vue'
import { calcHash } from '@/utils'
import { request } from '@/http'

const languages = [
  'c',
  'cpp98',
  'cpp11',
  'java',
  'csharp',
  'python2',
  'python3',
  'node'
]

export default {
  name: 'submitForm',
  components: {
    zJsonEditor,
    selectFile
  },
  props: ['value', 'channel'],
  model: {
    prop: 'value',
    event: 'updateValue'
  },
  data () {
    return {
      realval: {
        //
      },
      languages,
      common: {
        file: {
          disabled: false,
          loading: false
        }
      }
    }
  },
  mounted () {
    this.content = JSON.stringify(this.value, null, '\t')
  },
  watch: {
    realval: {
      handler: function (val) {
        this.$emit('updateValue', val)
      },
      deep: true
    },
    value: {
      handler: function (val) {
        this.realval = val
      },
      deep: true
    }
  },
  methods: {
    async commonUpload () {
      if (this.$refs.common_file && this.$refs.common_file.files) {
        this.common.file.loading = true
        let id = await this.upload(this.$refs.common_file.files[0])
        this.realval = {
          file: id
        }
        this.common.file.loading = false
        this.common.file.disabled = true
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
        data: { hash, tags: ['SolutionData'], name: file.name }
      })
      return id
    }
  }
}
</script>

<style lang="stylus" scoped>
.z-json-editor
  height 500px
</style>
