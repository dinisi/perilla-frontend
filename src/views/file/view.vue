<template>
  <v-container fluid>
    <v-layout fill-height>
      <v-flex>
        <v-card>
          <v-card-title class="headline primary white--text">
            <div>
              <div class="headline" v-text="file.name" />
              <div class="subheading">{{ file.creator }}</div>
            </div>
          </v-card-title>
          <v-card-text>
            <div class="body-1">{{ $t("hash") }}:</div>
            <pre style="white-space: pre-wrap; word-wrap: break-word;">{{ file.hash }}</pre>
            <br/>
            <div class="body-1">{{ $t("size") }}:</div>
            <pre>{{ file.size }}</pre>
            <br/>
            <div class="body-1">{{ $t("type") }}:</div>
            <pre>{{ file.type }}</pre>
            <br/>
            <z-markdown :content="rendered"/>
          </v-card-text>
          <v-card-actions>
            <v-chip v-for="(tag, i) in file.tags" :key="i">{{ tag }}</v-chip>
            <v-spacer />
            <v-btn v-text="$t('download')" color="primary" @click="download"/>
            <v-btn v-text="$t('link')" @click="safeCopy(`[${file.name}]($${id})`)"/>
            <v-btn v-text="$t('edit')" :to="'/file/edit/' + id" />
            <v-btn v-text="$t('preview')" @click="loadPreview" color="warning" :disabled="showPreview"/>
          </v-card-actions>
        </v-card>
        <v-card v-show="showPreview" flat>
          <iframe ref="iframe" width="100%" height="640px"/>
        </v-card>
      </v-flex>
    </v-layout>
    <v-dialog v-model="downloading" persistent max-width="300">
      <v-card color="primary" dark>
        <v-card-text>
          {{ $t('downloading') }}
          <v-progress-linear v-model="progress" color="white" class="mb-0" />
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { client, request } from '@/helpers/http'
import { resolveUrl } from '@/utils'
import render from '@/helpers/markdown'
import copy from 'copy-to-clipboard'
import { showToast, showDialog } from '@/swal'
import zMarkdown from '@/components/zmarkdown'

export default {
  name: 'FileView',
  props: ['id'],
  components: {
    zMarkdown
  },
  data () {
    return {
      file: {
        id: null,
        name: 'Loading...',
        type: '',
        description: '',
        hash: '',
        size: 0,
        updated: null,
        tags: [],
        owner: null,
        creator: null
      },
      downloading: false,
      progress: 0,
      showPreview: false
    }
  },
  watch: {
    id: {
      immediate: true,
      handler: function () {
        this.$store.commit('toggleLoading', true)
        request({
          url: '/api/file',
          params: { entry: this.$store.state.entry, id: this.id }
        })
          .then(file => {
            this.file = file
          })
          .catch(e => {
            showToast('error', 'error', e.message)
          })
          .finally(() => {
            this.$store.commit('toggleLoading', false)
          })
      }
    }
  },
  computed: {
    rendered: function () {
      return render(this.file.description)
    }
  },
  methods: {
    download () {
      this.downloading = true
      client({
        url: '/api/file/raw',
        method: 'GET',
        params: { entry: this.$store.state.entry, id: this.id },
        responseType: 'blob',
        headers: {
          'x-access-token': this.$store.state.token
        },
        onDownloadProgress: e => {
          this.progress = Math.round((e.loaded * 100) / e.total)
        }
      }).then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', this.file.name)
        document.body.appendChild(link)
        link.click()
        this.progress = 100 // OCD
        this.downloading = false
      })
    },
    safeCopy (str) {
      if (copy(str)) {
        showToast('success', 'copy_succeeded')
      } else {
        showToast('error', 'copy_failed')
      }
    },
    async loadPreview () {
      if (!await showDialog('warning', 'think_twice', this.$t('load_preview_may_cause_error'))) return
      let url = resolveUrl(client.defaults.baseURL, `/api/file/raw?entry=${this.$store.state.entry}&id=${this.id}&access_token=${this.$store.state.token}`)
      this.$refs.iframe.src = url
      this.showPreview = true
    }
  }
}
</script>
