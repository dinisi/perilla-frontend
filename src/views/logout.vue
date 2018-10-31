<template>
  <v-container/>
</template>

<script>
import { request } from "@/http";

export default {
  name: "logout",
  mounted() {
    request({
      method: "POST",
      url: "/api/logout"
    }).then(() => {
      this.$router.push("/");
      location.reload(true);
    });
  }
};
</script>
