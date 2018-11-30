<template>
  <v-container fluid>
    <v-layout fill-height>
      <v-flex sm12>
        <v-card>
          <v-card-title>
            <div>
              <div class="headline" v-text="article.title" />
              <div class="subheading">{{ article.creator }}</div>
            </div>
          </v-card-title>
          <v-card-text>
            <article class="markdown-body" v-html="rendered" />
          </v-card-text>
          <v-card-actions>
            <v-chip v-for="(tag, i) in article.tags" :key="i">{{ tag }}</v-chip>
            <v-spacer />
            <v-btn v-text="$t('edit')" :to="'/article/edit/' + id" />
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
    <v-dialog v-model="loading" persistent width="300">
      <v-card color="primary" dark>
        <v-card-text>
          {{ $t('please_wait') }}
          <v-progress-linear indeterminate color="white" class="mb-0" />
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { request } from '@/http'
import render from '@/helper/markdown'

export default {
  name: 'articleView',
  props: ['id'],
  data () {
    return {
      article: {
        id: null,
        title: 'New article',
        content: null,
        tags: ['Untagged'],
        updated: null,
        owner: null,
        creator: null
      },
      loading: true
    }
  },
  mounted () {
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
  },
  computed: {
    rendered: function () {
      return render(this.article.content)
    }
  },
  methods: {
  }
}
</script>
