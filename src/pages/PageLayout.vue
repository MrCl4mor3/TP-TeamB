<script setup>
import { ref } from 'vue'
import Dialog from 'primevue/dialog'
import Toast from 'primevue/toast'



const noAlgorithmNeeded = ref(store.selectedMode === 'Freies Sortieren')

</script>

<template>
  <header>
    <ButtonPress icon="pi pi-home" aria-label="Save" @click="goToHomePage" />
    <h1>
      <span v-if="noAlgorithmNeeded">{{ store.selectedMode }}</span>
      <span v-else>{{ store.selectedCategory }}</span>
    </h1>
    <div class="button-container-meta">
      <ButtonPress label="?" @click="openTutorial"></ButtonPress>
      <ButtonPress
        icon="pi pi-refresh"
        @click="shuffel"
      ></ButtonPress>
    </div>
  </header>

  <Dialog
    v-model:visible="visibleTutorial"
    :header="`Tutorial - ${store.selectedMode === 'Freies Sortieren' ? store.selectedMode : store.selectedCategory}`"
    class="dialog"
  >
    <div class="dialog-content">
      <div v-html="formatDescription(store.selectedCategory)"></div>
    </div>
  </Dialog>

  <Dialog
    v-model:visible="visibleEndScreen"
    :header="'Bravo- Die Karten sind richtig sortiert!'"
    class="dialog"
    @update:visible="prepareReset">
    <div class="dialog-content">
      <div>

        <P>Du hast {{store.score}} Karten angeschaut und {{this.numberOfSwaps}} vertauscht</p>
        <p>BubbleSort: {{ this.bubbleSortResult.scoreLook }} Karten angeschaut und {{this.bubbleSortResult.scoreSwap}} vertauscht</p>
        <p>SelectionSort: {{ this.selectionSortResult.scoreLook }} Karten angeschaut und {{this.selectionSortResult.scoreSwap}} vertauscht</p>
        <p>InsertionSort: {{ this.insertionSortResult.scoreLook }} Karten angeschaut und {{this.insertionSortResult.scoreSwap}} vertauscht</p>
        <p>QuickSort: {{ this.quickSortResult.scoreLook }} Karten angeschaut und {{this.quickSortResult.scoreSwap}} vertauscht</p>
        <p>MergeSort: {{ this.mergeSortResult.scoreLook }} Karten angeschaut und {{this.mergeSortResult.scoreSwap}} vertauscht</p>
      </div>
      <div class="button-container">
        <ButtonPress icon="pi pi-home" @click="goToHomePage" />
        <ButtonPress label="Neustart" @click="startOver" />
        <ButtonPress label="Neu mischen" @click="shuffel" />
      </div>
    </div>
  </Dialog>

  <Toast />

  <div class="content">
    <!-- hier werden die Karten in den einzelnen Seiten hinzugefügt -->
    <slot name="cards" :select-cards="SelectCard" :select-cards2="SelectCardQuick" />
  </div>

  <footer>
    <!--Einfügen des Scores -->
    <div class="score">
      <h2>Angeschaut: {{ store.score }}, Vertauscht: {{this.numberOfSwaps}}</h2>

    </div>
    <!-- hier werden die zusätzlichen Knöpfe hinzugefügt -->
    <div class="button-container">
      <ButtonPress label="auf" @click="openAllCards" />
      <ButtonPress label="zu" @click="prepareReset" />
      <slot name="extraButtons" :swap-cards="SwapCards" />
      <ButtonPress label="fertig sortiert" @click="checkIfCorrect" />
    </div>
  </footer>
</template>

<script>
import { useToast} from "primevue/usetoast"
import algorithmDescription from '@/descriptions/algorithmDescriptions.json'
import errorMessages from '@/descriptions/ErrorMessages.json'
import { store, resetStartValues } from '@/store.js'
import {
  bubbleSortWithScore,
  insertionSortWithScore,
  mergeSortWithScore,
  quickSortWithScore,
  selectionSortWithScore
} from "@/algorithms.js";

