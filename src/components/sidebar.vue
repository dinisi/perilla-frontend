<template>
  <v-navigation-drawer permanent app>
    <template>
      <v-card class="fill-height fill-width">
        <div class="fill-height fill-width sidebar">
          <div class="sidebar-header pa-2">
            <v-select :items="entries" v-model="entry" label="Entry">
              <template slot="prepend">
                <v-avatar :size="32">
                  <img :src="avatarURL" class="pa-0"/>
                </v-avatar>
              </template>
            </v-select>
          </div>
          <div class="sidebar-main pa-2 fill-width">
            <v-timeline dense>
              <v-timeline-item v-for="(message, i) in messages" :key="i" right fill-dot small>
                <v-card>
                  <v-card-title>
                    {{ message.creator }}
                  </v-card-title>
                  <v-divider/>
                  <v-card-text class="markdown-body" v-html="render(message.content)"/>
                  <v-card-actions>
                    {{ (new Date(message.created)).toLocaleString() }}
                  </v-card-actions>
                </v-card>
              </v-timeline-item>
            </v-timeline>
          </div>
          <textarea class="sidebar-footer fill-width" placeholder="Press CTRL+ENTER to send" ref="send" v-model="newMessage" :disabled="disableInput"/>
        </div>
      </v-card>
    </template>
  </v-navigation-drawer>
</template>

<script>
import * as gravatar from "gravatar";
import render from "@/helper/markdown";
import { request } from "@/http";

export default {
  name: "sidebar",
  data() {
    return {
      avatarURL: "",
      messages: [],
      newMessage: "",
      entry: null,
      disableInput: false
    };
  },
  created() {
    this.entry = this.$store.state.entry;
    this.loadAvatar();
    this.loadMessages();
  },
  mounted() {
    this.$refs.send.onkeydown = e => {
      if (e.keyCode == 13 && e.ctrlKey) {
        this.createMessage();
      }
    };
  },
  methods: {
    render,
    loadAvatar() {
      request({
        url: "/api/entry",
        params: { entry: this.entry }
      })
        .then(res => {
          this.avatarURL = gravatar.url(res.email);
        })
        .catch(err => {
          // Eat any error
        });
    },
    loadMessages() {
      request({
        url: "/api/message/list.private",
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
          this.messages = res;
        })
        .catch(err => {
          // Eat any error
        });
    },
    createMessage() {
      this.disableInput = true;
      request({
        url: "/api/message/new",
        params: {
          entry: this.entry
        },
        method: "POST",
        data: { content: this.newMessage }
      })
        .then(res => {
          // Successfully created message
          this.loadMessages();
        })
        .catch(err => {
          // Eat any error
          this.newMessage = err.message;
        })
        .finally(() => {
          this.disableInput = false;
        });
      this.newMessage = "";
    }
  },
  computed: {
    login() {
      return this.$store.state.login;
    },
    entries() {
      return this.$store.state.entries;
    }
  },
  watch: {
    "$store.state.entry": function(val) {
      if (val != this.entry) {
        this.entry = val;
        this.loadAvatar();
        this.loadMessages();
      }
    },
    entry: function(val) {
      if (val != this.$store.state.entry) {
        this.$store.commit("changeEntry", val);
        this.loadAvatar();
        this.loadMessages();
      }
    }
  }
};
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
