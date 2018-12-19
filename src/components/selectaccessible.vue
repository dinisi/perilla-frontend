<template>
  <v-autocomplete :loading="loading" :items="items" :search-input.sync="search" v-model="entry" cache-items flat hide-no-data hide-details item-text="to" item-value="to" :label="$t('select_entry')">
    <template slot="item" slot-scope="data">
      <v-list-tile>
        <v-list-tile-avatar>
          <v-icon v-if="data.item.admin">person</v-icon>
          <v-icon v-else>person_outline</v-icon>
        </v-list-tile-avatar>
        <v-list-tile-title v-html="data.item.to"></v-list-tile-title>
      </v-list-tile>
    </template>
  </v-autocomplete>
</template>

<script>
import { request } from '@/helpers/http'
import { showToast } from '@/swal'

export default {
  name: 'selectAccessible',
  props: ['value'],
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
      if (!this.$store.state.user) return
      this.loading = true
      const params = { search, skip: 0, limit: 10 }
      request({
        url: '/api/misc/accessible',
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
