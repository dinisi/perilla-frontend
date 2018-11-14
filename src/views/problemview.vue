<template>
  <v-container fluid>
    <v-layout fill-height>
      <v-flex>
        <v-card>
          <v-card-title>
            <div>
              <div class="headline" v-text="problem.title"/>
              <div class="subheading">
                {{ problem.creator }}
              </div>
            </div>
          </v-card-title>
          <v-card-text>
            <article class="markdown-body" v-html="rendered"/>
          </v-card-text>
          <v-card-actions>
            <v-chip label v-for="(tag, i) in problem.tags" v-text="tag" :key="i"/>
            <v-spacer/>
            <v-btn v-text="$t('submit')" color="primary"/>
            <v-btn v-text="$t('edit')" :to="'/problem/edit/' + id"/>
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
  props: ["id"],
  data() {
    return {
      problem: {
        id: null,
        title: "Loading",
        content: "",
        data: {},
        channel: null,
        tags: [],
        created: null,
        owner: null,
        creator: null
      },
      loading: true,
      snackbar: false,
      snack: null
    };
  },
  mounted() {
    request({
      url: "/api/problem",
      params: { entry: this.$store.state.entry, id: this.id }
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
