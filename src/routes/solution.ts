import { RouteConfig } from 'vue-router'

export const solutionRoutes: RouteConfig[] = [
  {
    path: '/solution',
    name: 'solutionList',
    component: () =>
      import(/* webpackChunkName: "solution" */ '../views/solution/list.vue')
  },
  {
    path: '/solution/show/:id',
    name: 'solutionView',
    component: () =>
      import(/* webpackChunkName: "solution" */ '../views/solution/view.vue'),
    props: route => ({ id: route.params.id })
  }
]
