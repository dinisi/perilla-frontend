<template>
  <v-app>
    <sidebar/>
    <navbar/>
    <v-content>
      <router-view/>
    </v-content>
    <v-dialog v-model="loading" persistent width="300">
      <v-card color="primary" dark>
        <v-card-text>
          Please stand by
          <v-progress-linear indeterminate color="white" class="mb-0"/>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import sidebar from "@/components/sidebar";
import navbar from "@/components/navbar";
import { request } from "@/http";

export default {
  name: "App",
  components: {
    sidebar,
    navbar
  },
  data() {
    return {
      loading: false
    };
  },
  watch: {
    "$store.state.loading": function(val) {
      this.loading = val;
    }
  },
  mounted() {
    this.$store.commit("toggleLoading", true);
    request({ url: "/api/session" })
      .then(info => {
        this.$store.commit("login", info);
      })
      .catch(err => {
        // Eat any error
      })
      .finally(() => {
        this.$store.commit("toggleLoading", false);
      });
  }
};
</script>
