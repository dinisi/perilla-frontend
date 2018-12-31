<template>
  <div>
    <div class="z-markdown-editor-main">
      <z-monaco-editor :class="`z-markdown-editor-${view}`" v-model="content" language="markdown" :theme="$store.state.darkTheme ? 'vs-dark': 'vs'"/>
      <div :class="`z-markdown-preview-${view}`">
        <z-markdown ref="rendered" :content="rendered"/>
      </div>
    </div>
    <v-slider v-model="view" :tick-labels="ticksLabels" :max="2" step="1" ticks="always"/>
  </div>
</template>

<script>
import zMonacoEditor from '@/components/zmonacoeditor'
import zMarkdown from '@/components/zmarkdown'
import render from '@/helpers/markdown'

export default {
  name: 'zMarkdownEditor',
  components: {
    zMonacoEditor,
    zMarkdown
  },
  props: ['value'],
  model: {
    prop: 'value',
    event: 'updateValue'
  },
  data () {
    return {
      content: '',
      rendered: '',
      view: 1,
      ticksLabels: [this.$t('editor'), this.$t('both'), this.$t('preview')],
      lastRender: 0,
      isRendering: false
    }
  },
  created () {
    this.content = this.value || this.content
    this.rendered = render(this.content)
  },
  watch: {
    content (val) {
      if (val === this.value) return
      this.$emit('updateValue', val)
      if (this.view) this.triggerRender()
    },
    value (val) {
      if (val === this.content) return
      this.content = val
      if (this.view) this.triggerRender()
    },
    view (val) {
      if (val) this.triggerRender()
    }
  },
  methods: {
    triggerRender () {
      if (this.isRendering) return
      const now = +new Date()
      if (now - this.lastRender > 500) {
        this.isRendering = true
        this.rendered = render(this.content)
        this.lastRender = now
        this.isRendering = false
      } else {
        if (!this.isRendering) {
          this.isRendering = true
          setTimeout(() => {
            this.isRendering = false
            this.triggerRender()
          }, 500)
        }
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.z-markdown-editor-main
  height 500px

.z-markdown-editor-0
  height 500px

.z-markdown-editor-1
  width 50%
  float left
  height 500px
  border-right 1px solid #c1c1c1

.z-markdown-editor-2
  display none

.z-markdown-preview-0
  display none

.z-markdown-preview-1
  width 50%
  float left
  height 500px
  overflow scroll
  border-left 1px solid #c1c1c1

.z-markdown-preview-2
  height 500px
  overflow scroll
</style>
