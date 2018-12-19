<template>
  <v-container fluid>
    <v-layout align-center justify-center>
      <v-data-table :rows-per-page-items="[5, 10, 15, 25, 50]" class="fullwidth" :headers="headers" :items="maps" :pagination.sync="pagination" :total-items="total" :loading="loading">
        <template slot="items" slot-scope="props">
          <tr>
            <td>{{ props.item.from }}</td>
            <td class="text-xs-right">{{ props.item.admin }}</td>
            <td class="text-xs-right">
              <v-icon small @click="setAdmin(props.item.from)" class="mr-2">check</v-icon>
              <v-icon small @click="unsetAdmin(props.item.from)" class="mr-2">close</v-icon>
              <v-icon small @click="remove(props.item.from)" class="mr-2">delete</v-icon>
            </td>
          </tr>
        </template>
        <template slot="actions-prepend">
          <v-menu v-model="showMenu" :close-on-content-click="false" :nudge-width="320" offset-y>
            <v-btn flat v-text="$t('menu')" color="primary" slot="activator"/>
            <v-card>
              <v-card-text>
                <select-entry v-model="newEntry" :type="0"/>
                <v-btn flat v-text="$t('add')" color="primary" slot="activator" @click="addClick"/>
              </v-card-text>
            </v-card>
          </v-menu>
        </template>
      </v-data-table>
    </v-layout>
  </v-container>
</template>

<script>
import { request } from '@/helpers/http'
import selectEntry from '@/components/selectentry'
import { showToast } from '@/swal'

export default {
  name: 'manage',
  components: {
    selectEntry
  },
  props: ['id'],
  data () {
    return {
      headers: [
        { text: this.$t('from'), align: 'left', sortable: true, value: 'from' },
        { text: this.$t('admin'), value: 'admin', class: 'text-xs-right' },
        { text: this.$t('actions'), class: 'text-xs-right', sortable: false }
      ],
      maps: [],
      pagination: null,
      total: 0,
      loading: true,
      newEntry: null,
      showMenu: false
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
      const params = { sortBy, descending: descending || undefined }
      Promise.all([
        request({
          url: '/api/entrymap/list',
          params: Object.assign(
            {},
            { entry: this.id },
            { noexec: true }
          )
        }),
        request({
          url: '/api/entrymap/list',
          params: Object.assign(
            {},
            { entry: this.id },
            { skip: (page - 1) * rowsPerPage, limit: rowsPerPage }
          )
        })
      ])
        .then(([count, items]) => {
          this.total = count
          this.maps = items
        })
        .catch(e => {
          showToast('error', 'error', e.message)
        })
        .finally(() => {
          this.loading = false
        })
    },
    addClick () {
      this.addMember(this.newEntry)
      this.newEntry = null
      this.showMenu = false
    },
    addMember (from) {
      this.loading = true
      request({
        url: '/api/entrymap/',
        params: { entry: this.id, from },
        method: 'POST',
        data: { admin: false }
      }).then(() => {
        showToast('success', 'succeeded')
        this.fetchData()
      }).catch(e => {
        showToast('error', 'error', e.message)
        this.loading = false
      })
    },
    setAdmin (from) {
      this.loading = true
      request({
        url: '/api/entrymap/',
        params: { entry: this.id, from },
        method: 'PUT',
        data: { admin: true }
      }).then(() => {
        showToast('success', 'succeeded')
        this.fetchData()
      }).catch(e => {
        showToast('error', 'error', e.message)
        this.loading = false
      })
    },
    unsetAdmin (from) {
      this.loading = true
      request({
        url: '/api/entrymap/',
        params: { entry: this.id, from },
        method: 'PUT',
        data: { admin: false }
      }).then(() => {
        showToast('success', 'succeeded')
        this.fetchData()
      }).catch(e => {
        showToast('error', 'error', e.message)
        this.loading = false
      })
    },
    remove (from) {
      this.loading = true
      request({
        url: '/api/entrymap/',
        params: { entry: this.id, from },
        method: 'DELETE'
      }).then(() => {
        showToast('success', 'succeeded')
        this.fetchData()
      }).catch(e => {
        showToast('error', 'error', e.message)
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
