<template>
  <v-container />
</template>

<script>
import { request } from '..//http'

export default {
  name: 'Logout',
  mounted () {
    this.$store.commit('logout')
    this.$router.push('/')
  }
}
</script>
