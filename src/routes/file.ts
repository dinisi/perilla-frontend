import { RouteConfig } from 'vue-router'

export const fileRoutes: RouteConfig[] = [
  {
    path: '/file',
    name: 'fileList',
    component: () =>
      import(/* webpackChunkName: "file" */ '../views/filelist.vue')
  },
  {
    path: '/file/new',
    name: 'fileNewView',
    component: () =>
      import(/* webpackChunkName: "file" */ '../views/fileedit.vue')
  },
  {
    path: '/file/upload',
    name: 'fileUploadView',
    component: () =>
      import(/* webpackChunkName: "file" */ '../views/batchupload.vue')
  },
  {
    path: '/file/show/:id',
    name: 'fileView',
    component: () =>
      import(/* webpackChunkName: "file" */ '../views/fileview.vue'),
    props: route => ({ id: route.params.id })
  },
  {
    path: '/file/edit/:id',
    name: 'fileEditView',
    component: () =>
      import(/* webpackChunkName: "file" */ '../views/fileedit.vue'),
    props: route => ({ id: route.params.id })
  }
]
