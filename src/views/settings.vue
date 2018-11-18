<template>
  <v-container fluid fill-height>
    <v-layout justify-space-around>
      <v-flex sm12 md8 lg6>
        <v-card>
          <v-card-title class="headline" v-text="$t('settings')"/>
          <v-card-text>
            <v-select v-model="language" :items="languages" :label="$t('language')"/>
            <v-text-field v-model="baseURL" :label="$t('base_url')" :placeholder="$t('leave_blank_to_use_default')"/>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { client } from '@/http'

export default {
  name: 'settings',
  data () {
    return {
      language: null,
      languages: ['en', 'zh-Hans'],
      baseURL: null
    }
  },
  mounted () {
    this.language = this.$i18n.locale
    this.baseURL = client.defaults.baseURL
  },
  watch: {
    'language': function (val) {
      this.$i18n.locale = val
    },
    'baseURL': function (val) {
      client.defaults.baseURL = val
    }
  }
}
</script>
