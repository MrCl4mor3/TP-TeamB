<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { resetStore } from '@/store.js'
import { generateCards } from '@/cardSetup.js'
import startConfig from '../configs/startConfig.json'
import errorMessages from '../descriptions/errorMessages.json'
import descriptions from '../descriptions/homePageDescriptions.json'
import router from '@/router.js'
import Slider from 'primevue/slider'

// Reset des Stores
resetStore()

// Daten-Variablen
const selectedCategory = ref(startConfig.startAlgorithm)
const selectedMode = ref(startConfig.startMode)
const description = ref(descriptions)
const slideNumber = ref(startConfig.startNumberOfCards) // Anzahl der Karten
const algorithms = ref([
  { key: 'bubble-sort', name: 'Bubble Sort' },
  { key: 'insertion-sort', name: 'Insertion Sort' },
  { key: 'selection-sort', name: 'Selection Sort' },
  { key: 'quick-sort', name: 'Quick Sort' },
  { key: 'merge-sort', name: 'Merge Sort' },
])
const modes = ref([
  { key: 'free-sort', name: 'Freies Sortieren' },
  { key: 'unfree-sort', name: 'Vorgegebenes Sortieren' },
])

// Berechnete Eigenschaften
const numberOfCards = computed(() => slideNumber.value)

// Methoden
function goToSortingPage() {
  const errors = []

  if (!selectedCategory.value) {
    errors.push(errorMessages['noAlgorithmSelected'])
  }
  if (!selectedMode.value) {
    errors.push(errorMessages['noModeSelected'])
  }
  if (numberOfCards.value < 4 || numberOfCards.value > 20) {
    errors.push(errorMessages['outOfRange'])
  }
  if (errors.length > 0) {
    alert(errors.join('\n'))
    return
  }

  // Karten generieren und weiterleiten
  generateCards(selectedCategory.value, selectedMode.value, numberOfCards.value, false)
  if (selectedCategory.value === 'Quick Sort') {
    router.push('/quickSortPage')
  } else {
    router.push('/sortingPage')
  }
}

function goToTestPage() {
  generateCards(selectedCategory.value, selectedMode.value, 20, true)
  router.push('/testPage')
}

// Event-Handler für Tasten
function handleKeyPress(event) {
  if (event.key === 'Enter') {
    goToSortingPage()
  }
  if (event.key === 't') {
    goToTestPage()
  }
}

// Lifecycle-Hooks
onMounted(() => {
  window.addEventListener('keyup', handleKeyPress)
})

onBeforeUnmount(() => {
  window.removeEventListener('keyup', handleKeyPress)
})
</script>

<template>
  <header>
    <h1>{{ description.headline }}</h1>
  </header>

  <!-- Beschreibung des Spiels -->
  <div class="description-container">
    <details>
      <summary>{{ description.instructionHeader }}</summary>
      <p>{{ description.instructions }}</p>
    </details>
  </div>

  <!-- Flexbox für die Auswahl von Algorithmen und Modi -->
  <div class="modi-algo-container">
    <!-- Auswahl des Modus -->
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

    <!-- Auswahl des Algorithmus -->
    <fieldset class="radio-box">
      <legend :class="{ 'disabled-text': selectedMode === 'Freies Sortieren' }">
        {{ description.selectAlgorithm }}
      </legend>
      <div class="radio-group-algorithms">
        <div
          v-for="category in algorithms"
          :key="category.key"
          class="flex items-center gap-2"
          :class="{ 'disabled-text': selectedMode === 'Freies Sortieren' }"
        >
          <input
            type="radio"
            :id="category.key"
            v-model="selectedCategory"
            name="category"
            :value="category.name"
            :disabled="selectedMode === 'Freies Sortieren'"
          />
          <label :for="category.key" class="radio-label">
            {{ category.name }}
            <span v-if="selectedMode === 'Freies Sortieren'" class="tooltip">
              {{ description.wrongMode }}
            </span>
          </label>
        </div>
      </div>
    </fieldset>
  </div>

  <!-- Auswahl der Anzahl der Karten -->
  <div class="NumberSelect">
    <label for="AnzahlKarten">{{ description.selectNumber }}</label>
    <InputNumber
      v-model="slideNumber"
      inputId="AnzahlKarten"
      showButtons
      :min="startConfig.minNumberOfCards"
      :max="startConfig.maxNumberOfCards"
    />
    <Slider v-model="slideNumber" class="slider" :min="4" :max="20" />
  </div>
  <div class="start-container">
    <ButtonPress label="Start" @click="goToSortingPage" />
  </div>

  <footer>
    <p>{{description.impressum}}</p>
  </footer>
</template>

<style scoped>
/*Styling für die Überschrift*/
h1 {
  font-size: 80px; /* Größe der Überschrift */
}

.slider {
  width: 20%;
  margin: 20px;
}
.NumberSelect {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
  margin-bottom: 20px;
  font-family: Arial, sans-serif;
  font-size: 20px;
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
  accent-color: #10b981;
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
  margin-top: 10px; /* Abstand nach oben */
}

.start-container button {
  width: 200px; /* Breite des Buttons */
  height: 50px; /* Höhe des Buttons */
  font-size: 1.7em; /* Größe des Textes */
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
  margin-top: 24px; /* Abstand nach oben */
  margin-bottom: 24px; /* Abstand nach unten */
  font-family: Arial, sans-serif;
  font-weight: bold;
  font-size: 20px;
}

input:disabled + label {
  color: gray;
  opacity: 0.6; /* verringert die Sichtbarkeit */
}
.disabled-text {
  color: gray;
  opacity: 0.6; /* verringert die Sichtbarkeit */
}
.tooltip {
  display: none;
  position: absolute;
  color: red;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 0.9em;
  white-space: nowrap;
  z-index: 1000;
}
label:hover .tooltip {
  display: inline-block;
}
footer {
  justify-content: right;
  font-family: Arial, sans-serif;
  font-size: 1em;
}
</style>
