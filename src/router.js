import { createRouter, createWebHistory } from 'vue-router';
import HomePage from './pages/HomePage.vue';
import SortingPage from './pages/SortingPage.vue';
import FinishPage from './pages/FinishPage.vue';
//Definiert die Routen und Namen für die verschiedenen Seiten.
const routes = [
  {
    path: '/',
    name: 'HomePage',
    component: HomePage,
  },
  {
    path: '/sortingPage',
    name: 'SortingPage',
    component: SortingPage,
  },
  {
    path: '/finishPage',
    name: 'FinishPage',
    component: FinishPage
  }
];
//erstellt den router
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL), //muss zum navigieren definiert werden.
  routes,
});

export default router;
