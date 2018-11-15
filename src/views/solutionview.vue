<template>
  <v-container fluid>
    <v-layout fill-height>
      <v-flex>
        <v-card>
          <v-card-title>
            <div>
              <div class="headline" v-text="solution.id" />
              <div class="subheading">{{ solution.creator }}</div>
            </div>
          </v-card-title>
          <v-card-text>
            <b>{{ $t("problem") }}:</b>
            <pre>{{ solution.problem }}</pre>
            <br />
            <b>{{ $t("status") }}:</b>
            <pre>{{ result }}</pre>
            <br />
            <b>{{ $t("details") }}:</b><br />
            <z-json-editor v-model="solution.details" :readonly="true" />
            <b>{{ $t("data") }}:</b><br />
            <z-json-editor v-model="solution.data" :readonly="true" />
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="primary" v-text="$t('rejudge')" @click="rejudge" />
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
    <v-snackbar absolute v-model="snackbar" v-text="snack" />
    <v-dialog v-model="loading" persistent width="300">
      <v-card color="primary" dark>
        <v-card-text>
          Please stand by
          <v-progress-linear indeterminate color="white" class="mb-0" />
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { request } from "@/http";
import render from "@/helper/markdown";
import { SolutionResult } from "@/interfaces";
import zJsonEditor from "@/components/zJsonEditor.vue";

export default {
  name: "solutionView",
  props: ["id"],
  components: {
    zJsonEditor
  },
  data() {
    return {
      solution: {
        id: null,
        problem: null,
        status: 0,
        score: 0,
        data: {},
        details: {},
        created: null,
        owner: null,
        creator: null
      },
      loading: true,
      snackbar: false,
      snack: null,
      intervalID: null
    };
  },
  mounted() {
    this.fetch();
    this.intervalID = setInterval(this.fetch, 5000);
  },
  beforeDestroy() {
    if (this.intervalID !== null) {
      clearInterval(this.intervalID);
    }
  },
  computed: {
    result: function() {
      return SolutionResult[this.solution.status];
    }
  },
  methods: {
    fetch: function() {
      request({
        url: "/api/solution",
        params: { entry: this.$store.state.entry, id: this.id }
      })
        .then(solution => {
          this.solution = solution;
        })
        .catch(err => {
          this.snack = err.message;
          this.snackbar = true;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    rejudge: function() {
      this.loading = true;
      request({
        url: "/api/solution",
        method: "POST",
        params: { entry: this.$store.state.entry, id: this.id }
      })
        .then(() => {
          this.snack = this.$t("rejudge_succeeded");
          this.snackbar = true;
        })
        .catch(err => {
          this.snack = err.message;
          this.snackbar = true;
        })
        .finally(() => {
          this.loading = false;
        });
    }
  }
};
</script>
