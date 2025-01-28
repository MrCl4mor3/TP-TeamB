<script setup>

import DividingLine from '@/components/DividingLine.vue'
</script>

<template>
  <StandardLayout :store="store" :isExpanded="isExpanded">

    <template #cards="{ selectCards}">
      <!-- übergibt die benötigten Methoden und variablen -->
      <div>
        <div class="card-grid">
          <div v-for="(card, index) in store.cards" :key="card.id" class="card-and-line">
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
            <DividingLine v-if="index < store.cards.length - 1" />
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
  components: {
    StandardLayout,
    FlippedCard,
  },
  data() {
    return {
      store,
    }
  },
}
</script>
<style scoped>
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 32px;
  justify-items: center;
  font-family: Arial, sans-serif;
}
.card-and-line {
  display: flex;
  align-items: center;
}
</style>

