<template>
  <div>
    <div v-if="channel === 'bzoj' || channel === 'uoj' || channel === 'loj' || channel === 'hdu' || channel === 'poj'">
      <v-text-field v-model="realval.id" :label="$t('id')" type="number"/>
    </div>
    <z-json-editor v-model="realval" v-else/>
  </div>
</template>

<script>
import { deepCompare } from '@/utils'
import zJsonEditor from '@/components/zjsoneditor.vue'

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
    }
  }
}
</script>

<style lang="stylus" scoped>
.z-json-editor
  height 500px
</style>
