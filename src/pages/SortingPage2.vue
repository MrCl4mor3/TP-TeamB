<template>
  <StandardLayout
    :store="store"
    :isExpanded="isExpanded"
  >
    <template #cards="{ selectCards}">
      <div class="card-grid">
        <!-- Hier wird für jede Karte ein FlippedCard erstellt -->
        <div v-for="(card, index) in store.cards" :key="card.id">
          <FlippedCard @click="selectCards(index)">
            <template #front>
              <div class="frontsite">
                <h1>{{card.id}}</h1>
              </div>
            </template>
            <template #back>
              <div class="backsite">
                <div v-html="card.svg.outerHTML"></div>
              </div>
            </template>
          </FlippedCard>
        </div>
      </div>
    </template>

    <template #extraButtons="{ swapCards }">
      <ButtonPress label="vertauschen" @click="swapCards" />
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
</style>
