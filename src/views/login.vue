<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex sm12 md6>
        <v-card>
          <v-card-title class="headline primary white--text">登录</v-card-title>
          <v-card-text>
            <v-text-field label="用户名"/>
            <v-text-field label="密码"/>
          </v-card-text>
          <v-card-actions>
            <v-spacer/>
            <v-btn color="primary" :disabled="loading" @click="login">
              <template v-if="loading">
                <v-progress-circular indeterminate/>
              </template>
              <template v-else>
                登录
              </template>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: "login",
  data() {
    return {
      username: null,
      password: null,
      loading: false
    };
  },
  methods: {
    login() {
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
      }, 500);
    }
  }
};
</script>
