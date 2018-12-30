<template>
  <v-container fluid>
    <v-layout row justify-space-between>
      <v-flex sm3>
        <img style="margin-left: auto; margin-right:auto; display:block;" width="64px" height="64px" src="@/assets/logo.svg"/>
      </v-flex>
      <v-flex sm9>
        <hitokoto/>
      </v-flex>
    </v-layout>
    <v-layout row v-if="!$store.state.token">
      <login/>
    </v-layout>
  </v-container>
</template>

<script>
import hitokoto from '@/components/hitokoto'
import login from '@/views/login.vue'

export default {
  name: 'home',
  components: {
    hitokoto,
    login
  }
}
</script>
