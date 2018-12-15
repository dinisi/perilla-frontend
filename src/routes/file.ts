import { RouteConfig } from 'vue-router'

export const fileRoutes: RouteConfig[] = [
  {
    path: '/file',
    name: 'fileList',
    component: () =>
      import(/* webpackChunkName: "file" */ '@/views/file/list.vue')
  },
  {
    path: '/file/new',
    name: 'fileNewView',
    component: () =>
      import(/* webpackChunkName: "file" */ '@/views/file/edit.vue')
  },
  {
    path: '/file/upload',
    name: 'fileUploadView',
    component: () =>
      import(/* webpackChunkName: "file" */ '@/views/file/batchupload.vue')
  },
  {
    path: '/file/show/:id',
    name: 'fileView',
    component: () =>
      import(/* webpackChunkName: "file" */ '@/views/file/view.vue'),
    props: route => ({ id: route.params.id })
  },
  {
    path: '/file/edit/:id',
    name: 'fileEditView',
    component: () =>
      import(/* webpackChunkName: "file" */ '@/views/file/edit.vue'),
    props: route => ({ id: route.params.id })
  }
]
