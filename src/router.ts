import Vue from "vue";
import Router from "vue-router";
import home from "./views/home.vue";
import about from "./views/about.vue";
import login from "./views/login.vue";
import logout from "./views/logout.vue";
import error from "./views/error.vue";
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
      component: () =>
        import(/* webpackChunkName: "problem" */ "./views/problemlist.vue"),
      props: {
        URL: "/api/problem/list.private",
        query: {
          entry: store.state.entry
        }
      }
    },
    {
      path: "/problem/:entry/:id",
      name: "problemPrivateView",
      component: () =>
        import(/* webpackChunkName: "problem" */ "./views/problemview.vue"),
      props: route => ({
        url: "/api/problem/",
        query: {
          entry: route.params.entry,
          id: route.params.id
        }
      })
    },
    {
      path: "/problem/new",
      name: "problemNewView",
      component: () => import("./views/problemedit.vue")
    },
    {
      path: "*",
      name: "error",
      component: error
    }
  ]
});
