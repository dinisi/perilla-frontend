<template>
  <v-app>
    <sidebar/>
    <navbar/>
    <v-content>
      <router-view/>
    </v-content>
  </v-app>
</template>

<script>
import sidebar from "./components/sidebar";
import navbar from "./components/navbar";

export default {
  name: "App",
  components: {
    sidebar,
    navbar
  },
  data() {
    return {
      //
    };
  }
};
</script>
