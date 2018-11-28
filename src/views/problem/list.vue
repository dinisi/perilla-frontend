<template>
  <v-container fluid>
    <v-layout align-center justify-center>
      <v-data-table :rows-per-page-items="[5, 10, 15, 25, 50]" class="fullwidth" :headers="headers" :items="problems" :pagination.sync="pagination" :total-items="total" :loading="loading">
        <template slot="items" slot-scope="props">
          <tr>
            <td>
              <router-link  :to="'/problem/show/' + props.item.id">
                {{ props.item.id }}
              </router-link>
            </td>
            <td class="text-xs-right">{{ props.item.title }}</td>
            <td class="text-xs-right">
              <v-chip v-for="(tag, i) in props.item.tags" :key="i">{{ tag }}</v-chip>
            </td>
            <td class="text-xs-right">{{ props.item.created }}</td>
            <td class="text-xs-right">{{ props.item.creator }}</td>
          </tr>
        </template>
        <template slot="actions-prepend">
          <v-btn flat v-text="$t('new')" to="/problem/new" color="primary" />
        </template>
      </v-data-table>
    </v-layout>
  </v-container>
</template>

<script>
import { request } from '@/http'
import { getStorage, setStorage } from '@/storage'

export default {
  name: 'ProblemList',
  data () {
    return {
      headers: [
        { text: this.$t('ID'), align: 'left', sortable: true, value: 'id' },
        { text: this.$t('title'), value: 'title', sortable: true, class: 'text-xs-right' },
        { text: this.$t('tags'), value: 'tags', sortable: false, class: 'text-xs-right' },
        { text: this.$t('created'), value: 'created', sortable: true, class: 'text-xs-right' },
        { text: this.$t('creator'), value: 'creator', sortable: false, class: 'text-xs-right' }
      ],
      problems: [],
      pagination: {
        descending: false,
        page: 1,
        rowsPerPage: getStorage(localStorage, 'lastProblemListRPP') || 15,
        sortBy: 'id',
        totalItems: 0
      },
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
      setStorage(localStorage, 'lastProblemListRPP', rowsPerPage)
      const params = { sortBy, descending: descending || undefined }
      Promise.all([
        request({
          url: '/api/problem/list',
          params: Object.assign(
            { entry: this.$store.state.entry },
            { noexec: true },
            params
          )
        }),
        request({
          url: '/api/problem/list',
          params: Object.assign(
            { entry: this.$store.state.entry },
            { skip: (page - 1) * rowsPerPage, limit: rowsPerPage },
            params
          )
        })
      ])
        .then(([count, items]) => {
          this.total = count
          this.problems = items
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
