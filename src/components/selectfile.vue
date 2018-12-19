<template>
  <v-autocomplete :loading="loading" :items="items" :search-input.sync="search" v-model="file" cache-items flat hide-no-data hide-details item-text="name" item-value="id" :label="$t('select_file')">
    <template slot="item" slot-scope="data">
      <v-list-tile>
        <v-list-tile-content>
          <v-list-tile-title>{{ data.item.name }}</v-list-tile-title>
          <v-list-tile-sub-title>{{ data.item.creator }}</v-list-tile-sub-title>
        </v-list-tile-content>
      </v-list-tile>
    </template>
  </v-autocomplete>
</template>

<script>
import { request } from '@/helpers/http'
import { showToast } from '@/swal'

export default {
  name: 'selectFile',
  props: ['value'],
  model: {
    prop: 'value',
    event: 'update'
  },
  data () {
    return {
      loading: false,
      items: [],
      search: '',
      file: null
    }
  },
  created () {
    this.file = this.value
  },
  watch: {
    'value': function (val) {
      if (val !== this.file) {
        this.file = val
      }
    },
    'file': function (val) {
      if (val !== this.value) {
        this.$emit('update', val)
      }
    },
    'search': function (val) {
      if (val) this.querySelections(val)
    }
  },
  methods: {
    querySelections (search) {
      this.loading = true
      const params = { search, skip: 0, limit: 10, entry: this.$store.state.entry }
      request({
        url: '/api/file/list',
        params
      }).then(items => {
        this.items = items
      })
        .catch(e => {
          showToast('error', 'error', e.message)
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>
