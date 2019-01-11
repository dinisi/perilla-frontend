<template>
  <v-container fluid grid-list-md>
    <v-layout row justify-space-between>
      <v-flex sm3>
        <v-card style="height: 150px;" class="pa-2">
          <img width="100%" height="100%" src="@/assets/logo.svg"/>
        </v-card>
      </v-flex>
      <v-flex sm9>
        <hitokoto style="height: 150px;" class="pa-2"/>
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
