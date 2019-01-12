<template>
  <v-card hover to="/solution">
    <v-card-title class="subheading" v-text="$t('solution')"/>
    <v-card-text style="text-align: center;" class="headline">
      <v-progress-circular indeterminate v-if="loading"/>
      <template v-else>{{ text }}</template>
    </v-card-text>
  </v-card>
</template>

<script>
import { request } from '@/helpers/http'

export default {
  name: 'solutionCount',
  data () {
    return {
      loading: true,
      text: ''
    }
  },
  mounted () {
    request({
      url: '/api/solution/list',
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
