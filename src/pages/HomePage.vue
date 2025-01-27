<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { resetStore } from '@/store.js'
import { generateCards } from '@/cardSetup.js'
import startConfig from '../configs/startConfig.json'
import errorMessages from '../descriptions/errorMessages.json'
import descriptions from '../descriptions/homePageDescriptions.json'
import router from '@/router.js'
import Slider from 'primevue/slider'
import InputText from 'primevue/inputtext'

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
  generateCards(selectedCategory.value, selectedMode.value, numberOfCards.value)
  if (selectedCategory.value === 'Quick Sort') {
    router.push('/quickSortPage')
  } else {
    router.push('/sortingPage')
  }
}

function goToTestPage() {
  generateCards(selectedCategory.value, selectedMode.value, numberOfCards.value)
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
  <h1>{{ description.headline }}</h1>

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
    <InputText v-model.number="slideNumber" inputId="AnzahlKarten" />
    <Slider v-model="slideNumber" class="slider" :min="4" :max="20" />
  </div>
  <div class="start-container">
    <ButtonPress label="Start" @click="goToSortingPage" />
  </div>
</template>

