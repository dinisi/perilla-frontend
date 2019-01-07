<template>
  <v-container fluid>
    <v-layout fill-height>
      <v-flex sm12>
        <v-card>
          <v-tabs v-model="tab">
            <v-tab :key="0" ripple>{{ $t('debugger') }}</v-tab>
            <v-tab :key="1" ripple>{{ $t('diff') }}</v-tab>
            <v-tab-item :key="0">
              <z-monaco-editor v-model="code" language="javascript" class="debug-editor" :theme="$store.state.darkTheme ? 'vs-dark': 'vs'"/>
              <v-btn color="warning" v-text="$t('reset')" @click="reset"/>
              <v-btn color="primary" v-text="$t('run')" @click="run"/>
              <code>{{ returnVal }}</code>
            </v-tab-item>
            <v-tab-item :key="1">
              <!-- Not implemented -->
            </v-tab-item>
          </v-tabs>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import zMonacoEditor from '@/components/zmonacoeditor.vue'
import { showToast } from '@/swal'

const defaultCode = `// This is a place to run your own code
// client: AxiosClient https://www.npmjs.com/package/axios
// request: A wrapped function to send request with x-auth-token
// swal: SweetAlert2 https://www.npmjs.com/package/sweetalert2
// iziToast: iziToast https://www.npmjs.com/package/izitoast
// Have fun!

const rejudgeAll = (entry, id) => {
    return request({
        url: '/api/problem/rejudge',
        params: {
            entry,
            id
        },
        method: 'POST'
    })
}

const listSystemAdministrators = (skip, limit) => {
    return request({
        url: '/api/systemmap/list',
        params: {
            skip,
            limit
        }
    })
}

const setSystemAdministrator = (user) => {
    return request({
        url: '/api/systemmap',
        params: {
            user
        },
        method: 'POST'
    })
}

const unsetSystemAdministrator = (user) => {
    return request({
        url: '/api/systemmap',
        params: {
            user
        },
        method: 'DELETE'
    })
}
`

export default {
  name: 'debug',
  components: {
    zMonacoEditor
  },
  data () {
    return {
      code: defaultCode,
      returnVal: undefined,
      tab: 0
    }
  },
  methods: {
    reset () {
      this.code = defaultCode
    },
    async run () {
      try {
        const { client, request } = require('@/helpers/http')
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
