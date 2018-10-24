import Vue from "vue";
import Router from "vue-router";
import home from "./views/home.vue";
import about from "./views/about.vue";
import login from "./views/login.vue";
import error from "./views/error.vue";
import problemlist from "./views/problemlist.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: home
    },
    {
      path: "/about",
      name: "about",
      component: about
    },
    {
      path: "/login",
      name: "login",
      component: login
    },
    {
      path: "/problem",
      name: "problemListPrivate",
      component: problemlist
    },
    {
      path: "*",
      name: "error",
      component: error
    }
  ]
});