export default {
  name: 'StandardLayout',
  props: {
    store: {
      type: Object,
      required: true,
    },
    isExpanded: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {

      bubbleSortResult: null,
      selectionSortResult: null,
      insertionSortResult: null,
      quickSortResult: null,
      mergeSortResult: null,
      toast: null,
      visibleTutorial: false,
      visibleEndScreen: false,
      numberOfSwaps: 0,
      selectedCards: [],
      descriptionToAlgorithm: {
        'Bubble Sort': algorithmDescription['Bubble Sort'],
        'Selection Sort': algorithmDescription['Selection Sort'],
        'Insertion Sort': algorithmDescription['Insertion Sort'],
        'Merge Sort': algorithmDescription['Merge Sort'],
        'Quick Sort': algorithmDescription['Quick Sort'],
        'Free Sort': algorithmDescription['Free Sort'],
      },
    }
  },

  mounted() {
    this.toast = useToast()
  },

  methods: {
    openTutorial() {
      this.visibleTutorial = true
    },

    SwapCards() {
      let canSort = true

      if (store.selectedMode === 'Vorgegebenes Sortieren' && store.selectedCategory !== 'Merge Sort') {
        canSort = !!(
          store.correctSortingOrder[this.numberOfSwaps].includes(store.selectedCards[0]) &&
          store.correctSortingOrder[this.numberOfSwaps].includes(store.selectedCards[1])
        )
      }
      if (store.selectedCards.length === 2 && canSort) {
        const [firstIndex, secondIndex] = store.selectedCards
        const temp = store.cards[firstIndex]
        store.cards[firstIndex] = store.cards[secondIndex]
        store.cards[secondIndex] = temp
        this.numberOfSwaps++
      } else {
        this.toast.add({ severity: 'error', summary: 'Fehler', detail: errorMessages['wrongAlgorithmStep'], life: 3000 })
      }
    },

    SelectCard(index) {
      if (store.selectedCards.includes(index)) {
        store.selectedCards = store.selectedCards.filter((card) => card !== index)
      } else if (store.selectedCards.length < 2) {
        store.selectedCards.push(index);
        store.score++;
      }
    },

    startOver() {
      this.prepareReset()
      store.cards = store.startingCards.slice()
      store.containers.splice(0);
      store.containers.push(store.startingCards);
      this.visibleEndScreen = false;
      this.toast.add({ severity: 'success', summary: 'Spiel wurde zurückgesetzt', life: 3000 })
    },

    shuffel() {
      this.prepareReset()

      if (store.selectedCategory === 'Quick Sort') {
        store.quickReshuffle = true;
        store.cards = store.startingCards.slice();
      } else {
        store.cards = store.cards.sort(() => Math.random() - 0.5)
        store.startingCards = store.cards.slice()
      }

      this.visibleEndScreen = false;
      this.toast.add({ severity: 'success', summary: 'Karten wurden gemischt', life: 3000 })
    },

    checkIfCorrect() {
      if (store.cards.every((card, index) => card.id === store.correctCards[index].id)
        || store.containers[0].every((card, index) => card.id === store.correctCards[index].id)) {
        this.calculateScore()
        this.openAllCards()
        this.visibleEndScreen = true
      } else {
        this.toast.add({ severity: 'error', summary: 'Fehler', detail: 'Die Karten sind noch nicht korrekt sortiert', life: 3000 })
      }
    },

    calculateScore() {
      this.bubbleSortResult = bubbleSortWithScore(store.startingCards)
      this.selectionSortResult = selectionSortWithScore(store.startingCards)
      this.insertionSortResult = insertionSortWithScore(store.startingCards)
      this.quickSortResult = quickSortWithScore(store.startingCards)
      this.mergeSortResult = mergeSortWithScore(store.startingCards)
    },

    //Alle Karten werden aufgedeckt
    openAllCards() {
      store.currentCards.forEach((card) => {
        card.openCard();
      });
    },
    //Alle Karten werden zugedeckt
    prepareReset() {
      store.currentCards.forEach((card) => {
      card.closeCard();
      card.colour = '#10b981';
    });
      store.reloadPage = true;
      store.dividingLinePosition = -1;
      store.dividingContainerPosition = -1;
      store.containers.splice(0);
      store.containers.push(store.startingCards);
      resetStartValues();
    },

    goToHomePage() {
      this.$router.push('/')
      store.selectedCards = []
    },


    formatDescription(category) {
      // Überprüfe, ob der Mode "Freies Sortieren" ist
      if (this.store.selectedMode === 'Freies Sortieren') {
        category = 'Free Sort'
      }

      // Wenn die Kategorie keine Beschreibung hat, gib einen leeren String zurück
      if (!this.descriptionToAlgorithm[category]) return ''

      // Formatieren der Beschreibung: Jede Zeile wird in ein <p>-Tag eingeschlossen
      return this.descriptionToAlgorithm[category]
        .split('\n') // Splitte den Text an Zeilenumbrüchen
        .map((line) => `<p>${line}</p>`) // Wandle jede Zeile in ein <p>-Tag um
        .join('') // Füge alle Absätze wieder zusammen
    },
  },
}
</script>

<style scoped>
.score {
  justify-self: left;
  left: 0;
  position: absolute;
  align-items: center;
  display: flex;
  margin-left: 10px;
}

.dialog-content {
  display: flex;
  flex-direction: column;
  padding: 1rem;
  font-size: 1.2em;
  line-height: 1.6;
}

</style>
