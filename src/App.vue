<template>
  <v-app>
    <v-navigation-drawer v-model="showsidebar" app v-if="!!token">
      <v-list subheader>
        <v-subheader>{{ $t('logged_in_as') }}</v-subheader>
        <v-list-tile avatar :to="'/entry/show/' + user">
          <v-list-tile-avatar>
            <img :src="userAvatar">
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title>{{ user }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-divider/>
        <v-subheader>{{ $t('current_entry') }}</v-subheader>
        <v-list-tile avatar :to="'/entry/show/' + entry">
          <v-list-tile-avatar>
            <img :src="entryAvatar">
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title>{{ entry }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-divider/>
        <v-subheader>{{ $t('general') }}</v-subheader>
        <v-list-tile @click="showSelectEntry = true">
          <v-list-tile-content>
            <v-list-tile-title>{{ $t('change_entry') }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-divider/>
        <v-subheader>{{ $t('information') }}</v-subheader>
        <v-list-tile>
          <v-list-tile-content>
            <v-list-tile-title>{{ frontendVer }}</v-list-tile-title>
            <v-list-tile-sub-title>{{ $t('frontend_version') }}</v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile>
          <v-list-tile-content>
            <v-list-tile-title>{{ serverVer }}</v-list-tile-title>
            <v-list-tile-sub-title>{{ $t('server_version') }}</v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
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
    <v-snackbar v-model="snackbar" bottom right :timeout="0">
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
import { version as frontendVer } from '../package.json'

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
      entryAvatar: '',
      userAvatar: '',
      newMessage: '',
      disableInput: false,
      showSelectEntry: false,
      newEntry: null,
      frontendVer,
      serverVer: this.$t('fetching'),
      snackbarRestTime: 0
    }
  },
  watch: {
    '$store.state.loading': function (val) {
      this.loading = val
    },
    '$store.state.timestamp': function () {
      this.snackbarRestTime = 6
      this.snackbar = true
      this.errormsg = this.$store.state.message
    },
    '$store.state.entry': {
      handler: function (val) {
        this.loadEntryAvatar()
      },
      immediate: true
    },
    '$store.state.user': {
      handler: function () {
        this.loadUserAvatar()
      },
      immediate: true
    }
  },
  created () {
    setInterval(() => {
      if (this.snackbarRestTime && !--this.snackbarRestTime) {
        this.snackbar = false
      }
    }, 1000)
    this.$i18n.locale = getStorage(localStorage, 'language') || this.$i18n.locale
    client.defaults.baseURL = getStorage(localStorage, 'baseURL') || client.defaults.baseURL
    request({ url: '/' }).then(info => {
      this.serverVer = info.version
    }).catch(e => {
      this.$store.commit('updateMessage', e.message)
    })
  },
  computed: {
    token () {
      return this.$store.state.token
    },
    entry () {
      return this.$store.state.entry
    },
    user () {
      return this.$store.state.user
    }
  },
  methods: {
    loadUserAvatar () {
      if (!this.user) return
      request({
        url: '/api/entry',
        params: { entry: this.user }
      })
        .then(res => {
          this.userAvatar = gravatar.url(res.email)
        })
        .catch(e => {
          this.$store.commit('updateMessage', e.message)
        })
    },
    loadEntryAvatar () {
      if (!this.entry) return
      request({
        url: '/api/entry',
        params: { entry: this.entry }
      })
        .then(res => {
          this.entryAvatar = gravatar.url(res.email)
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
