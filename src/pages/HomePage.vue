<script setup>
import { resetStore } from '@/store.js'

resetStore()
</script>
<template>
  <h1>Sortieralgorithmen</h1>
  <!-- Flexbox für die Auswahl von Algorithmen und Modi -->
  <div class="modi-algo-container">
    <!-- Box für Algorithmen -->
    <fieldset class="radio-box">
      <legend>Wähle einen Algorithmus</legend>
      <div class="radio-group-algorithms">
        <div v-for="category in algorithms" :key="category.key" class="flex items-center gap-2">
          <input type="radio"
                 :checked="selectedCategory === category.name"
                 name="category"
                 :value="category.name"
                 @change="updateAlgorithm(category.name)"
          />
          <label :for="category.key">{{ category.name }}</label>
        </div>
      </div>
    </fieldset>
    <!-- Box für Modi -->
    <fieldset class="radio-box">
      <legend>Wähle einen Modus</legend>
      <div class="radio-group-modes">
        <div v-for="category in modes" :key="category.key" class="flex items-center gap-2">
          <input type="radio"
                 :checked="selectedMode === category.name"
                 name="radio"
                 :value="category.name"
                 @change="updateMode(category.name)"
          />
          <label :for="category.key">{{ category.name }}</label>
        </div>
      </div>
    </fieldset>
  </div>

  <div class="cards-container">
    <h2>Anzahl Karten (zwischen 4 und 20)</h2>
    <InputNumber v-model="numberOfCards" inputId="AnzahlKarten" showButtons :min="4" :max="20" />
  </div>

  <div class="start-container">
    <ButtonPress label="Start" @click="goToSortingPage"/>
  </div>
</template>

<script>
import { store } from '../store'
import errorMessages from '../descriptions/errorMessages.json'
export default {
  data() {
    return {
      cards: [],
      algorithms: [
        { key: 'bubble-sort', name: 'Bubble Sort' },
        { key: 'insertion-sort', name: 'Insertion Sort' },
        { key: 'selection-sort', name: 'Selection Sort' },
        { key: 'quick-sort', name: 'Quick Sort' },
        { key: 'merge-sort', name: 'Merge Sort' },
      ],
      modes: [
        { key: 'free-sort', name: 'Freies Sortieren' },
        { key: 'unfree-sort', name: 'Vorgegebenes Sortieren' },
      ],
      selectedCategory: null,
      selectedMode: null,
    }
  },
  methods: {
    // Methode um zur Sortierseite zu navigieren, dabei wird die Anzahl der Karten im Store gespeichert
    // und die Karten werden in einem Array gespeiert und gemischt.
    goToSortingPage() {
      let errors = []
      if(this.selectedCategory === null) {
        errors.push(errorMessages["noAlgorithmSelected"])
      }
      if(this.selectedMode === null) {
        errors.push(errorMessages["noModeSelected"])

      }
      if(this.numberOfCards < 4 || this.numberOfCards > 20 || this.numberOfCards === undefined) {
        errors.push(errorMessages["outOfRange"])

      }
      if(errors.length > 0) {
        alert(errors.join("\n"))
        return
      }
      store.selectedMode = this.selectedMode
      store.selectedCategory = this.selectedCategory
      store.numberOfCards = this.numberOfCards
      const cards = Array.from({ length: this.numberOfCards }, (_, index) => ({
        id: index, //Identifikator der Karte
        value: `Karte ${index + 1}`, //Wert der Karte hier müsste man dann das Bild einfügen
      }))
      //die Karten werden gemischt und sowohl die korrekte als auch die start Reihenfolge wird gespeichert
      store.correctCards = cards.slice()
      store.cards = cards
      store.cards = store.cards.sort(() => Math.random() - 0.5)
      store.startingCards = cards.slice()
      this.$router.push('/sortingPage')
    },
    updateAlgorithm(categoryName) {
      // Setzt die aktuelle Auswahl zurück und wählt die neue
      if (this.selectedCategory === categoryName) {
        this.selectedCategory = null // Auswahl entfernen
      } else {
        this.selectedCategory = categoryName // Neue Kategorie auswählen
      }
    },
    updateMode(categoryName) {
      if (this.selectedMode === categoryName) {
        this.selectedMode = null
      } else {
        this.selectedMode = categoryName
      }
    }
  },
}
</script>

<style scoped>
/*Styling für die Überschrift*/
h1 {
  font-size: 80px; /* Größe der Überschrift */
  text-align: center; /* Zentriert den Text */
}
.modi-algo-container {
  display: flex; /* Macht den Container zur Flexbox */
  justify-content: center; /* Zentriert die Boxen */
  gap: 1px; /* Abstand zwischen den Boxen */
}

.radio-box {
  flex: 1; /* Lässt beide Boxen gleich groß werden */
  max-width: 30%; /* Optionale Begrenzung der Breite */
  padding: 10px; /* Innenabstand */
  border: 1px solid black; /* Rahmen um die Box */
  border-radius: 5px; /* Abgerundete Ecken */
  margin: 20px;
}

legend {
  font-size: 1.7em; /* Größe der Überschrift */
  font-weight: bold; /* Fett gedruckt */
  margin-bottom: 8px; /* Abstand nach unten */
  text-align: center; /* Zentriert den Text */
}

.start-container {
  display: flex; /* Macht den Container zur Flexbox */
  flex-direction: column; /* Anordnung der Elemente */
  justify-content: center; /* Zentriert die Elemente */
  align-items: center; /* Zentriert die Elemente */
  gap: 20px; /* Abstand zwischen den Elementen */
}

.start-container button {
  width: 200px; /* Breite des Buttons */
  height: 50px; /* Höhe des Buttons */
  font-size: 1.7em; /* Größe des Textes */
}

.cards-container {
  text-align: center; /* Zentriert den gesamten Inhalt horizontal */
  margin-top: 24px; /* Optional: Abstand nach oben */
  margin-bottom: 24px; /* Optional: Abstand nach unten */
}

.cards-container h2 {
  margin-bottom: 8px; /* Abstand zwischen Überschrift und Input-Feld */
  font-size: 1.7em; /* Größe der Überschrift */
}

.cards-container InputNumber {
  display: inline-block; /* Stellt sicher, dass das Input-Feld korrekt zentriert wird */
}

</style>
