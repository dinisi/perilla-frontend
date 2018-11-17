import { RouteConfig } from 'vue-router'

export const adminRoutes: RouteConfig[] = [
  {
    path: '/admin',
    name: 'adminView',
    component: () =>
      import(/* webpackChunkName: "admin" */ '../views/admin/main.vue')
  },
  {
    path: '/admin/edit',
    name: 'adminEdit',
    component: () =>
      import(/* webpackChunkName: "admin" */ '../views/admin/edit.vue')
  },
  {
    path: '/admin/manage',
    name: 'adminManage',
    component: () =>
      import(/* webpackChunkName: "admin" */ '../views/admin/manage.vue')
  }
]
