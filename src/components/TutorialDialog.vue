<script setup>
import { onMounted, computed } from 'vue'
import { store } from '@/store.js'
import { generateCards } from '@/cardSetup.js'

onMounted(() => {
  generateCards('bubble-sort', 'free-sort', 4, false)
})

const cardSmaller = computed(() => store.correctCards[0])
const cardBigger = computed(() => store.correctCards[1])
</script>

<template>
  <div class="dialog-content">
    <h2>Willkommen bei SortLab!</h2>
    <p>
      Hier kannst du spielerisch lernen, wie verschiedene Sortieralgorithmen funktionieren. SortLab
      hilft dir, das Konzept von Algorithmen und Computational Thinking besser zu verstehen.
    </p>

    <h2>Setup – So startest du:</h2>
    <ul>
      <li>
        <strong>Freies Sortieren:</strong> Hier kannst du die Karten beliebig aufdecken und
        vertauschen, ohne einem bestimmten Algorithmus zu folgen.
      </li>
      <li>
        <strong>Vorgegebenes Sortieren:</strong> Wähle zusätzlich einen Algorithmus und folge dessen
        Regeln, um die Karten zu sortieren.
      </li>
      <li>Entscheide, wie viele Karten du sortieren möchtest.</li>
    </ul>

    <h2>Wie funktioniert das Sortieren?</h2>
    <p>
      Die Karten enthalten Bilder mit Strichen. "Kleiner" bedeutet, dass eine Karte weniger Striche
      hat als eine andere. Deine Aufgabe ist es, die Karten in der richtigen Reihenfolge zu
      sortieren.
    </p>
    <p>
      Hierfür kannst du bis zu zwei aufdecken und nachdem vergleichen vertauschen. Bei Mergesort und
      Quicksort gibt es algorithmenspezifische Zusatzfunktionen.
    </p>
    <!-- Beispielkarten mit einfügen -->
    <div class="card-grid">
      <!-- Karten mit weniger Strichen -->
      <div class="card-with-position">
        <div
          class="example-card"
          v-if="cardBigger && cardBigger.svg"
          v-html="cardSmaller.svg.outerHTML"
        ></div>
        <p><strong>kleiner</strong></p>
      </div>
      <!-- Karten mit mehr Strichen -->
      <div class="card-with-position">
        <div
          class="example-card"
          v-if="cardSmaller && cardSmaller.svg"
          v-html="cardBigger.svg.outerHTML"
        ></div>
        <p><strong>größer</strong></p>
      </div>
    </div>
    <h2>Hilfreiche Funktionen:</h2>
    <ul>
      <li>
        Falls du nicht mehr weißt, wie dein gewählter Algorithmus funktioniert, kannst du mit dem
        ?-Symbol oben rechts eine Erklärung abrufen.
      </li>
      <li>Mit dem ↻-Symbol kannst du die Karten neu mischen und noch einmal von vorne starten.</li>
    </ul>

    <h2>Punkte (Score):</h2>
    <p>
      Dein Score zählt, wie oft du eine Karte aufdeckst. Je effizienter du sortierst, desto besser!
    </p>

    <h2>Vergleich mit festen Algorithmen:</h2>
    <p>
      Wenn du fertig bist und auf "Fertig sortiert" geklickt hast, kannst du deinen Score mit dem
      der festen Algorithmen vergleichen.
    </p>

    <p>Viel Spaß mit SortLab!</p>
  </div>
</template>

<style scoped>
.dialog-content {
  font-size: 1.2em;
  padding: 20px;
  line-height: 1.5; /* Angenehme Zeilenhöhe für den Fließtext */
}

h2 {
  font-weight: bold;
  line-height: 1.3;
  margin-top: 24px; /* Mehr Abstand nach oben */
  margin-bottom: 16px; /* Klarer Abstand zur nächsten Zeile */
}

p {
  margin-bottom: 12px; /* Geringerer Abstand zwischen Absätzen */
}

ul {
  list-style-type: none;
  padding: 0;
}

ul li {
  margin-bottom: 8px; /* Geringer Abstand für bessere Lesbarkeit */
  line-height: 1.5;
}

.example-card {
  width: 200px;
  height: 300px;
  border: 2px solid black;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
