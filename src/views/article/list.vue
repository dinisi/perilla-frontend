<template>
  <v-container fluid>
    <v-layout align-center justify-center>
      <v-data-table class="fullwidth" :headers="headers" :items="articles" :pagination.sync="pagination" :total-items="total" :loading="loading">
        <template slot="items" slot-scope="props">
          <tr @click="$router.push('/article/show/' + props.item.id);">
            <td>{{ props.item.id }}</td>
            <td class="text-xs-right">{{ props.item.title }}</td>
            <td class="text-xs-right">{{ props.item.tags.join(",") }}</td>
            <td class="text-xs-right">{{ props.item.created }}</td>
            <td class="text-xs-right">{{ props.item.creator }}</td>
          </tr>
        </template>
        <template slot="actions-prepend">
          <v-btn flat v-text="$t('new')" to="/article/new" color="primary" />
        </template>
      </v-data-table>
    </v-layout>
  </v-container>
</template>

<script>
import { request } from '@/http'

export default {
  name: 'articleList',
  data () {
    return {
      headers: [
        { text: this.$t('ID'), align: 'left', sortable: true, value: 'id' },
        { text: this.$t('title'), value: 'title', class: 'text-xs-right' },
        { text: this.$t('tags'), value: 'tags', class: 'text-xs-right' },
        { text: this.$t('created'), value: 'created', class: 'text-xs-right' },
        { text: this.$t('creator'), value: 'creator', class: 'text-xs-right' }
      ],
      articles: [],
      pagination: null,
      total: 0,
      loading: true
    }
  },
  watch: {
    pagination: {
      handler: function () {
        this.fetchData()
      },
      deep: true
    }
  },
  methods: {
    fetchData () {
      this.loading = true
      const { sortBy, descending, page, rowsPerPage } = this.pagination
      const params = {}
      Promise.all([
        request({
          url: '/api/article/list',
          params: Object.assign(
            {},
            { entry: this.$store.state.entry },
            { noexec: true }
          )
        }),
        request({
          url: '/api/article/list',
          params: Object.assign(
            {},
            { entry: this.$store.state.entry },
            { skip: (page - 1) * rowsPerPage, limit: rowsPerPage }
          )
        })
      ])
        .then(([count, items]) => {
          this.total = count
          this.articles = items
        })
        .catch(e => {
          this.$store.commit('updateMessage', e.message)
        })
        .finally(() => {
          this.loading = false
        })
    }
  },
  mounted () {
    this.fetchData()
  }
}
</script>

<style lang="stylus" scoped>
.fullwidth
  width 100%
</style>
