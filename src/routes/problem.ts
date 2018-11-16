import { RouteConfig } from 'vue-router'

export const problemRoutes: RouteConfig[] = [
  {
    path: '/problem',
    name: 'problemList',
    component: () =>
      import(/* webpackChunkName: "problem" */ '../views/problem/list.vue')
  },
  {
    path: '/problem/new',
    name: 'problemNewView',
    component: () =>
      import(/* webpackChunkName: "problem" */ '../views/problem/edit.vue')
  },
  {
    path: '/problem/edit/:id',
    name: 'problemEditView',
    component: () =>
      import(/* webpackChunkName: "problem" */ '../views/problem/edit.vue'),
    props: route => ({ id: route.params.id })
  },
  {
    path: '/problem/show/:id',
    name: 'problemView',
    component: () =>
      import(/* webpackChunkName: "problem" */ '../views/problem/view.vue'),
    props: route => ({ id: route.params.id })
  }
]
