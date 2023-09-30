import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';

import Main from './views/Main.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/:gameId([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})?',
    name: 'Main',
    component: Main,
  },
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
