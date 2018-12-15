import { RouteConfig } from 'vue-router'

export const articleRoutes: RouteConfig[] = [
  {
    path: '/article',
    name: 'articleList',
    component: () =>
            import(/* webpackChunkName: "article" */ '@/views/article/list.vue')
  },
  {
    path: '/article/show/:id',
    name: 'articleView',
    component: () =>
            import(/* webpackChunkName: "article" */ '@/views/article/view.vue'),
    props: route => ({ id: route.params.id })
  },
  {
    path: '/article/new',
    name: 'articleNew',
    component: () =>
            import(/* webpackChunkName: "article" */ '@/views/article/edit.vue')
  },
  {
    path: '/article/edit/:id',
    name: 'articleEdit',
    component: () =>
            import(/* webpackChunkName: "article" */ '@/views/article/edit.vue'),
    props: route => ({ id: route.params.id })
  }
]
