<template>
  <v-container fluid>
    <v-layout fill-height>
      <v-flex>
        <v-card>
          <v-toolbar>
            <v-toolbar-title v-text="$t('edit_problem', [problem.id])" />
            <v-toolbar-items>
              <v-btn flat v-text="$t('edit')" :disabled="view === 0" @click="view = 0;"/>
              <v-btn flat v-text="$t('data')" :disabled="view === 1" @click="view = 1;"/>
              <v-btn flat v-text="$t('import')" @click="showImport = 1"/>
            </v-toolbar-items>
            <v-spacer />
            <v-toolbar-items>
              <v-btn flat v-text="$t('remove')" :disabled="isnew" @click="remove" color="accent"/>
              <v-btn flat v-text="$t('save')" @click="save" color="primary" /><v-btn flat v-text="$t('show')" :disabled="isnew" :to="'/problem/show/' + id"/>
            </v-toolbar-items>
          </v-toolbar>
          <v-progress-linear indeterminate query v-if="loading" />
          <v-card-text v-show="view === 0">
            <v-text-field :label="$t('title')" v-model="problem.title" />
            <z-markdown-editor v-model="problem.content" />
            <v-combobox v-model="problem.tags" :label="$t('tags')" hide-selected multiple chips clearable/>
          </v-card-text>
          <v-card-text v-show="view === 1">
            <v-text-field :label="$t('channel')" v-model="problem.channel" />
            <data-edit v-model="problem.data" :channel="problem.channel"/>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
    <v-dialog v-model="showImport" max-width="500">
      <v-card>
        <v-card-title class="headline" v-text="$t('import')"/>
        <v-card-text>
          <z-json-editor v-model="importObj"/>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn v-text="$t('cancel')" @click="showImport = 0"/>
          <v-btn color="primary" v-text="$t('apply')" @click="doImport"/>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import zJsonEditor from '@/components/zjsoneditor.vue'
import zMarkdownEditor from '@/components/zmarkdowneditor.vue'
import dataEdit from '@/components/dataedit.vue'
import { request } from '@/http'
import { showToast } from '@/swal'

export default {
  name: 'ProblemEdit',
  components: {
    zJsonEditor,
    zMarkdownEditor,
    dataEdit
  },
  props: ['id'],
  data () {
    return {
      problem: {
        id: null,
        title: 'New problem',
        content: '',
        data: {},
        channel: null,
        tags: ['Untagged'],
        updated: null,
        owner: null,
        creator: null
      },
      loading: true,
      view: 0,
      isnew: false,
      showImport: false,
      importObj: {}
    }
  },
  watch: {
    'id': {
      handler: function () {
        if (this.id) {
          this.load()
        } else {
          this.isnew = true
          this.loading = false
        }
      },
      immediate: true
    }
  },
  methods: {
    async save () {
      this.loading = true
      if (this.isnew) {
        request({
          url: '/api/problem',
          params: { entry: this.$store.state.entry },
          method: 'POST',
          data: this.problem
        })
          .then(id => {
            this.$router.push('/problem/show/' + id)
          })
          .catch(e => {
            showToast('error', 'error', e.message)
          })
          .finally(() => {
            this.loading = false
          })
      } else {
        request({
          url: '/api/problem',
          params: { entry: this.$store.state.entry, id: this.id },
          method: 'PUT',
          data: this.problem
        })
          .catch(e => {
            showToast('error', 'error', e.message)
          })
          .finally(() => {
            this.loading = false
          })
      }
    },
    remove () {
      this.loading = true
      request({
        url: '/api/problem',
        params: { entry: this.$store.state.entry, id: this.id },
        method: 'DELETE'
      })
        .catch(e => {
          showToast('error', 'error', e.message)
        })
        .finally(() => {
          this.$router.push('/problem')
          this.loading = false
        })
    },
    load () {
      request({
        url: '/api/problem',
        params: { entry: this.$store.state.entry, id: this.id }
      })
        .then(problem => {
          this.problem = problem
        })
        .catch(e => {
          showToast('error', 'error', e.message)
        })
        .finally(() => {
          this.loading = false
        })
    },
    doImport () {
      this.problem.title = this.importObj.title || this.problem.title
      this.problem.content = this.importObj.content || this.problem.content
      this.problem.data = this.importObj.data || this.problem.data
      this.problem.channel = this.importObj.channel || this.problem.channel
      this.problem.tags = this.importObj.tags || this.problem.tags
      this.showImport = false
    }
  }
}
</script>
