import { createRouter, createWebHistory } from 'vue-router';
import EvaluateSite from '../components/UI/EvaluateSite.vue';
import SearchSite from '../components/UI/SearchSite.vue';
import tabsVertical from '../components/UI/ThePanelTabsVertical.vue';

const routes = [
  // {
  //   path: '/',
  //   name: 'Home',
  //   component: Home
  // },
  {
    path: '/',
    beforeEnter: (to, from, next) => {
      // Your are free to add whatever logic here.
      // On first visit
      next('/tab1');
    },
  },
  {
    path: '/tab1',
    name: 'tab1',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: tabsVertical,
  },
  {
    path: '/tab2',
    name: 'tab2',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: tabsVertical,
  },
  {
    path: '/tab3',
    name: 'tab3',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: tabsVertical,
    children: [
      {
        path: 'evaluate',
        name: 'EvaluateSite',
        component: EvaluateSite,
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
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
