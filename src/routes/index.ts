import { RouteConfig } from 'vue-router'
import home from '@/views/home.vue'
import login from '@/views/login.vue'
import logout from '@/views/logout.vue'
import error from '@/views/error.vue'
import register from '@/views/register.vue'
import createGroup from '@/views/creategroup.vue'
import settings from '@/views/settings.vue'
import blank from '@/views/blank.vue'
import debug from '@/views/debug.vue'
import { fileRoutes } from '@/routes/file'
import { solutionRoutes } from '@/routes/solution'
import { articleRoutes } from '@/routes/article'
import { problemRoutes } from '@/routes/problem'
import { entryRoutes } from '@/routes/entry'

let routes: RouteConfig[] = [
  {
    path: '/',
    name: 'home',
    component: home
  },
  {
    path: '/login',
    name: 'login',
    component: login
  },
  {
    path: '/logout',
    name: 'logout',
    component: logout
  },
  {
    path: '/register',
    name: 'register',
    component: register
  },
  {
    path: '/creategroup',
    name: 'createGroup',
    component: createGroup
  },
  {
    path: '/settings',
    name: 'settings',
    component: settings
  },
  {
    path: '/debugger',
    name: 'debugger',
    component: debug
  },
  {
    path: '/blank',
    name: 'blank',
    component: blank
  }
]
routes = routes.concat(problemRoutes)
routes = routes.concat(fileRoutes)
routes = routes.concat(solutionRoutes)
routes = routes.concat(articleRoutes)
routes = routes.concat(entryRoutes)
routes.push({
  path: '*',
  name: 'error',
  component: error
})

export default routes
