<template>
  <div>
    <v-tabs v-model="tab">
      <v-tab :key="0" ripple>{{ $t('select') }}</v-tab>
      <v-tab :key="1" ripple>{{ $t('upload') }}</v-tab>
      <v-tab :key="2" ripple>{{ $t('editor') }}</v-tab>
      <v-tab-item :key="0">
        <select-file v-model="selectedFile"/>
      </v-tab-item>
      <v-tab-item :key="1">
        <input type="file" ref="common_file">
        <v-btn color="primary" @click="commonFileUpload" v-text="$t('upload')" :loading="loading"/>
      </v-tab-item>
      <v-tab-item :key="2">
        <z-monaco-editor class="editor" v-model="editorContent" :language="selectedLanguage.syntaxPattern" :theme="$store.state.darkTheme ? 'vs-dark': 'vs'"/>
        <v-btn color="primary" @click="commonTextUpload" v-text="$t('upload')" :loading="loading"/>
      </v-tab-item>
    </v-tabs>
    <v-select :items="Languages" v-model="selectedLanguage" :hint="selectedLanguage.description" item-text="name" item-value="name" return-object persistent-hint :label="$t('language')"/>
  </div>
</template>

<script>
import zJsonEditor from '@/components/zjsoneditor.vue'
import zMonacoEditor from '@/components/zmonacoeditor.vue'
import selectFile from '@/components/selectfile.vue'
import { calcHash } from '@/utils'
import { request } from '@/helpers/http'
import { Languages } from 'perilla-languages'
import { showToast } from '@/swal'

export default {
  name: 'traditionalSubmit',
  components: {
    selectFile,
    zMonacoEditor
  },
  props: ['value'],
  model: {
    prop: 'value',
    event: 'updateValue'
  },
  data () {
    return {
      loading: false,
      tab: 2,
      editorContent: '',
      selectedLanguage: {
        name: 'cpp17',
        description: 'C++ 17',
        syntaxPattern: 'cpp',
        ext: 'cpp'
      },
      selectedFile: undefined,
      Languages
    }
  },
  mounted () {
    this.content = JSON.stringify(this.value, null, '\t')
  },
  watch: {
    selectedFile: function (val) {
      this.$emit('updateValue', { file: val, language: this.selectedLanguage.name })
      this.validate()
    },
    selectedLanguage: {
      handler: function (val) {
        this.$emit('updateValue', { file: this.selectedFile, language: val.name })
        this.validate()
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    validate () {
      if (this.selectedFile && this.selectedLanguage) {
        this.$emit('update:valid', true)
      } else {
        this.$emit('update:valid', false)
      }
    },
    async commonFileUpload () {
      if (this.$refs.common_file && this.$refs.common_file.files && this.$refs.common_file.files.length === 1) {
        this.loading = true
        this.selectedFile = await this.upload(this.$refs.common_file.files[0])
        this.loading = false
        showToast('success', 'upload_finished', file.name)
      } else {
        showToast('error', invalid_operation)
      }
    },
    async commonTextUpload () {
      if (this.editorContent && this.editorContent.length) {
        const ext = this.selectedLanguage.ext || 'txt'
        const file = new File([this.editorContent], `solution${+new Date()}.${ext}`)
        this.loading = true
        this.selectedFile = await this.upload(file)
        this.loading = false
        showToast('success', 'upload_finished', file.name)
      } else {
        showToast('error', invalid_operation)
      }
    },
    async upload (file) {
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
