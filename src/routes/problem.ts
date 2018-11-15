import { RouteConfig } from 'vue-router'

export const problemRoutes: RouteConfig[] = [
  {
    path: '/problem',
    name: 'problemList',
    component: () =>
      import(/* webpackChunkName: "problem" */ '../views/problemlist.vue')
  },
  {
    path: '/problem/new',
    name: 'problemNewView',
    component: () =>
      import(/* webpackChunkName: "problem" */ '../views/problemedit.vue')
  },
  {
    path: '/problem/edit/:id',
    name: 'problemEditView',
    component: () =>
      import(/* webpackChunkName: "problem" */ '../views/problemedit.vue'),
    props: route => ({ id: route.params.id })
  },
  {
    path: '/problem/show/:id',
    name: 'problemView',
    component: () =>
      import(/* webpackChunkName: "problem" */ '../views/problemview.vue'),
    props: route => ({ id: route.params.id })
  }
]
