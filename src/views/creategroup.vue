<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex sm12 md6>
        <v-card>
          <v-card-title class="headline primary white--text" v-text="$t('create_group')"/>
          <v-card-text>
            <v-text-field :label="$t('name')" v-model="form.name" />
            <v-text-field :label="$t('email')" v-model="form.email" type="email" />
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="primary" @click="register" :loading="loading" v-text="$t('create')"/>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { request } from '@/helpers/http'
import { showToast } from '@/swal'

export default {
  name: 'createGroup',
  data () {
    return {
      loading: false,
      form: {
        name: null,
        email: null
      }
    }
  },
  methods: {
    register () {
      this.loading = true
      request({
        url: '/api/misc/creategroup',
        method: 'POST',
        data: this.form
      })
        .then(res => {
          showToast('success', 'succeeded')
          this.$router.push('/')
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
