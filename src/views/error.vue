<template>
  <v-container fluid justify-space-around>
    <v-flex>
      <div class="error-title">{{ $t("error") }}</div>
    </v-flex>
  </v-container>
</template>

<script>
export default {
  name: "error"
};
</script>

<style lang="stylus" scoped>
.error-title
    font-size 144px
    text-align center
</style>
