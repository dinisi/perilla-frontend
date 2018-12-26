<template>
  <v-app :dark="$store.state.darkTheme">
    <v-navigation-drawer v-model="showsidebar" app v-if="!!$store.state.token">
      <v-list subheader>
        <v-subheader>{{ $t('logged_in_as') }}</v-subheader>
        <v-list-tile avatar :to="'/entry/show/' + $store.state.user">
          <v-list-tile-avatar>
            <img :src="userAvatar">
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title>{{ $store.state.user }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-divider/>
        <v-subheader>{{ $t('current_entry') }}</v-subheader>
        <v-list-tile avatar :to="'/entry/show/' + $store.state.entry">
          <v-list-tile-avatar>
            <img :src="entryAvatar">
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title>{{ $store.state.entry }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-divider/>
        <v-subheader>{{ $t('navigation') }}</v-subheader>
        <v-list-tile to="/problem">
          <v-list-tile-content>
            <v-list-tile-title>{{ $t('problem') }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile to="/solution">
          <v-list-tile-content>
            <v-list-tile-title>{{ $t('solution') }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile to="/article">
          <v-list-tile-content>
            <v-list-tile-title>{{ $t('article') }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile to="/file">
          <v-list-tile-content>
            <v-list-tile-title>{{ $t('file') }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-divider/>
        <v-subheader>{{ $t('general') }}</v-subheader>
        <v-list-tile @click="showSelectEntry = true">
          <v-list-tile-content>
            <v-list-tile-title>{{ $t('change_entry') }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile to="/debugger">
          <v-list-tile-content>
            <v-list-tile-title>{{ $t('debugger') }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile href="https://github.com/ZhangZisu/perilla-frontend" target="_blank">
          <v-list-tile-content>
            <v-list-tile-title>{{ $t('about') }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-divider/>
        <v-subheader>{{ $t('information') }}</v-subheader>
        <v-list-tile>
          <v-list-tile-content>
            <v-list-tile-title>{{ frontendInfo.version }}</v-list-tile-title>
            <v-list-tile-sub-title>{{ $t('frontend_version') }}</v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile>
          <v-list-tile-content>
            <v-list-tile-title>{{ serverInfo.version }}</v-list-tile-title>
            <v-list-tile-sub-title>{{ $t('server_version') }}</v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar app :color="$store.state.adminMode ? 'error' : undefined">
      <v-toolbar-side-icon v-if="$store.state.token" @click="showsidebar = !showsidebar" />
      <v-toolbar-items>
        <v-btn class="headline" flat to="/">Perilla</v-btn>
      </v-toolbar-items>
      <v-spacer />
      <v-toolbar-items>
        <v-btn flat to="/blank" v-text="$t('refresh')" />
        <template v-if="$store.state.token">
          <v-menu open-on-hover bottom offset-y>
            <v-btn flat slot="activator" to="/logout" v-text="$t('logout')"/>
            <v-list>
              <v-list-tile to="/settings">
                <v-list-tile-avatar>
                  <v-icon>settings</v-icon>
                </v-list-tile-avatar>
                <v-list-tile-title v-text="$t('settings')"/>
              </v-list-tile>
              <v-list-tile to="/creategroup">
                <v-list-tile-avatar>
                  <v-icon>group_add</v-icon>
                </v-list-tile-avatar>
                <v-list-tile-title v-text="$t('create_group')"/>
              </v-list-tile>
              <v-list-tile to="/entry">
                <v-list-tile-avatar>
                  <v-icon>local_library</v-icon>
                </v-list-tile-avatar>
                <v-list-tile-title v-text="$t('entry_list')"/>
              </v-list-tile>
            </v-list>
          </v-menu>
        </template>
        <template v-else>
          <v-menu open-on-hover bottom offset-y>
            <v-btn slot="activator" depressed to="/login" color="primary" v-text="$t('login')"/>
            <v-list>
              <v-list-tile to="/settings">
                <v-list-tile-avatar>
                  <v-icon>settings</v-icon>
                </v-list-tile-avatar>
                <v-list-tile-title v-text="$t('settings')"/>
              </v-list-tile>
              <v-list-tile to="/register">
                <v-list-tile-avatar>
                  <v-icon>person_add</v-icon>
                </v-list-tile-avatar>
                <v-list-tile-title v-text="$t('register')"/>
              </v-list-tile>
            </v-list>
          </v-menu>
        </template>
      </v-toolbar-items>
    </v-toolbar>
    <v-content>
      <router-view />
    </v-content>
    <v-dialog v-model="loading" persistent max-width="300">
      <v-card color="primary" dark>
        <v-card-text>
          {{ $t('please_wait') }}
          <v-progress-linear indeterminate color="white" class="mb-0" />
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog v-model="showSelectEntry" max-width="500">
      <v-card>
        <v-card-title class="headline" v-text="$t('select_entry')"/>
        <v-card-text>
          <select-entry v-if="$store.state.adminMode" v-model="newEntry"/>
          <select-accessible v-else v-model="newEntry"/>
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
import * as gravatar from 'gravatar'
import { client, request } from '@/helpers/http'
import selectAccessible from '@/components/selectaccessible'
import selectEntry from '@/components/selectentry'
import { getStorage, setStorage } from '@/helpers/storage'
import frontendInfo from '@/../package.json'
import { showToast, showDialog } from '@/swal'

export default {
  name: 'App',
  components: {
    selectAccessible,
    selectEntry
  },
  data () {
    return {
      loading: false,
      showsidebar: false,
      errormsg: null,
      entryAvatar: '',
      userAvatar: '',
      newMessage: '',
      disableInput: false,
      showSelectEntry: false,
      newEntry: null,
      frontendInfo,
      serverInfo: this.$t('fetching')
    }
  },
  watch: {
    '$store.state.loading': function (val) {
      this.loading = val
    },
    '$store.state.entry': {
      handler: function (val) {
        this.loadEntryAvatar()
      }
    },
    '$store.state.user': {
      handler: function () {
        this.loadUserAvatar()
      }
    }
  },
  created () {
    this.loadSettings()
  },
  methods: {
    loadUserAvatar () {
      if (!this.$store.state.user) return
      request({
        url: '/api/entry',
        params: { entry: this.$store.state.user }
      })
        .then(res => {
          this.userAvatar = gravatar.url(res.email, { d: 'mp' })
        })
        .catch(e => {
          showToast('error', 'error', e.message)
        })
    },
    loadEntryAvatar () {
      if (!this.$store.state.entry) return
      request({
        url: '/api/entry',
        params: { entry: this.$store.state.entry }
      })
        .then(res => {
          this.entryAvatar = gravatar.url(res.email, { d: 'mp' })
        })
        .catch(e => {
          showToast('error', 'error', e.message)
        })
    },
    changeEntry () {
      if (this.newEntry && this.newEntry !== this.$store.state.entry) {
        this.$store.commit('changeEntry', this.newEntry)
        this.$router.push('/blank')
      }
      this.showSelectEntry = false
    },
    async loadSettings () {
      while (true) {
        try {
          this.serverInfo = await request({ url: '/' })
          setStorage(localStorage, 'baseURL', client.defaults.baseURL)
          this.loadUserAvatar()
          this.loadEntryAvatar()
          break
        } catch (e) {
          client.defaults.baseURL = await showDialog('error', 'input_base_url', this.$t('base_url_invalid', [e.message]), true, 'text')
        }
      }
    }
  }
}
</script>
