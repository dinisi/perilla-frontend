<template>
  <v-container fluid>
    <v-layout align-center justify-center>
      <v-data-table :rows-per-page-items="[5, 10, 15, 25, 50]" class="fullwidth" :headers="headers" :items="solutions" :pagination.sync="pagination" :total-items="total" :loading="loading">
        <template slot="items" slot-scope="props">
          <tr>
            <td>
              <router-link  :to="'/solution/show/' + props.item.id">
                {{ props.item.id }}
              </router-link>
            </td>
            <td class="text-xs-right">
              <router-link :to="'/problem/show/'+ props.item.problem">
                {{ props.item.problem }}
              </router-link>
            </td>
            <td class="text-xs-right">
              <solution-result :result="props.item.status"/>
            </td>
            <td class="text-xs-right">{{ props.item.score }}</td>
            <td class="text-xs-right">{{ props.item.created }}</td>
            <td class="text-xs-right">{{ props.item.creator }}</td>
          </tr>
        </template>
      </v-data-table>
    </v-layout>
  </v-container>
</template>

<script>
import { request } from '@/http'
import solutionResult from '@/components/solutionresult.vue'
import { getStorage, setStorage } from '@/storage'

export default {
  name: 'SolutionList',
  components: {
    solutionResult
  },
  data () {
    return {
      headers: [
        { text: this.$t('ID'), align: 'left', sortable: true, value: 'id' },
        { text: this.$t('problem'), value: 'problem', sortable: false, class: 'text-xs-right' },
        { text: this.$t('status'), value: 'status', sortable: false, class: 'text-xs-right' },
        { text: this.$t('score'), value: 'score', sortable: true, class: 'text-xs-right' },
        { text: this.$t('created'), value: 'created', sortable: true, class: 'text-xs-right' },
        { text: this.$t('creator'), value: 'creator', sortable: false, class: 'text-xs-right' }
      ],
      solutions: [],
      pagination: {
        descending: true,
        page: 1,
        rowsPerPage: getStorage(localStorage, 'lastSolutionListRPP') || 15,
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
      setStorage(localStorage, 'lastSolutionListRPP', rowsPerPage)
      const params = { sortBy, descending: descending || undefined }
      Promise.all([
        request({
          url: '/api/solution/list',
          params: Object.assign(
            { entry: this.$store.state.entry },
            { noexec: true },
            params
          )
        }),
        request({
          url: '/api/solution/list',
          params: Object.assign(
            { entry: this.$store.state.entry },
            { skip: (page - 1) * rowsPerPage, limit: rowsPerPage },
            params
          )
        })
      ])
        .then(([count, items]) => {
          this.total = count
          this.solutions = items
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
