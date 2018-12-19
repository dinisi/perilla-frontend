<template>
  <v-container />
</template>

<script>
import { request } from '@/helpers/http'

export default {
  name: 'Logout',
  mounted () {
    this.$store.commit('logout')
    this.$router.push('/')
  }
}
</script>
