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
    class="dialog">
    <div class="dialog-content">
      <div>
        <p>Score: {{ store.score }}</p>
        <p>BubbleSort: {{ bubbleSortResult }}</p>
        <p>SelectionSort: {{ selectionSortResult }}</p>
        <p>InsertionSort: {{ insertionSortResult }}</p>
        <p>QuickSort: {{ quickSortResult }}</p>
        <p>MergeSort: {{ mergeSortResult }}</p>
      </div>
      <div class="button-container">
        <ButtonPress icon="pi pi-home" @click="goToHomePage" />
        <ButtonPress label="Neustart" @click="startOver" />
        <ButtonPress label="Neu mischen" @click="shuffel" />
      </div>
    </div>
  </Dialog>

  <Toast />

  <div>
    <!-- hier werden die Karten in den einzelnen Seiten hinzugefügt -->
    <slot name="cards" :select-cards="SelectCard" :select-cards2="SelectCardQuick" />
  </div>

  <footer>
    <!--Einfügen des Scores -->
    <div class="score">
      <h2>Score: {{ store.score }}</h2>
    </div>
    <!-- hier werden die zusätzlichen Knöpfe hinzugefügt -->
    <div class="button-container">
      <ButtonPress label="auf" @click="openAllCards" />
      <ButtonPress label="zu" @click="closeAllCards" />
      <slot name="extraButtons" :swap-cards="SwapCards" />
      <ButtonPress label="fertig sortiert" @click="checkIfCorrect" />
    </div>
  </footer>
</template>

<script>
import { useToast} from "primevue/usetoast"
import algorithmDescription from '@/descriptions/algorithmDescriptions.json'
import errorMessages from '@/descriptions/ErrorMessages.json'
import { store } from '@/store.js'
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

      bubbleSortResult: bubbleSortWithScore(store.startingCards),
      selectionSortResult: selectionSortWithScore(store.startingCards),
      insertionSortResult: insertionSortWithScore(store.startingCards),
      quickSortResult: quickSortWithScore(store.startingCards),
      mergeSortResult: mergeSortWithScore(store.startingCards),
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

    //für Quicksort, es werden Pivotelement erkannt und anders behandelt
    SelectCardQuick(index) {
      if (store.pivotIndices.includes(index) || store.pivotElementIndex === index) {
        alert("pivotelement");
        document.getElementsByClassName('card-container')[index].__vueParentComponent.ctx.toggleFlip();
      } else {
        if (store.selectedCards.includes(index)) {
          store.selectedCards = store.selectedCards.filter((card) => card !== index);
        } else if (store.selectedCards.length < 2) {
          if (index === store.lookingIndex) {
            store.selectedCards.push(index);
            store.score++;
          } else {
            alert("Flasche Karte");
            document.getElementsByClassName('card-container')[index].__vueParentComponent.ctx.toggleFlip();
          }
        }
      }
    },

    startOver() {
      this.closeAllCards()
      store.cards = store.startingCards.slice()
      store.score = 0
      this.visibleEndScreen = false;
      this.toast.add({ severity: 'success', summary: 'Spiel wurde zurückgesetzt', life: 3000 })
    },

    shuffel() {
      this.closeAllCards()

      store.cards = store.cards.sort(() => Math.random() - 0.5)
      store.startingCards = store.cards.slice()
      store.score = 0

      this.visibleEndScreen = false;
      this.toast.add({ severity: 'success', summary: 'Karten wurden gemischt', life: 3000 })
    },

    checkIfCorrect() {
      if (store.cards.every((card, index) => card.id === store.correctCards[index].id)
        || store.containers[0].every((card, index) => card.id === store.correctCards[index].id)) {
        this.visibleEndScreen = true
      } else {
        this.toast.add({ severity: 'error', summary: 'Fehler', detail: 'Die Karten sind noch nicht korrekt sortiert', life: 3000 })
      }
    },

    //Alle Karten werden aufgedeckt
    openAllCards() {
      store.cards.forEach((card, index) => {
          document.getElementsByClassName('card-container')[index].__vueParentComponent.ctx.openCard()
      })
    },
    //Alle Karten werden zugedeckt
    closeAllCards() {
      store.cards.forEach((card, index) => {
          document.getElementsByClassName('card-container')[index].__vueParentComponent.ctx.closeCard()
      })
      store.numberOfFlippedCards = 0
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

header {
  justify-content: space-between;
}
</style>
