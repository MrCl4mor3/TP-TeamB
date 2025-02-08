<template>
  <div class="dialog-content">
    <h2>Willkommen bei SortLab!</h2>
    <p>Hier kannst du spielerisch lernen, wie verschiedene Sortieralgorithmen funktionieren. SortLab hilft dir, das Konzept von Algorithmen und Computational Thinking besser zu verstehen.</p>

    <h2>Setup – So startest du:</h2>
    <ul>
      <li><strong>Freies Sortieren:</strong> Hier kannst du die Karten beliebig aufdecken und vertauschen, ohne einem bestimmten Algorithmus zu folgen.</li>
      <li><strong>Vorgegebenes Sortieren:</strong> Wähle zusätzlich einen Algorithmus und folge dessen Regeln, um die Karten zu sortieren.</li>
      <li>Entscheide, wie viele Karten du sortieren möchtest.</li>
    </ul>

    <h2>Wie funktioniert das Sortieren?</h2>
    <p>Die Karten enthalten Bilder mit Strichen. "Kleiner" bedeutet, dass eine Karte weniger Striche hat als eine andere. Deine Aufgabe ist es, die Karten in der richtigen Reihenfolge zu sortieren.</p>
    <p>Hierfür kannst du bis zu zwei aufdecken und nachdem vergleichen vertauschen. Bei Mergesort und Quicksort gibt es algorithmenspezifische Zusatzfunktionen.</p>
    <!-- Beispielkarten mit "<" einfügen -->

    <h2>Hilfreiche Funktionen:</h2>
    <ul>
      <li>Falls du nicht mehr weißt, wie dein gewählter Algorithmus funktioniert, kannst du mit dem ?-Symbol oben rechts eine Erklärung abrufen.</li>
      <li>Mit dem ↻-Symbol kannst du die Karten neu mischen und noch einmal von vorne starten.</li>
    </ul>

    <h2>Punkte (Score):</h2>
    <p>Dein Score zählt, wie oft du eine Karte aufdeckst. Je effizienter du sortierst, desto besser!</p>

    <h2>Vergleich mit festen Algorithmen:</h2>
    <p>Wenn du fertig bist und auf "Fertig sortiert" geklickt hast, kannst du deinen Score mit dem der festen Algorithmen vergleichen.</p>

    <p>Viel Spaß mit SortLab!</p>
  </div>
</template>

<script setup>
</script>

<style scoped>
.dialog-content {
  padding: 20px;
  font-size: 1.2em;
}

h2 {
  font-weight: bold;
}

ul {
  list-style-type: none;
  padding: 0;
}

ul li {
  margin-bottom: 10px;
}
</style>
