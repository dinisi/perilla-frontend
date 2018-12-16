<template>
  <v-container fluid>
    <v-layout fill-height>
      <v-flex sm12>
        <v-card>
          <v-card-title class="headline" v-text="$t('debugger')"/>
          <v-card-text>
            <z-monaco-editor v-model="code" language="javascript" class="debug-editor"/>
          </v-card-text>
          <v-card-actions>
            <code>{{ returnVal }}</code>
            <v-spacer/>
            <v-btn color="warning" v-text="$t('reset')" @click="reset"/>
            <v-btn color="primary" v-text="$t('run')" @click="run"/>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import zMonacoEditor from '@/components/zmonacoeditor.vue'
import { showToast } from '@/swal'

const defaultCode = `// This is a place to run your own code
// client: AxiosClient
// request: A wrapped function to send request with x-auth-token
// swal: SweetAlert2
// Have fun!
`

export default {
  name: 'debug',
  components: {
    zMonacoEditor
  },
  data () {
    return {
      code: defaultCode,
      returnVal: undefined
    }
  },
  methods: {
    reset () {
      this.code = defaultCode
    },
    async run () {
      try {
        const { client, request } = require('@/http')
        const swal = require('sweetalert2')
        const iziToast = require('izitoast')
        // eslint-disable-next-line no-eval
        this.returnVal = JSON.stringify(eval(this.code)) || 'undefined'
        showToast('success', 'succeeded')
      } catch (e) {
        showToast('error', 'error', e.message)
        this.returnVal = e.message
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.debug-editor
 height 512px
</style>
