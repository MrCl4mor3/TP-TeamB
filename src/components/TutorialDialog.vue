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

    <h2>So funktioniert das Sortieren:</h2>
    <p>
      Deine Aufgabe ist es, die Karten in aufsteigender Reihenfolge zu sortieren.<br />
      Die Karten enthalten Bilder mit Strichen. "Kleiner" bedeutet, dass eine Karte weniger Striche
      hat als eine andere:
    </p>
    <!-- Beispielkarten mit einfügen -->
    <div class="flex-container-row">
      <!-- Karten mit weniger Strichen -->
      <div class="flex-container-column">
        <div
          class="example-card"
          v-if="cardBigger && cardBigger.svg"
          v-html="cardSmaller.svg.outerHTML"
        ></div>
        <p><strong>kleiner</strong></p>
      </div>
      <!-- Karten mit mehr Strichen -->
      <div class="flex-container-column">
        <div
          class="example-card"
          v-if="cardSmaller && cardSmaller.svg"
          v-html="cardBigger.svg.outerHTML"
        ></div>
        <p><strong>größer</strong></p>
      </div>
    </div>
    <p>
      Hierfür kannst du bis zu zwei Karten aufdecken, indem du diese mit der Maus anklickst und nach
      dem Vergleichen vertauschst. <br />
      Bei Mergesort und Quicksort gibt es algorithmenspezifische Zusatzfunktionen. Diese werden dir
      im Spiel erklärt. <br />
      <br />
      Wenn du fertig bist, klicke auf "Fertig sortiert".
    </p>
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

    <h2>Vergleich mit bereits bekannten Algorithmen:</h2>
    <p>
      Wenn du fertig bist und auf "Fertig sortiert" geklickt hast, kannst du deinen Score mit dem
      der bereits bekannten Algorithmen vergleichen.
    </p>

    <p>Viel Spaß mit SortLab!</p>
  </div>
</template>

<style scoped>
.flex-container-column {
  align-items: center;
}

.dialog-content {
  padding: 20px;
  line-height: 1.5;
}

h2 {
  font-weight: bold;
  line-height: 1.3;
  margin-top: 24px;
  margin-bottom: 16px;
}

p {
  margin-bottom: 12px;
}

ul {
  list-style-type: none;
  padding: 0;
}

ul li {
  margin-bottom: 8px;
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
