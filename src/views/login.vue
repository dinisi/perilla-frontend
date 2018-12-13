<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex sm12 md6>
        <v-card>
          <v-card-title class="headline primary white--text" v-text="$t('login')"/>
          <v-card-text>
            <v-text-field :label="$t('username')" v-model="form.username" type="text"/>
            <v-text-field :label="$t('password')" v-model="form.password" type="password"/>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn to="/register" v-text="$t('register')"/>
            <v-btn color="primary" @click="login" :loading="loading" v-text="$t('login')"/>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { request } from '../http'

export default {
  name: 'Login',
  data () {
    return {
      form: {
        username: null,
        password: null
      },
      loading: false
    }
  },
  methods: {
    login () {
      this.loading = true
      request({ url: '/auth/login', method: 'POST', data: this.form })
        .then((jwt) => {
          this.$store.commit('login', jwt)
          this.$router.push('/')
        })
        .catch(e => {
          this.$store.commit('updateMessage', e.message)
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>
