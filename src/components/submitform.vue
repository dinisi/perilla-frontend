<template>
  <div>
    <div v-if="channel === 'bzoj' || channel === 'uoj' || channel === 'loj' || channel === 'hdu' || channel === 'poj' || channel === 'traditional'">
      <selector-file v-model="realval.id"/>
      <v-select :items="languages" v-model="realval.language" :label="$t('language')"/>
    </div>
    <z-json-editor v-model="realval" v-else/>
  </div>
</template>

<script>
import zJsonEditor from '@/components/zjsoneditor.vue'
import selectorFile from '@/components/selectfile.vue'
import { deepCompare } from '@/utils'

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
    selectorFile
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
      languages
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
