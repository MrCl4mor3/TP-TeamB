<template>
  <StandardLayout :store="store" :isExpanded="isExpanded">
    <template #cards="{ selectCards }">
      <div class="card-grid">
        <!-- Hier wird für jede Karte ein FlippedCard erstellt -->
        <div v-for="(card, index) in store.cards" :key="card.id">
          <FlippedCard @click="selectCards(index)">
            <template #front>
              <div class="frontside">
                <h1>Test</h1>
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
  gap: 16px;
  justify-items: center;
  font-family: Arial, sans-serif;
}

.card-grid > div {
  perspective: 1000px; /* Perspektive für die 3D-Drehung */
  transition: transform 0.2s ease; /* Animation für Hover */
}

.card-grid > div:hover {
  transform: scale(1.1); /* Vergrößert die Karte leicht */
}

.frontside,
.backside {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 2px solid black; /* Schwarze Umrandung */
  border-radius: 8px; /* Abgerundete Ecken */
  backface-visibility: hidden; /* Verhindert das Anzeigen der Rückseite */
  transition: border-color 0.2s ease; /* Sanfte Änderung der Umrandungsfarbe */
}

</style>

