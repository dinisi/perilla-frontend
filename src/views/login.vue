<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex sm12 md6>
        <v-card>
          <v-card-title class="headline primary white--text">登录</v-card-title>
          <v-card-text>
            <v-text-field label="用户名" v-model="form.username" />
            <v-text-field
              label="密码"
              v-model="form.password"
              type="password"
            />
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="primary" @click="login" :loading="loading">
              登录
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
    <v-snackbar absolute v-model="snackbar" v-text="errormsg" />
  </v-container>
</template>

<script>
import { request } from "@/http";

export default {
  name: "login",
  data() {
    return {
      form: {
        username: null,
        password: null
      },
      loading: false,
      snackbar: false,
      errormsg: null
    };
  },
  methods: {
    login() {
      this.loading = true;
      request({ url: "/api/login", method: "POST", data: this.form })
        .then(() => {
          setTimeout(() => {
            this.$router.push("/");
            location.reload(true);
          }, 0);
        })
        .catch(e => {
          this.errormsg = e.message;
          this.snackbar = true;
        })
        .finally(() => {
          this.loading = false;
        });
    }
  }
};
</script>
