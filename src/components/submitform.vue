<template>
  <div>
    <div v-if="channel === 'bzoj' || channel === 'uoj' || channel === 'loj' || channel === 'hdu' || channel === 'poj' || channel === 'traditional'">
      <selector-file v-model="realval.file"/>
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
    realval: {
      handler: function (val) {
        if (!deepCompare(val, this.value)) {
          this.$emit('updateValue', val)
        }
      },
      deep: true
    },
    value: {
      handler: function (val) {
        if (!deepCompare(val, this.realval)) {
          this.realval = val
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
