<script setup>
import { resetStore } from '@/store.js'

resetStore()
</script>
<template>
  <div>
    <h1>Sortieralgorithmen</h1>
    <ButtonPress label="Start" @click="goToSortingPage" />
  </div>

  <!-- Box für Algorithmen -->
  <fieldset class="radio-box">
    <legend>Wähle einen Algorithmus</legend>
    <div class="radio-group-algorithms">
      <h2>Algorithmen</h2>
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
      <h2>Modi</h2>
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

  <div>
    <h2>Anzahl Karten (zwischen 4 und 20)</h2>
    <InputNumber v-model="numberOfCards" inputId="AnzahlKarten" showButtons :min="4" :max="20" />
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
  font-size: 80px;
  text-align: center;
}
.checkBox-algorithms {
  position: relative;
  width: 50%;
}
.checkBox-modes {
  position: relative;


}
.chekbox {
  display: flex;
  gap: 20px;
}

</style>
