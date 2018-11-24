<template>
  <v-container fluid>
    <v-layout align-center justify-center>
      <v-data-table :rows-per-page-items="[5, 10, 25, 50]" class="fullwidth" :headers="headers" :items="files" :pagination.sync="pagination" :total-items="total" :loading="loading">
        <template slot="items" slot-scope="props">
          <tr @click="$router.push('/file/show/' + props.item.id);">
            <td>{{ props.item.id }}</td>
            <td class="text-xs-right">{{ props.item.name }}</td>
            <td class="text-xs-right">{{ props.item.type }}</td>
            <td class="text-xs-right">{{ props.item.tags.join(",") }}</td>
            <td class="text-xs-right">{{ props.item.created }}</td>
            <td class="text-xs-right">{{ props.item.creator }}</td>
          </tr>
        </template>
        <template slot="actions-prepend">
          <v-btn flat to="/file/new" v-text="$t('new')" color="primary" />
          <v-btn flat to="/file/upload" v-text="$t('upload')" />
        </template>
      </v-data-table>
    </v-layout>
  </v-container>
</template>

<script>
import { request } from '@/http'

export default {
  name: 'FileList',
  data () {
    return {
      headers: [
        { text: this.$t('ID'), align: 'left', sortable: true, value: 'id' },
        { text: this.$t('name'), value: 'name', class: 'text-xs-right' },
        { text: this.$t('type'), value: 'type', class: 'text-xs-right' },
        { text: this.$t('tags'), value: 'tags', class: 'text-xs-right' },
        { text: this.$t('created'), value: 'created', class: 'text-xs-right' },
        { text: this.$t('creator'), value: 'creator', class: 'text-xs-right' }
      ],
      files: [],
      pagination: null,
      total: 0,
      loading: true,
      fab: false
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
      const params = { sortBy, descending }
      Promise.all([
        request({
          url: '/api/file/list',
          params: Object.assign(
            {},
            { entry: this.$store.state.entry },
            { noexec: true }
          )
        }),
        request({
          url: '/api/file/list',
          params: Object.assign(
            {},
            { entry: this.$store.state.entry },
            { skip: (page - 1) * rowsPerPage, limit: rowsPerPage }
          )
        })
      ])
        .then(([count, items]) => {
          this.total = count
          this.files = items
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
