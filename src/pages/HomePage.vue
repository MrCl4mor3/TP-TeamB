<script setup>
import { resetStore } from '@/store.js'

resetStore()
</script>
<template>
  <h1>{{ description.headline }}</h1>
  <div class="description-container">
    <details>
      <summary>{{ description.instructionHeader }}</summary>
      <p>{{ description.instructions }}</p>
    </details>
  </div>
  <!-- Flexbox für die Auswahl von Algorithmen und Modi -->
  <div class="modi-algo-container">
    <!-- Box für Algorithmen -->
    <fieldset class="radio-box">
      <legend>{{ descriptions.selectAlgorithm }}</legend>
      <div class="radio-group-algorithms">
        <div v-for="category in algorithms" :key="category.key" class="flex items-center gap-2">
          <input
            type="radio"
            :id="category.key"
            v-model="selectedCategory"
            name="category"
            :value="category.name"
          />
          <label :for="category.key" class="radio-label">{{ category.name }}</label>
        </div>
      </div>
    </fieldset>
    <!-- Box für Modi -->
    <fieldset class="radio-box">
      <legend>{{ description.selectMode }}</legend>
      <div class="radio-group-modes">
        <div v-for="category in modes" :key="category.key" class="flex items-center gap-2">
          <input
            type="radio"
            :id="category.key"
            v-model="selectedMode"
            name="mode"
            :value="category.name"
          />
          <label :for="category.key" class="radio-label">{{ category.name }}</label>
        </div>
      </div>
    </fieldset>
  </div>

  <div class="cards-container">
    <h2>{{ descriptions.selectNumber }}</h2>
    <InputNumber v-model="numberOfCards" inputId="AnzahlKarten" showButtons :min="4" :max="20" />
  </div>

  <div class="start-container">
    <ButtonPress label="Start" @click="goToSortingPage" />
  </div>
</template>

<script>
import { generateCards } from '@/setupCards.js'
import errorMessages from '../descriptions/errorMessages.json'
import descriptions from '../descriptions/homePageDescriptions.json'
import startConfig from '../configs/startConfig.json'
import { store } from '@/store.js'
export default {
  data() {
    return {
      selectedCategory: startConfig.startAlgorithm,
      selectedMode: startConfig.startMode,
      numberOfCards: startConfig.startNumberOfCards,
      description: descriptions,
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
    }
  },

  mounted() {
    // Event-Listener hinzufügen, um die Enter-Taste zu überwachen**
    window.addEventListener('keyup', this.handleKeyPress)
  },
  beforeUnmount() {
    // Event-Listener entfernen**
    window.removeEventListener('keyup', this.handleKeyPress)
  },

  watch: {
    selectedCategory(newValue) {
      console.log('Selected Category updated:', newValue)
    },
    selectedMode(newValue) {
      console.log('Selected Mode updated:', newValue)
    },
  },

  methods: {
    // Taste "Enter" drücken um zur Sortierseite zu navigieren
    handleKeyPress(event) {
      if (event.key === 'Enter') {
        this.goToSortingPage()
      }
      if (event.key === 't') {
        store.numberOfCards = this.numberOfCards
        store.selectedMode = this.selectedMode
        store.selectedCategory = this.selectedCategory
        this.goToTestPage()
      }
    },

    goToTestPage() {
      this.$router.push('/testPage')
    },

    // Methode um zur Sortierseite zu navigieren, dabei wird die Anzahl der Karten im Store gespeichert
    // und die Karten werden in einem Array gespeiert und gemischt.
    goToSortingPage() {
      let errors = []
      if (this.selectedCategory === null) {
        errors.push(errorMessages['noAlgorithmSelected'])
      }
      if (this.selectedMode === null) {
        errors.push(errorMessages['noModeSelected'])
      }
      if (this.numberOfCards < 4 || this.numberOfCards > 20 || this.numberOfCards === undefined) {
        errors.push(errorMessages['outOfRange'])
      }
      if (errors.length > 0) {
        alert(errors.join('\n'))
        return
      }
      // Karten generieren und in den Store speichern
      generateCards(this.selectedCategory, this.selectedMode, this.numberOfCards)
      this.$router.push('/sortingPage')
    },
  },
}
</script>

<style scoped>
/*Styling für die Überschrift*/
h1 {
  font-size: 80px; /* Größe der Überschrift */
  text-align: center; /* Zentriert den Text */
  font-family: Arial, sans-serif; /* Schriftart */
}
.modi-algo-container {
  display: flex; /* Macht den Container zur Flexbox */
  justify-content: center; /* Zentriert die Boxen */
  gap: 1px; /* Abstand zwischen den Boxen */
  font-family: Arial, sans-serif;
}

.radio-box {
  display: flex; /* Macht die Box zur Flexbox */
  max-width: 30%; /* Maximale Breite der Box */
  flex: 1; /* Füllt den verfügbaren Platz aus */
  flex-direction: column; /* Anordnung der Elemente */
  justify-content: space-evenly;
  align-items: flex-start; /* Links ausgerichtet */
  padding: 10px; /* Innenabstand */
  border: 1px solid black; /* Rahmen */
  border-radius: 8px; /* Abrundung der Ecken */
  margin: 20px; /* Außenabstand */
  font-family: Arial, sans-serif;
}

.radio-label {
  position: relative;
  cursor: pointer;
  padding-left: 30px;
  font-family: Arial, sans-serif;
}

.radio-group-algorithms {
  display: flex; /* Macht die Gruppe zur Flexbox */
  flex-direction: column; /* Anordnung der Elemente */
  gap: 10px; /* Abstand zwischen den Elementen */
  font-family: Arial, sans-serif;
}

.radio-group-modes {
  display: flex; /* Macht die Gruppe zur Flexbox */
  flex-direction: column; /* Anordnung der Elemente */
  gap: 10px; /* Abstand zwischen den Elementen */
  font-family: Arial, sans-serif;
}

legend {
  font-size: 1.7em; /* Größe der Überschrift */
  font-weight: bold; /* Fett gedruckt */
  margin-bottom: 8px; /* Abstand nach unten */
  text-align: center; /* Zentriert den Text */
  font-family: Arial, sans-serif;
}

.start-container {
  display: flex; /* Macht den Container zur Flexbox */
  flex-direction: column; /* Anordnung der Elemente */
  justify-content: center; /* Zentriert die Elemente */
  align-items: center; /* Zentriert die Elemente */
  gap: 20px; /* Abstand zwischen den Elementen */
  font-family: Arial, sans-serif;
}

.start-container button {
  width: 200px; /* Breite des Buttons */
  height: 50px; /* Höhe des Buttons */
  font-size: 1.7em; /* Größe des Textes */
  font-family: Arial, sans-serif;
}

.cards-container {
  text-align: center; /* Zentriert den gesamten Inhalt horizontal */
  margin-top: 24px; /* Optional: Abstand nach oben */
  margin-bottom: 24px; /* Optional: Abstand nach unten */
  font-family: Arial, sans-serif;
}

.cards-container h2 {
  margin-bottom: 8px; /* Abstand zwischen Überschrift und Input-Feld */
  font-size: 1.7em; /* Größe der Überschrift */
  font-family: Arial, sans-serif;
}
.description-container {
  display: flex; /* Macht den Container zur Flexbox */
  justify-content: center; /* Zentriert den Inhalt */
  text-align: center; /* Zentriert den gesamten Inhalt horizontal */
  margin-top: 24px; /* Optional: Abstand nach oben */
  margin-bottom: 24px; /* Optional: Abstand nach unten */
  font-family: Arial, sans-serif;
  font-weight: bold;
  font-size: 20px;
}
</style>
