import { createRouter, createWebHashHistory } from 'vue-router';
import store from '../store/index.js';
import EvaluateSite from '../components/UI/EvaluateSite.vue';
import SearchSite from '../components/UI/SearchSite.vue';
import tabsVertical from '../components/UI/ThePanelTabsVertical.vue';

const routes = [
  {
    path: '/',
    beforeEnter: (to, from, next) => {
      // Your are free to add whatever logic here.
      // On first visit
      next('/get-started');
    },
  },
  {
    path: '/get-started',
    name: 'get-started',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: tabsVertical,
  },
  {
    path: '/wetlands-by-design',
    name: 'wetlands-by-design',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: tabsVertical,
    async beforeEnter(to, from, next) {
      await store.commit('updateWbdApp', true);
      next();
    },
  },
  {
    path: '/protecting-groundwater',
    name: 'protecting-groundwater',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: tabsVertical,
    async beforeEnter(to, from, next) {
      await store.commit('updateWbdApp', false);
      next();
    },
    children: [
      {
        path: 'evaluate',
        name: 'EvaluateSite',
        component: EvaluateSite,
        beforeEnter(to, from, next) {
          next();
        },
      },
      {
        path: 'search',
        name: 'SearchSite',
        component: SearchSite,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes,
});

export default router;
