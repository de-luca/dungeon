import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';

import Main from '../views/Main.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/:gameId?',
    name: 'Main',
    component: Main,
  },
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
