<template>
  <v-card>
    <v-card-title class="subheading" v-text="$t('user')"/>
    <v-card-text style="text-align: center;" class="headline">
      <v-progress-circular indeterminate v-if="loading"/>
      <template v-else>{{ text }}</template>
    </v-card-text>
  </v-card>
</template>

<script>
import { request } from '@/helpers/http'

export default {
  name: 'userCount',
  data () {
    return {
      loading: true,
      text: ''
    }
  },
  mounted () {
    request({
      url: '/api/entrymap/list',
      params: Object.assign({ entry: this.$store.state.entry, noexec: true })
    }).then(count => {
      this.text = '' + count
      this.loading = false
    }).catch(err => {
      this.text = this.$t('error')
    })
  }
}
</script>
