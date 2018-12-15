import { RouteConfig } from 'vue-router'

export const entryRoutes: RouteConfig[] = [
  {
    path: '/entry/show/:id',
    name: 'entryView',
    component: () =>
      import(/* webpackChunkName: "entry" */ '@/views/entry/main.vue'),
    props: route => ({ id: route.params.id })
  },
  {
    path: '/entry/edit/:id',
    name: 'entryEdit',
    component: () =>
      import(/* webpackChunkName: "entry" */ '@/views/entry/edit.vue'),
    props: route => ({ id: route.params.id })
  },
  {
    path: '/entry/manage/:id',
    name: 'entryManage',
    component: () =>
      import(/* webpackChunkName: "entry" */ '@/views/entry/manage.vue'),
    props: route => ({ id: route.params.id })
  }
]
