<template>
  <z-monaco-editor class="z-json-editor" v-model="content" language="json" :readonly="readonly"/>
</template>

<script>
import zMonacoEditor from './zmonacoeditor'
import { deepCompare } from '@/utils'

export default {
  name: 'zJsonEditor',
  components: {
    zMonacoEditor
  },
  props: ['value', 'readonly'],
  model: {
    prop: 'value',
    event: 'updateValue'
  },
  data () {
    return {
      content: ''
    }
  },
  mounted () {
    this.content = JSON.stringify(this.value, null, '\t')
  },
  watch: {
    content (val) {
      try {
        const parsed = JSON.parse(val)
        this.$emit('updateValue', parsed)
      } catch (e) {
        // Eat any error
      }
    },
    value: {
      handler: function (val) {
        let newContent = JSON.stringify(this.value, null, '\t')
        let obj = JSON.parse(this.content)
        if (!deepCompare(val, obj)) {
          this.content = newContent
        }
      },
      deep: true
    }
  }
}
</script>

<style lang="stylus" scoped>
.z-json-editor
  height 500px
</style>
