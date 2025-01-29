<template>
  <StandardLayout :store="store" :isExpanded="isExpanded">
    <template #cards="{ selectCards }">
      <div class="card-grid">
        <!-- Hier wird für jede Karte ein FlippedCard erstellt -->
        <div v-for="(card, index) in store.cards" :key="card.id">
          <FlippedCard @click="selectCards(index)">
            <template #front>
              <div class="frontside">
              </div>
            </template>
            <template #back>
              <div class="backside">
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

/* Styling für die Karten */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  column-gap: 10px;
  row-gap: 45px;
  justify-items: center;
  font-family: Arial, sans-serif;
  box-sizing: border-box;
}

</style>

