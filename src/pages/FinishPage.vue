<script setup>
import { store } from '../store'
import {
  bubbleSortWithScore,
  selectionSortWithScore,
  insertionSortWithScore,
  quickSortWithScore,
  mergeSortWithScore,
} from '@/algorithms.js'

const bubbleSortResult = bubbleSortWithScore(store.startingCards)
const selectionSortResult = selectionSortWithScore(store.startingCards)
const insertionSortResult = insertionSortWithScore(store.startingCards)
const quickSortResult = quickSortWithScore(store.startingCards)
const mergeSortResult = mergeSortWithScore(store.startingCards)
</script>

<template>
  <ButtonPress icon="pi pi-home" aria-label="Save" @click="goToHomePage" />

  Bravo
  <p>Score: {{ store.score }}</p>
  <p>bubblesort {{ bubbleSortResult }}</p>
  <p>selectionSort {{ selectionSortResult }}</p>
  <p>insertionSort {{ insertionSortResult }}</p>
  <p>quickSort {{ quickSortResult }}</p>
  <p>mergeSort {{ mergeSortResult }}</p>
</template>

<script>
import 'primeicons/primeicons.css'
export default {
  setup() {
    return { store }
  },
  methods: {
    goToHomePage() {
      this.$router.push('/')
    },
  },
}

</script>

<style scoped></style>
