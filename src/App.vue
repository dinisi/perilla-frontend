<template>
  <v-app>
    <v-navigation-drawer v-model="showsidebar" app v-if="login">
      <v-toolbar>
        <v-list class="pa-0">
          <v-list-tile avatar>
            <v-list-tile-avatar>
              <img :src="avatarURL">
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title v-text="entry"/>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-btn icon @click="showSelectEntry = true">
                <v-icon>people_outline</v-icon>
              </v-btn>
            </v-list-tile-action>
          </v-list-tile>
        </v-list>
      </v-toolbar>
    </v-navigation-drawer>
    <navbar v-model="showsidebar" />
    <v-content>
      <router-view />
    </v-content>
    <v-dialog v-model="loading" persistent width="300">
      <v-card color="primary" dark>
        <v-card-text>
          {{ $t('please_wait') }}
          <v-progress-linear indeterminate color="white" class="mb-0" />
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-snackbar v-model="snackbar" bottom right>
      {{ errormsg }}
    </v-snackbar>
    <v-dialog v-model="showSelectEntry" width="300">
      <v-card>
        <v-card-title class="headline" v-text="$t('select_entry')"/>
        <v-card-text>
          <select-accessible v-model="newEntry"/>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn @click="changeEntry" color="primary" v-text="$t('apply')"/>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import navbar from '@/components/navbar'
import * as gravatar from 'gravatar'
import { client, request } from '@/http'
import selectAccessible from '@/components/selectaccessible'
import { getStorage } from '@/storage'

export default {
  name: 'App',
  components: {
    navbar,
    selectAccessible
  },
  data () {
    return {
      loading: false,
      showsidebar: false,
      snackbar: false,
      errormsg: null,
      avatarURL: '',
      newMessage: '',
      disableInput: false,
      showSelectEntry: false,
      newEntry: null
    }
  },
  watch: {
    '$store.state.loading': function (val) {
      this.loading = val
    },
    '$store.state.timestamp': function () {
      this.snackbar = false
      this.snackbar = true
      this.errormsg = this.$store.state.message
    },
    '$store.state.entry': function (val) {
      this.loadAvatar()
    }
  },
  created () {
    this.$i18n.locale = getStorage(localStorage, 'language') || this.$i18n.locale
    client.defaults.baseURL = getStorage(localStorage, 'baseURL') || client.defaults.baseURL
  },
  mounted () {
    this.$store.commit('toggleLoading', true)
    request({ url: '/api/misc/session' })
      .then(info => {
        this.$store.commit('login', info)
      })
      .catch(e => {
        // Not logged in
        // Ignore this error
      })
      .finally(() => {
        this.$store.commit('toggleLoading', false)
      })
  },
  computed: {
    login () {
      return this.$store.state.login
    },
    entry () {
      return this.$store.state.entry
    }
  },
  methods: {
    loadAvatar () {
      request({
        url: '/api/entry',
        params: { entry: this.entry }
      })
        .then(res => {
          this.avatarURL = gravatar.url(res.email)
        })
        .catch(e => {
          this.$store.commit('updateMessage', e.message)
        })
    },
    changeEntry () {
      if (this.newEntry && this.newEntry !== this.entry) {
        this.$store.commit('changeEntry', this.newEntry)
        this.$router.push('/blank')
      }
      this.showSelectEntry = false
    }
  }
}
</script>
