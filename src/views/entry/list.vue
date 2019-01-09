<template>
  <v-container fluid>
    <v-layout align-center justify-center>
      <v-flex sm12>
        <v-card>
          <v-data-table :rows-per-page-items="[5, 10, 15, 25, 50]" class="fullwidth" :headers="headers" :items="entries" :pagination.sync="pagination" :total-items="total" :loading="loading">
            <template slot="items" slot-scope="props">
              <tr>
                <td>
                  <router-link  :to="'/entry/show/' + props.item._id">
                    {{ props.item._id }}
                  </router-link>
                </td>
                <td class="text-xs-right">{{ props.item.email }}</td>
                <td class="text-xs-right">{{ $t(EntryType[props.item.type]) }}</td>
                <td class="text-xs-right">{{ new Date(props.item.created).toLocaleString() }}</td>
              </tr>
            </template>
            <template slot="actions-prepend">
              <v-btn icon @click="showCondDialog = true">
                <v-icon>search</v-icon>
              </v-btn>
            </template>
          </v-data-table>
        </v-card>
      </v-flex>
    </v-layout>
    <v-dialog v-model="showCondDialog" max-width="500px">
      <v-card>
        <v-card-title class="headline" v-text="$t('condition')"/>
        <v-card-text>
          <v-text-field v-model="search" :label="$t('search')"/>
          <v-select v-model="type" :items="[$t('all'), $t('user'), $t('group')]" :label="$t('type')"/>
          <v-text-field v-model="before" :label="$t('before')" mask="####/##/## ##:##" :return-masked-value="true"/>
          <v-text-field v-model="after" :label="$t('after')" mask="####/##/## ##:##" :return-masked-value="true"/>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn color="primary" v-text="$t('apply')" @click="fetchData()"/>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { request } from '@/helpers/http'
import { getStorage, setStorage } from '@/helpers/storage'
import { showToast } from '@/swal'
import { EntryType } from '@/helpers/misc'

export default {
  name: 'FileList',
  data () {
    return {
      headers: [
        { text: this.$t('ID'), align: 'left', sortable: true, value: '_id' },
        { text: this.$t('email'), value: 'email', sortable: false, class: 'text-xs-right' },
        { text: this.$t('type'), value: 'type', sortable: false, class: 'text-xs-right' },
        { text: this.$t('created'), value: 'created', sortable: true, class: 'text-xs-right' }
      ],
      entries: [],
      pagination: getStorage(localStorage, 'entryPagination') || {
        descending: true,
        page: 1,
        rowsPerPage: 15,
        sortBy: 'created',
        totalItems: 0
      },
      total: 0,
      loading: true,
      search: null,
      type: null,
      before: null,
      after: null,
      showCondDialog: false,
      EntryType
    }
  },
  watch: {
    pagination: {
      handler: function () {
        setStorage(localStorage, 'entryPagination', this.pagination)
        this.fetchData()
      },
      deep: true
    }
  },
  methods: {
    fetchData () {
      this.loading = true
      const { sortBy, descending, page, rowsPerPage } = this.pagination
      const params = { sortBy, descending: descending || undefined }
      const condition = this.getCondition()
      Promise.all([
        request({
          url: '/api/entry/list',
          params: Object.assign(
            { entry: this.$store.state.entry },
            { noexec: true },
            params,
            condition
          )
        }),
        request({
          url: '/api/entry/list',
          params: Object.assign(
            { entry: this.$store.state.entry },
            { skip: (page - 1) * rowsPerPage, limit: rowsPerPage },
            params,
            condition
          )
        })
      ])
        .then(([count, items]) => {
          this.total = count
          this.entries = items
        })
        .catch(e => {
          showToast('error', 'error', e.message)
        })
        .finally(() => {
          this.loading = false
        })
    },
    getCondition () {
      let condition = {}
      if (this.search && this.search.trim()) {
        condition.search = this.search
      }
      if (this.type && this.type.trim()) {
        if (this.type === this.$t('user')) {
          condition.type = 0
        } else if (this.type === this.$t('group')) {
          condition.type = 1
        }
      }
      if (this.before && this.before.trim()) {
        condition.before = +new Date(this.before)
      }
      if (this.after && this.after.trim()) {
        condition.after = +new Date(this.after)
      }
      return condition
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
