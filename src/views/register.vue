<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex sm12 md6>
        <v-card>
          <v-card-title class="headline primary white--text">注册</v-card-title>
          <v-card-text>
            <v-text-field :label="$t('username')" v-model="form.username" />
            <v-text-field :label="$t('password')" v-model="form.password" type="password"/>
            <v-text-field :label="$t('email')" v-model="form.email" type="email" />
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="primary" @click="register" :loading="loading" v-text="$t('register')"/>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { request } from '@/http'

export default {
  name: 'Register',
  data () {
    return {
      loading: false,
      form: {
        username: null,
        password: null,
        email: null
      }
    }
  },
  methods: {
    register () {
      this.loading = true
      request({
        url: '/api/register',
        method: 'POST',
        data: this.form
      })
        .then(res => {
          this.$router.push('/login')
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
