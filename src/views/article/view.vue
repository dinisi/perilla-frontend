<template>
  <v-container fluid>
    <v-layout fill-height>
      <v-flex sm12>
        <v-card>
          <v-card-title class="headline primary white--text">
            <div>
              <div class="headline" v-text="article.title" />
              <div class="subheading">{{ article.creator }}</div>
            </div>
          </v-card-title>
          <v-card-text>
            <z-markdown :content="rendered"/>
          </v-card-text>
          <v-card-actions>
            <v-chip v-for="(tag, i) in article.tags" :key="i">{{ tag }}</v-chip>
            <v-spacer />
            <v-btn v-text="$t('edit')" :to="'/article/edit/' + id" />
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { request } from '@/helpers/http'
import render from '@/helpers/markdown'
import { showToast } from '@/swal'
import zMarkdown from '@/components/zmarkdown'

export default {
  name: 'articleView',
  props: ['id'],
  components: {
    zMarkdown
  },
  data () {
    return {
      article: {
        id: null,
        title: 'Loading...',
        content: null,
        tags: [],
        updated: null,
        owner: null,
        creator: null
      }
    }
  },
  watch: {
    id: {
      immediate: true,
      handler: function () {
        this.$store.commit('toggleLoading', true)
        request({
          url: '/api/article',
          params: { entry: this.$store.state.entry, id: this.id }
        })
          .then(article => {
            this.article = article
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
      return render(this.article.content)
    }
  },
  methods: {
  }
}
</script>
