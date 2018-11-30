<template>
  <v-container>
    <v-flex wrap>
      <v-card class="fill">
        <v-toolbar>
          <v-toolbar-title v-text="$t('edit_file', [file.id])" />
          <v-toolbar-items>
            <v-btn flat v-text="$t('edit')" :disabled="view === 0" @click="view = 0;"/>
            <v-btn flat v-text="$t('raw')" :disabled="view === 1" @click="view = 1;"/>
          </v-toolbar-items>
          <v-spacer />
          <v-toolbar-items>
            <v-btn flat v-text="$t('remove')" :disabled="isnew" @click="remove" color="accent"/>
            <v-btn flat v-text="$t('save')" @click="save" color="primary" />
            <v-btn flat v-text="$t('show')" :disabled="isnew" :to="'/file/show/' + id"/>
          </v-toolbar-items>
        </v-toolbar>
        <v-progress-linear indeterminate query v-if="loading" />
        <v-card-text v-show="view === 0">
          <v-text-field :label="$t('name')" v-model="file.name" />
          <v-text-field :label="$t('type')" v-model="file.type" />
          <z-markdown-editor v-model="file.description" />
          <v-combobox v-model="file.tags" :label="$t('tags')" hide-selected multiple chips clearable/>
        </v-card-text>
        <v-card-text v-show="view === 1">
          <b>{{ $t("hash") }}:</b>
          <pre style="white-space: pre-wrap; word-wrap: break-word;">{{ file.hash }}</pre>
          <br/>
          <b>{{ $t("size") }}:</b>
          <pre>{{ file.size }}</pre>
          <br/>
          <input ref="file" type="file"/>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-container>
</template>

<script>
import zMarkdownEditor from '@/components/zmarkdowneditor.vue'
import { request } from '@/http'
import { calcHash } from '@/utils'

export default {
  name: 'FileEdit',
  props: ['id'],
  components: {
    zMarkdownEditor
  },
  data () {
    return {
      file: {
        id: null,
        name: 'New file',
        type: '',
        description: '',
        hash: '',
        size: 0,
        updated: null,
        tags: ['Untagged'],
        owner: null,
        creator: null
      },
      loading: true,
      view: 0,
      isnew: false
    }
  },
  async mounted () {
    if (this.id) {
      this.load()
    } else {
      this.isnew = true
      this.loading = false
    }
  },
  methods: {
    async save () {
      this.loading = true
      if (this.$refs.file && this.$refs.file.files && this.$refs.file.files.length === 1) {
        const hash = await calcHash(this.$refs.file.files[0])
        this.file.hash = hash
        try {
          await request({ url: '/api/file/provide', params: { hash } })
          const form = new FormData()
          form.append('file', this.$refs.file.files[0])
          await request({
            url: '/api/file/provide',
            method: 'POST',
            data: form
          })
        } catch (e) {
          console.log(e.message)
        }
      }
      if (this.isnew) {
        request({
          url: '/api/file',
          params: { entry: this.$store.state.entry },
          method: 'POST',
          data: this.file
        })
          .then(id => {
            this.$router.push('/file/show/' + id)
          })
          .catch(e => {
            this.$store.commit('updateMessage', e.message)
          })
          .finally(() => {
            this.loading = false
            this.$refs.file.files = null
            this.load()
          })
      } else {
        request({
          url: '/api/file',
          params: { entry: this.$store.state.entry, id: this.id },
          method: 'PUT',
          data: this.file
        })
          .catch(e => {
            this.$store.commit('updateMessage', e.message)
          })
          .finally(() => {
            this.loading = false
            this.$refs.file.files = null
          })
      }
    },
    remove () {
      this.loading = true
      request({
        url: '/api/file',
        params: { entry: this.$store.state.entry, id: this.id },
        method: 'DELETE'
      })
        .catch(e => {
          this.$store.commit('updateMessage', e.message)
        })
        .finally(() => {
          this.$router.push('/file')
          this.loading = false
        })
    },
    load () {
      request({
        url: '/api/file',
        params: { entry: this.$store.state.entry, id: this.id }
      })
        .then(file => {
          this.file = file
        })
        .catch(e => {
          this.$store.commit('updateMessage', e.message)
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style lang="stylus" scoped>
.fill
  height 100%
  overflow hidden
</style>
