<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { resetStore } from '@/store.js'
import { generateCards } from '@/cardSetup.js'
import startConfig from '../configs/startConfig.json'
import errorMessages from '../descriptions/messages.json'
import descriptions from '../descriptions/homePageDescriptions.json'
import router from '@/router.js'
import Slider from 'primevue/slider'
import Dialog from 'primevue/dialog'
import TutorialDialog from '@/components/TutorialDialog.vue'

// Reset des Stores
resetStore()

// Daten-Variablen
const visibleTutorial = ref(false)
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
  } else if (selectedCategory.value === 'Merge Sort') {
    router.push('/mergeSortPage')
  } else {
    router.push('/sortingPage')
  }
}

// Event-Handler für Tasten
function handleKeyPress(event) {
  if (event.key === 'Enter') {
    goToSortingPage()
  }
}

function openTutorial() {
  visibleTutorial.value = true
}

// Lifecycle-Hooks
onMounted(() => {
  window.addEventListener('keyup', handleKeyPress)

  //Überprüft, ob der Nutzer die Seite schon einmal besucht hat
  if (sessionStorage.getItem('visited') === null) {
    sessionStorage.setItem('visited', 'true')
    openTutorial()
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('keyup', handleKeyPress)
})
</script>

<template>
  <!-- Überschrift -->
  <header>
    <img src="/logo.svg" type="image/svg+xml" alt="Meine SVG-Grafik" width="100" height="100" />
    <h1>
      <span class="spezial">S</span>ort<span class="coloring"
        ><span class="spezial">L</span>ab</span
      >
    </h1>
    <ButtonPress class="tutorial-button" label="?" @click="openTutorial"></ButtonPress>
  </header>

  <div class="content">
    <!-- Beschreibung des Spiels -->
    <Dialog
      v-model:visible="visibleTutorial"
      :header="`SortLab Anleitung`"
      class="dialog"
      @update:visible="resetStore"
    >
      <TutorialDialog />
    </Dialog>

    <!-- Flexbox für die Auswahl von Algorithmen und Modi -->
    <div class="flex-container-row">
      <!-- Auswahl des Modus -->
      <fieldset class="radio-box">
        <legend>{{ description.selectMode }}</legend>
        <div class="flex-container-column">
          <div v-for="category in modes" :key="category.key">
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
        <div class="flex-container-column">
          <div
            v-for="category in algorithms"
            :key="category.key"
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
    <div class="flex-container-column number-selection">
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

    <!-- Start-Button -->
    <ButtonPress class="start-button" label="Start" @click="goToSortingPage" />
  </div>

  <!-- Fußzeile -->
  <footer>
    <p>{{ description.impressum }}</p>
  </footer>
</template>

<style scoped>
.spezial {
  font-family: 'Otto Font', serif;
}
.coloring {
  color: #003200;
}

.start-button {
  width: 200px; /* Breite des Buttons */
  height: 50px; /* Höhe des Buttons */
  font-size: 30px; /* Größe des Textes */
  margin-top: 10px; /* Abstand nach oben */
}

.tutorial-button {
  font-size: 1.7em;
  padding: 8px 14px;
}

input:disabled + label {
  color: gray;
  opacity: 0.6; /* verringert die Sichtbarkeit */
}

.disabled-text {
  color: gray;
  opacity: 0.6; /* verringert die Sichtbarkeit */
}

footer {
  justify-content: right;
}

.number-selection {
  margin-top: 20px;
  margin-bottom: 20px;
  align-items: center;
  width: 100%;
}

.slider {
  margin-bottom: 10px;
  width: 14%;
}

/* Tooltip */
.tooltip {
  display: none;
}

label:hover .tooltip {
  display: inline-block;
}
</style>
