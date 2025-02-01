<template>
  <div class="card-container" @click="toggleFlip">
    <div class="card" :class="{ flipped: isFlipped }">
      <!-- Vorderseite der Karte -->
      <div class="card-face card-front">
        <slot name="front">Front Content</slot>
        <!-- Hier wird der Inhalt der Vorderseite der Karte angezeigt -->
      </div>
      <!-- Rückseite der Karte -->
      <div class="card-face card-back">
        <slot name="back">Back Content</slot>
        <!-- Hier wird der Inhalt der Rückseite der Karte angezeigt -->
      </div>
    </div>
  </div>
</template>

<script>
import { store } from '../store'
export default {
  setup() {
    return { store } //Setup, damit auf store zugegriffen werden kann
  },
  data() {
    //variablen die in der Komponente verwendet werden
    return {
      isFlipped: false,
    }
  },
  methods: {
    // Methode um die Karte zu drehen. Hier kann nur umgedreht werden wenn weniger als 2 Karten
    // umgedreht sind. Wenn die Karte schon umgedreht ist wird die Anzahl der umgedrehten karten
    // um eins reduziert.
    toggleFlip() {
     // alert("flop");
      if (store.numberOfFlippedCards < 2 && !this.isFlipped) {
        this.isFlipped = !this.isFlipped
        store.numberOfFlippedCards++
      } else if (this.isFlipped) {
        this.isFlipped = !this.isFlipped
        store.numberOfFlippedCards--
      }
    },
  },
}
</script>

<style scoped>

/*Container für die Karte*/
.card-container {
  perspective: 1000px;
  width: 200px; /*200px, 300px*/
  height: 300px;
}

/*Basic Styling für die Karte */
.card {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.6s;
}
.card:hover {
  transform: scale(1.1);
}

.card.flipped {
  transform: rotateY(180deg); /* Dreht die Karte um 180 Grad um die Y-Achse */
}

/*Styling für die Vorder- und Rückseite der Karte */
.card-face {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #10b981;
  border: 2px solid black;
  border-radius: 12px;
  overflow: hidden;
}

.card-back {
  transform: rotateY(180deg); /*dreht die Rückseite der Karte um 180 Grad*/
  background: white;
}

</style>
