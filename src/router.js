import { createRouter, createWebHistory } from 'vue-router'
import HomePage from './pages/HomePage.vue'
import SortingPage from './pages/SortingPage2.vue'
import FinishPage from './pages/FinishPage.vue'
import TestPage from './pages/TestPage.vue'
import QuicksortPage from './pages/QuicksortPage.vue'
import MergeSortPage from './pages/MergeSortPage.vue'

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
    component: FinishPage,
  },
  {
    path: '/TestPage',
    name: 'TestPage',
    component: TestPage,
  },
  {
    path: '/quickSortPage',
    name: 'QuickSortPage',
    component: QuicksortPage,
  },
  {
    path: '/mergeSortPage',
    name: 'MergeSortPage',
    component: MergeSortPage,
  }
]
//erstellt den router
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL), //muss zum navigieren definiert werden.
  routes,
})

export default router
