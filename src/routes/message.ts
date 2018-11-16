import { RouteConfig } from 'vue-router';

export const messageRoutes: RouteConfig[] = [
    {
        path: '/message',
        name: 'messageList',
        component: () =>
            import(/* webpackChunkName: "message" */ '../views/message/list.vue')
    }
]