<script setup>
import { ref, onMounted } from 'vue';
import { svgLoader} from "@/setupCards.js";
import { store } from "@/store.js";

// SVG laden
const { svgContent, loadSvg } = svgLoader();
const numberOfCards = store.numberOfCards;
const cards = ref(
  Array.from({ length: numberOfCards }, (_, index) => ({
    id: index,
    flipped: false,
  }))
);

onMounted(() => {
  loadSvg(); // Lädt die SVG beim Laden der Komponente
});

function flipCard(card) {
  card.flipped = !card.flipped;
}
</script>

<template>

  <div class="home">
    <ButtonPress icon="pi pi-home" aria-label="Save" @click="goToHomePage" />
  </div>


  <div class="card-container">
    <div
      v-for="card in cards"
      :key="card.id"
      class="card"
      @click="flipCard(card)"
    >
      <div class="card-inner" :class="{ flipped: card.flipped }">
        <!-- Vorderseite -->
        <div class="card-front-content"></div>

        <!-- Rückseite -->
        <div class="card-back">
          <div class="card-back-content" v-html="svgContent"></div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
export default {
  methods: {
    goToHomePage() {
      this.$router.push("/");
    },
  }
}

</script>





<style scoped>
.home {
  display: flex;
  margin: 1rem;
}
.card-container {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.card {
  perspective: 1000px;
  width: 150px;
  height: 200px;
}

.card-inner {
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 0.6s;
}

.card-inner.flipped {
  transform: rotateY(180deg);
}

.card-front-content,
.card-back{
  position: absolute;
  backface-visibility: hidden;
  width: 100%;
  height: 100%;
  border: 2px solid black; /* Schwarze Umrandung */
  border-radius: 10px; /* Optional: Abgerundete Ecken */
  box-sizing: border-box; /* Umrandung beeinflusst Größe nicht */
}

.card-front {
  background: white; /* Sicherstellen, dass der Hintergrund weiß ist */
}

.card-back {
  transform: rotateY(180deg);
}

</style>
