<template>
  <StandardLayout :store="store" :isExpanded="isExpanded">
    <template #cards="{ selectCards }">
      <div class="flex-container-row">
        <!-- Hier wird für jede Karte ein FlippedCard erstellt -->
        <div v-for="(card, index) in store.cards" :key="card.id" class="flex-container-column">
          <FlippedCard
              @click="selectCards(index)"
              :card-id="card.id"
              ref="singlecard"
          >
            <template #front>
              <div class="frontside"></div>
            </template>
            <template #back>
              <div class="backside">
                <div v-html="card.svg.outerHTML"></div>
              </div>
            </template>
          </FlippedCard>
          <!-- Position unter der Karte -->
          <div class="card-description">Position: {{ index + 1 }}</div>
        </div>
      </div>
    </template>

    <template #extraButtons="{ swapCards }">
      <ButtonPress label="vertauschen" icon="pi pi-arrow-right-arrow-left" @click="swapCards" />
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

.flex-container-column {
  gap: 16px;
  align-items: center;
}
</style>
