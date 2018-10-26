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
          <textarea class="sidebar-footer fill-width" placeholder="Press CTRL+ENTER to send" ref="send" v-model="newMessage"/>
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
      messages: [
        {
          id: 0,
          content: "DDD",
          created: "2018-10-31",
          owner: "ZhangZisu",
          creator: "zzs"
        }
      ],
      newMessage: "",
      entry: null
    };
  },
  created() {
    this.entry = this.$store.state.entry;
    this.loadAvatar();
  },
  mounted() {
    this.$refs.send.onkeydown = e => {
      if (e.keyCode == 13 && e.ctrlKey) {
        this.messages.push({
          id: 0,
          content: this.newMessage,
          created: new Date(),
          owner: "ZhangZisu",
          creator: "zzs"
        });
        this.newMessage = "";
      }
    };
  },
  methods: {
    render,
    loadAvatar() {
      request({ url: "/api/private/entry?entry=" + this.entry })
        .then(res => {
          this.avatarURL = gravatar.url(res.email);
        })
        .catch(err => {
          // Eat any error
        });
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
      }
    },
    entry: function(val) {
      if (val != this.$store.state.entry) {
        this.$store.commit("changeEntry", val);
        this.loadAvatar();
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
