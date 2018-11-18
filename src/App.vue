<template>
  <v-app>
    <v-navigation-drawer v-model="showsidebar" app disable-resize-watcher disable-route-watcher>
      <v-card class="fill-height fill-width">
        <div class="fill-height fill-width sidebar">
          <div class="sidebar-header pa-2">
            <v-select :items="entries" v-model="entry" :label="$t('act_as')">
              <template slot="prepend">
                <v-avatar :size="32">
                  <img :src="avatarURL" class="pa-0" >
                </v-avatar>
              </template>
            </v-select>
          </div>
          <div class="sidebar-main pa-2 fill-width">
            <v-timeline dense>
              <v-timeline-item v-for="(message, i) in messages" :key="i" right fill-dot small>
                <v-card>
                  <v-card-title> {{ message.creator }} </v-card-title>
                  <v-divider />
                  <v-card-text class="markdown-body" v-html="render(message.content)"/>
                  <v-card-actions>
                    {{ new Date(message.created).toLocaleString() }}
                  </v-card-actions>
                </v-card>
              </v-timeline-item>
            </v-timeline>
          </div>
          <textarea class="sidebar-footer fill-width" placeholder="Press CTRL+ENTER to send" ref="send" v-model="newMessage" :disabled="disableInput"/>
        </div>
      </v-card>
    </v-navigation-drawer>
    <navbar v-model="showsidebar" />
    <v-content> <router-view /> </v-content>
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
  </v-app>
</template>

<script>
import navbar from '@/components/navbar'
import * as gravatar from 'gravatar'
import render from '@/helper/markdown'
import { request } from '@/http'

export default {
  name: 'App',
  components: {
    navbar
  },
  data () {
    return {
      loading: false,
      showsidebar: false,
      snackbar: false,
      errormsg: null,
      avatarURL: '',
      messages: [],
      newMessage: '',
      entry: null,
      disableInput: false
    }
  },
  watch: {
    '$store.state.loading': function (val) {
      this.loading = val
    },
    '$store.state.timestamp': function () {
      this.snackbar = true
      this.errormsg = this.$store.state.message
    },
    '$store.state.entry': function (val) {
      if (val !== this.entry) {
        this.entry = val
        this.loadAvatar()
        this.loadMessages()
      }
    },
    'this.$store.state.login': function (val) {
      this.showsidebar = val
    },
    entry: function (val) {
      if (val !== this.$store.state.entry) {
        this.$store.commit('changeEntry', val)
        this.loadAvatar()
        this.loadMessages()
      }
    }
  },
  mounted () {
    this.$store.commit('toggleLoading', true)
    request({ url: '/api/session' })
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
    this.$refs.send.onkeydown = e => {
      if (e.keyCode === 13 && e.ctrlKey) {
        this.createMessage()
      }
    }
  },
  computed: {
    entries () {
      return this.$store.state.entries
    }
  },
  methods: {
    render,
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
    loadMessages () {
      request({
        url: '/api/message/list',
        params: {
          entry: this.entry,
          sort: JSON.stringify({
            id: -1
          }),
          skip: 0,
          limit: 10
        }
      })
        .then(res => {
          this.messages = res
        })
        .catch(e => {
          this.$store.commit('updateMessage', e.message)
        })
    },
    createMessage () {
      this.disableInput = true
      request({
        url: '/api/message/',
        params: {
          entry: this.entry
        },
        method: 'POST',
        data: { content: this.newMessage }
      })
        .then(res => {
          // Successfully created message
          this.loadMessages()
        })
        .catch(e => {
          this.$store.commit('updateMessage', e.message)
        })
        .finally(() => {
          this.disableInput = false
        })
      this.newMessage = ''
    }
  }
}
</script>

<style lang="stylus" scoped>
.sidebar-main
  height calc(100% - 80px - 80px - 10px)
  overflow-y scroll
  position absolute
  top 85px

.sidebar-footer
  max-height 80px
  min-height 80px
  bottom 0
  position absolute

.sidebar-header
  height 80px
  top 0
  position absolute
</style>
