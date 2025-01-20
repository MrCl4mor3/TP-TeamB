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
              <h1></h1>
            </template>
            <template #back>
              <img :src="`./images/${card.id}.png`"  alt=""/>
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
