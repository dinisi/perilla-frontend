<template>
  <v-container fluid>
    <v-layout fill-height>
      <v-flex>
        <v-card>
          <v-card-title>
            <div>
              <div class="headline" v-text="problem.title"/>
            </div>
          </v-card-title>
          <v-card-text>
            <article class="markdown-body" v-html="rendered"/>
          </v-card-text>
          <v-card-actions>
            <v-spacer/>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
    <v-snackbar v-model="snackbar" v-text="snack"/>
    <v-dialog v-model="loading" persistent width="300">
      <v-card color="primary" dark>
        <v-card-text>
          Please stand by
          <v-progress-linear indeterminate color="white" class="mb-0"/>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { request } from "@/http";
import render from "@/helper/markdown";

export default {
  name: "problemView",
  props: ["url", "query"],
  data() {
    return {
      problem: {
        id: null,
        title: null,
        content: null,
        files: [],
        data: null,
        channel: null,
        tags: [],
        created: null,
        owner: null,
        creator: null,
        public: false
      },
      loading: true,
      snackbar: false,
      snack: null
    };
  },
  mounted() {
    request({
      url: this.url,
      params: this.query
    })
      .then(problem => {
        this.problem = problem;
      })
      .catch(err => {
        this.snack = err.message;
        this.snackbar = true;
      })
      .finally(() => {
        this.loading = false;
      });
  },
  computed: {
    rendered: function() {
      return render(this.problem.content);
    }
  }
};
</script>
