<script setup>
store.numberOfFlippedCards = 1
</script>

<template>
  <StandardLayout
    :store="store"
    :goToHomePage="goToHomePage"
    :isExpanded="isExpanded"
    :descriptionToAlgorithm="descriptionToAlgorithm"
    :SwapCards="SwapCards"
    :startOver="startOver"
    :shuffel="shuffel"
    :checkIfCorrect="checkIfCorrect"
  >
    <template #content="{ selectCards, numberOfSwaps }">
      <!-- übergibt die benötigten Methoden und variablen -->
      <!-- Zusätzlicher Inhalt für die Game-Seite -->
      <div>
        <div class="card-grid">
          <div v-for="(card, index) in store.cards" :key="card.id" class="card-and-line">
            <FlippedCard @click="SelectCard(index)">
              <template #front>
                <h1></h1>
              </template>
              <template #back>
                <img :src="`./images/${card.id}.png`" />
              </template>
            </FlippedCard>

            <svg class="line" width="50" height="300">
              <!-- Linie -->
              <line
                v-show="index === numberOfSwaps"
                x1="25"
                y1="0"
                x2="25"
                y2="300"
                stroke="red"
                stroke-width="6"
              />
            </svg>
          </div>
        </div>
      </div>
    </template>
    <template #extraButtons="{ swapCards }">
      <ButtonPress label="vertauschen" @click="swapCards" />
      <ButtonPress label="kleiner" @click="moveToSmaller" />
      <ButtonPress label="größer" @click="moveToBigger" />
    </template>
  </StandardLayout>
</template>

<script>
import StandardLayout from './PageLayout.vue'
import { store } from '@/store.js'
import FlippedCard from '@/components/FlippedCard.vue'

export default {
  name: 'GamePage',
  components: {
    StandardLayout,
    FlippedCard,
  },
  data() {
    return {
      numberOfSwaps: 0,
      store,
      selectedCard: null,
      pivotElement: null,
    }
  },
  methods: {
    moveToSmaller() {
    },
    SelectCard(index) {
      if (this.selectedCard === null) {
        this.selectedCard = index;
      } else {
        this.selectedCard = null;
        //alert("FALSCH")
      }

    }
  },
}
</script>

<style scoped>
.card-and-line {
  display: flex;
  align-items: center;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 32px;
  justify-items: center;
  font-family: Arial, sans-serif;
}
</style>
