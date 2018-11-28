<template>
  <z-monaco-editor class="z-json-editor" v-model="content" language="json" :readonly="readonly"/>
</template>

<script>
import zMonacoEditor from './zmonacoeditor'

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
        this.content = JSON.stringify(this.value, null, '\t') || '{}'
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
