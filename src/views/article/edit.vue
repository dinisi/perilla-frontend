<template>
  <v-container fluid>
    <v-layout fill-height>
      <v-flex>
        <v-card>
          <v-toolbar>
            <v-toolbar-title v-text="$t('edit_article', [article.id])" />
            <v-spacer />
            <v-toolbar-items>
              <v-btn flat v-text="$t('remove')" :disabled="isnew" @click="remove" color="accent"/>
              <v-btn flat v-text="$t('save')" @click="save" color="primary" /><v-btn flat v-text="$t('show')" :disabled="isnew" :to="'/article/show/' + id"/>
            </v-toolbar-items>
          </v-toolbar>
          <v-progress-linear indeterminate query v-if="loading" />
          <v-card-text>
            <v-text-field :label="$t('title')" v-model="article.title" />
            <z-markdown-editor v-model="article.content" />
            <v-combobox v-model="article.tags" :label="$t('tags')" hide-selected multiple chips clearable/>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import zMarkdownEditor from '../..//components/zmarkdowneditor.vue'
import { request } from '../..//http'

export default {
  name: 'articleEdit',
  components: {
    zMarkdownEditor
  },
  props: ['id'],
  data () {
    return {
      article: {
        id: null,
        title: 'New article',
        content: 'No content',
        tags: ['Untagged'],
        updated: null,
        owner: null,
        creator: null
      },
      loading: true,
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
      if (this.isnew) {
        request({
          url: '/api/article',
          params: { entry: this.$store.state.entry },
          method: 'POST',
          data: this.article
        })
          .then(id => {
            this.$router.push('/article/show/' + id)
          })
          .catch(e => {
            this.$store.commit('updateMessage', e.message)
          })
          .finally(() => {
            this.loading = false
          })
      } else {
        request({
          url: '/api/article',
          params: { entry: this.$store.state.entry, id: this.id },
          method: 'PUT',
          data: this.article
        })
          .catch(e => {
            this.$store.commit('updateMessage', e.message)
          })
          .finally(() => {
            this.loading = false
          })
      }
    },
    remove () {
      this.loading = true
      request({
        url: '/api/article',
        params: { entry: this.$store.state.entry, id: this.id },
        method: 'DELETE'
      })
        .catch(e => {
          this.$store.commit('updateMessage', e.message)
        })
        .finally(() => {
          this.$router.push('/article')
          this.loading = false
        })
    },
    load () {
      request({
        url: '/api/article',
        params: { entry: this.$store.state.entry, id: this.id }
      })
        .then(article => {
          this.article = article
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
