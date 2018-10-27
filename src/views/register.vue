<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex sm12 md6>
        <v-card>
          <v-card-title class="headline primary white--text">注册</v-card-title>
          <v-card-text>
            <v-text-field label="用户名" v-model="form.username"/>
            <v-text-field label="密码" v-model="form.password" type="password"/>
            <v-text-field label="邮箱" v-model="form.email" type="email"/>
          </v-card-text>
          <v-card-actions>
            <v-spacer/>
            <v-btn color="primary" @click="register" :loading="loading">
              注册
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
    <v-snackbar v-model="snackbar">{{ errormsg }}</v-snackbar>
  </v-container>
</template>

<script>
import { request } from "@/http";

export default {
  name: "register",
  data() {
    return {
      loading: false,
      form: {
        username: null,
        password: null,
        email: null
      },
      snackbar: false,
      errormsg: null
    };
  },
  methods: {
    register() {
      this.loading = true;
      request({
        url: "/api/register",
        method: "POST",
        data: this.form
      })
        .then(res => {
          this.$router.push("/login");
        })
        .catch(err => {
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
