<template>
  <v-toolbar app>
    <v-toolbar-items>
      <v-btn class="headline text-uppercase" flat to="/">
        Perilla
      </v-btn>
      <v-btn flat to="/problem">
        问题
      </v-btn>
      <v-btn flat to="/file">
        文件
      </v-btn>
      <v-btn flat to="/solution">
        提交
      </v-btn>
    </v-toolbar-items>
    <v-spacer/>
    <v-toolbar-items>
      <template v-if="login">
      </template>
      <template v-else>
        <v-btn depressed to="/login" color="primary">
          登陆
        </v-btn>
        <v-btn flat to="/register">
          注册
        </v-btn>
      </template>
    </v-toolbar-items>
  </v-toolbar>
</template>

<script>
export default {
  name: "navbar",
  data() {},
  methods: {
    //
  },
  watch: {
    //
  },
  computed: {
    login: function() {
      return this.$store.state.login;
    }
  }
};
</script>
