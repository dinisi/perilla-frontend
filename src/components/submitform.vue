<template>
  <div>
    <div v-if="channel === 'bzoj' || channel === 'uoj' || channel === 'loj' || channel === 'hdu' || channel === 'poj' || channel === 'traditional'">
      <v-tabs v-model="common.tab">
        <v-tab :key="0" ripple>{{ $t('select') }}</v-tab>
        <v-tab :key="1" ripple>{{ $t('upload') }}</v-tab>
        <v-tab :key="2" ripple>{{ $t('editor') }}</v-tab>
        <v-tab :key="3" ripple>{{ $t('raw') }}</v-tab>
        <v-tab-item :key="0">
          <select-file v-model="realval.file"/>
        </v-tab-item>
        <v-tab-item :key="1">
          <input type="file" ref="common_file">
          <v-btn color="primary" @click="commonFileUpload" v-text="$t('upload')" :loading="common.loading"/>
        </v-tab-item>
        <v-tab-item :key="2">
          <z-monaco-editor class="editor" v-model="common.editorContent" :language="vslanguage[realval.language] || 'plain'"/>
          <v-btn color="primary" @click="commonTextUpload" v-text="$t('upload')" :loading="common.loading"/>
        </v-tab-item>
        <v-tab-item :key="3">
          <z-json-editor v-model="realval"/>
        </v-tab-item>
      </v-tabs>
      <v-select :items="languages" v-model="realval.language" :label="$t('language')"/>
    </div>
    <z-json-editor v-else v-model="realval"/>
  </div>
</template>

<script>
import zJsonEditor from '@/components/zjsoneditor.vue'
import zMonacoEditor from '@/components/zmonacoeditor.vue'
import selectFile from '@/components/selectfile.vue'
import { calcHash } from '@/utils'
import { request } from '@/http'
import { Languages } from 'perilla-languages'
import { showToast } from '@/swal'

const languages = []
const vslanguage = {}

for (let language of Languages) {
  languages.push(language.name)
  vslanguage[language.name] = language.syntaxPattern
}

export default {
  name: 'submitForm',
  components: {
    zJsonEditor,
    selectFile,
    zMonacoEditor
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
      common: {
        loading: false,
        tab: 2,
        editorContent: ''
      },
      languages,
      vslanguage
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
    async commonFileUpload () {
      if (this.$refs.common_file && this.$refs.common_file.files && this.$refs.common_file.files.length === 1) {
        this.common.loading = true
        let id = await this.upload(this.$refs.common_file.files[0])
        this.realval = {
          file: id,
          language: this.realval.language
        }
        this.common.loading = false
        showToast('info', 'upload_finished', file.name)
      } else {
        showToast('error', invalid_operation)
      }
    },
    async commonTextUpload () {
      if (this.common.editorContent && this.common.editorContent.length) {
        const file = new File([this.common.editorContent], 'solution' + (+new Date()) + '.txt')
        this.common.loading = true
        let id = await this.upload(file)
        this.realval = {
          file: id,
          language: this.realval.language
        }
        this.common.loading = false
        showToast('info', 'upload_finished', file.name)
      } else {
        showToast('error', invalid_operation)
      }
    },
    async upload (file) {
      showToast('info', 'processing', file.name)
      const hash = await calcHash(file)
      try {
        await request({ url: '/api/file/provide', params: { hash } })
        const form = new FormData()
        form.append('file', file)
        await request({
          url: '/api/file/provide',
          method: 'POST',
          data: form,
          onUploadProgress: e => {
            this.currentProgress = Math.round((e.loaded * 100) / e.total)
          }
        })
      } catch (e) {
        // console.log(e.message)
      }
      try {
        const id = await request({
          url: '/api/file',
          params: { entry: this.$store.state.entry },
          method: 'POST',
          data: { hash, tags: ['SolutionData'], name: file.name }
        })
        return id
      } catch (err) {
        showToast('error', 'error', e.message)
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.editor
  height 500px
</style>
