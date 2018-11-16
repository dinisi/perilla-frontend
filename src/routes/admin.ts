import { RouteConfig } from 'vue-router';

export const adminRoutes: RouteConfig[] = [
  {
    path: "/admin",
    name: "adminView",
    component: () =>
      import(/* webpackChunkName: "admin" */ '../views/admin/main.vue')
  }
]