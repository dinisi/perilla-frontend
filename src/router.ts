import Vue from "vue";
import Router from "vue-router";
import home from "./views/home.vue";
import about from "./views/about.vue";
import login from "./views/login.vue";
import logout from "./views/logout.vue";
import error from "./views/error.vue";
import problemlist from "./views/problemlist.vue";
import problemview from "./views/problemview.vue";
import register from "./views/register.vue";

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
      path: "/logout",
      name: "logout",
      component: logout
    },
    {
      path: "/register",
      name: "register",
      component: register
    },
    {
      path: "/problem",
      name: "problemListPrivate",
      component: problemlist
    },
    {
      path: "/problem/:entry/:id",
      name: "problemPrivateView",
      component: problemview,
      props: route => ({
        url: "/api/private/problem",
        query: {
          entry: route.params.entry,
          id: route.params.id
        }
      })
    },
    {
      path: "*",
      name: "error",
      component: error
    }
  ]
});
