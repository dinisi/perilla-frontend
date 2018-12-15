<template>
  <v-autocomplete :loading="loading" :items="items" :search-input.sync="search" v-model="entry" cache-items flat hide-no-data hide-details item-text="_id" item-value="_id" :label="$t('select_entry')">
    <template slot="item" slot-scope="data">
      <v-list-tile>
        <v-list-tile-avatar>
          <v-icon v-if="data.item.type === 0">person</v-icon>
          <v-icon v-else-if="data.item.type === 1">people</v-icon>
        </v-list-tile-avatar>
        <v-list-tile-title v-html="data.item._id"></v-list-tile-title>
      </v-list-tile>
    </template>
  </v-autocomplete>
</template>

<script>
import { request } from '@/http'
import { showToast } from '@/swal'

export default {
  name: 'selectEntry',
  props: ['value', 'type'],
  model: {
    prop: 'value',
    event: 'updateValue'
  },
  data () {
    return {
      loading: false,
      items: [],
      search: '',
      entry: null
    }
  },
  created () {
    this.entry = this.value
  },
  watch: {
    'value': function (val) {
      if (val !== this.entry) {
        this.entry = val
      }
    },
    'entry': function (val) {
      if (val !== this.value) {
        this.$emit('updateValue', val)
      }
    },
    'search': {
      immediate: true,
      handler: function (val) {
        this.querySelections(val)
      }
    }
  },
  methods: {
    querySelections (search) {
      this.loading = true
      const params = { search, skip: 0, limit: 10 }
      if (this.type !== undefined) {
        params.type = this.type
      }
      request({
        url: '/api/entry/list',
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
