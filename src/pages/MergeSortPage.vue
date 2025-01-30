<script setup>

import DividingLine from '@/components/DividingLine.vue'
</script>

<template>
  <StandardLayout :store="store" :isExpanded="isExpanded">
    <template #cards="{ selectCards}">
      <!-- übergibt die benötigten Methoden und variablen -->

        <div class="grid-grids">
          <div v-for="(container, containerIndex) in store.containers" :key="containerIndex" class="container-and-line">
            <div class="card-grid">
              <div v-for="(card, index) in container" :key="card.id" class="card-and-line">
            <FlippedCard @click="selectCards(index)">
              <template #front>
                <div class="frontsite">
                  <h1>{{ card.id }}</h1>
                </div>
              </template>
              <template #back>
                <div class="backsite">
                  <div v-html="card.svg.outerHTML"></div>
                </div>
              </template>
            </FlippedCard>
            <DividingLine v-if="index < container.length - 1" @click="selectLine(containerIndex, index)" />
          </div>
        </div>
            <DividingLine v-if="(containerIndex < store.containers.length - 1) && (store.containers.length === store.cards.length)" @click="selectLine(containerIndex, index)" />
        </div>
      </div>
    </template>
    <template #extraButtons="{ swapCards }">
      <ButtonPress label="vertauschen" @click="swapCards" />
      <ButtonPress label="split" @click="splitContainer" />
      <ButtonPress label="größer" @click="moveToBigger" />

      <p>{{store.containers.length}}</p>
      <p>{{store.cards.length}}</p>
    </template>
  </StandardLayout>
</template>

<script>
import StandardLayout from './PageLayout.vue'
import { store } from '@/store.js'
import FlippedCard from '@/components/FlippedCard.vue'

export default {
  components: {
    StandardLayout,
    FlippedCard,
  },
  data() {
    return {
      store,
      linePositionContainer: null,
      linePositionCard: null,
    }
  },
  methods: {
    selectLine(containerIndex, index) {
      if(store.selectedLines !== 0) {
        this.linePositionContainer = containerIndex
        this.linePositionCard = index
      } else {
        this.linePositionContainer = null
        this.linePositionCard = null
      }
    },
    splitContainer() {
      const containerToSplit = store.containers[this.linePositionContainer]

      const firstHalf = containerToSplit.slice(0, this.linePositionCard + 1)
      const secondHalf = containerToSplit.slice(this.linePositionCard + 1)

      store.containers.splice(this.linePositionContainer, 1, firstHalf, secondHalf)
      store.selectedLines = 0;
    }
  }
}
</script>
<style scoped>
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  justify-items: center;
  font-family: Arial, sans-serif;
  border: 4px solid mediumvioletred; /* Fügt eine weiße Umrandung hinzu */
  padding: 10px; /* Abstand zwischen Inhalt und Rahmen */
  margin-bottom: 20px; /* Abstand zwischen einzelnen Grids */
  border-radius: 10px; /* Optional: Abgerundete Ecken */
  width: max-content;
  max-width: 100%;
}
.card-and-line {
  display: flex;
  align-items: center;
  justify-content: center;
}
.container-and-line {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>

