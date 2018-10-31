import Vue from "vue";
import Router from "vue-router";
import home from "./views/home.vue";
import about from "./views/about.vue";
import login from "./views/login.vue";
import error from "./views/error.vue";
import problemlist from "./views/problemlist.vue";
import register from "./views/register.vue";
import store from "./store";

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
      path: "/register",
      name: "register",
      component: register
    },
    {
      path: "/problem",
      name: "problemListPrivate",
      component: problemlist,
      props: {
        URL: "/api/private/problem",
        query: {
          entry: store.state.entry
        }
      }
    },
    {
      path: "*",
      name: "error",
      component: error
    }
  ]
});
