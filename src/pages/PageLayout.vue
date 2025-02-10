<script setup>
import { ref } from 'vue'
import Dialog from 'primevue/dialog'
import Toast from 'primevue/toast'

const noAlgorithmNeeded = ref(store.selectedMode === 'Freies Sortieren')
</script>

<template>
  <header>
    <ButtonPress icon="pi pi-home" aria-label="Save" @click="goToHomePage" />
    <h2>
      <span v-if="noAlgorithmNeeded">{{ store.selectedMode }}</span>
      <span v-else>{{ store.selectedCategory }}</span>
    </h2>
    <div class="button-container">
      <ButtonPress label="?" @click="openTutorial"></ButtonPress>
      <ButtonPress icon="pi pi-refresh" @click="shuffel"></ButtonPress>
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
    :header="'Bravo - Die Karten sind richtig sortiert!'"
    class="dialog"
    @update:visible="prepareReset"
    v-if="isScoreCalculated"
  >
  <div class="dialog-content">
    <div>
      <p>Score: {{ store.score }}</p>
      <p v-if="bubbleSortResult">BubbleSort: {{ bubbleSortResult.score }}</p>
      <p v-if="selectionSortResult">SelectionSort: {{ selectionSortResult.score }}</p>
      <p v-if="insertionSortResult">InsertionSort: {{ insertionSortResult.score }}</p>
      <p v-if="quickSortResult">QuickSort: {{ quickSortResult.score }}</p>
      <p v-if="mergeSortResult">MergeSort: {{ mergeSortResult.score }}</p>
    </div>
    <div class="button-container">
      <ButtonPress icon="pi pi-home" @click="goToHomePage" />
      <ButtonPress label="Neustart" @click="startOver" />
      <ButtonPress label="Neu mischen" @click="shuffel" />
    </div>
  </div>
  </Dialog>


  <Toast :position="'top-right'"/>


  <div class="content">
    <!-- hier werden die Karten in den einzelnen Seiten hinzugefügt -->
    <slot name="cards" :select-cards="SelectCard" :select-cards2="SelectCardQuick" />
  </div>

  <footer>
    <!--Einfügen des Scores -->
    <div class="score">
      <h3>Score: {{ store.score }}</h3>
    </div>
    <!-- hier werden die zusätzlichen Knöpfe hinzugefügt -->
    <div class="button-container">
      <slot name="extraButtons" :swap-cards="SwapCards" />
      <ButtonPress label="fertig sortiert" @click="checkIfCorrect" />
    </div>
  </footer>
</template>

<script>
import { useToast } from 'primevue/usetoast'
import algorithmDescription from '@/descriptions/algorithmDescriptions.json'
import messages from '@/descriptions/messages.json'
import { store, resetStartValues } from '@/store.js'
import {
  bubbleSortWithScore,
  insertionSortWithScore,
  mergeSortWithScore,
  quickSortWithScore,
  selectionSortWithScore,
} from '@/algorithms.js'
import { nextTick} from "vue";

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
      isScoreCalculated: false,
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
      let finished = false

      if (
        store.selectedMode === 'Vorgegebenes Sortieren' &&
        store.selectedCategory !== 'Merge Sort'
      ) {
        if (store.selectedCategory === 'Bubble Sort') {
          if (this.numberOfSwaps < store.correctSortingOrderBubble.length) {
            canSort = !!(
              store.correctSortingOrderBubble[this.numberOfSwaps].includes(store.selectedCards[0]) &&
              store.correctSortingOrderBubble[this.numberOfSwaps].includes(store.selectedCards[1])
            )
          } else {
            canSort = false;
            finished = true;
          }
        } else if (store.selectedCategory === 'Selection Sort') {
          if (this.numberOfSwaps < store.correctSortingOrderSelect.length) {
            canSort = !!(
              store.correctSortingOrderSelect[this.numberOfSwaps].includes(store.selectedCards[0]) &&
              store.correctSortingOrderSelect[this.numberOfSwaps].includes(store.selectedCards[1])
            )
          } else {
            canSort = false;
            finished = true;
          }
        } else if (store.selectedCategory === 'Insertion Sort') {
          if (this.numberOfSwaps < store.correctSortingOrderInsert.length) {
            canSort = !!(
              store.correctSortingOrderInsert[this.numberOfSwaps].includes(store.selectedCards[0]) &&
              store.correctSortingOrderInsert[this.numberOfSwaps].includes(store.selectedCards[1])
            )
          } else {
            canSort = false;
            finished = true;
          }

        }
      }
      if (store.selectedCards.length === 2 && canSort) {
        const [firstIndex, secondIndex] = store.selectedCards
        const temp = store.cards[firstIndex]
        store.cards[firstIndex] = store.cards[secondIndex]
        store.cards[secondIndex] = temp
        this.numberOfSwaps++

        setTimeout(() => {
          store.currentCards.forEach((card) => {
            card.closeCard()
            store.selectedCards.splice(0);
            store.numberOfFlippedCards = 0;
          })},300)

      } else {
        if (finished) {
          this.toast.add({ severity: 'success', summary: messages['vorgegebenerSuccess'], life: 3000 })
        }else {
          this.toast.add({
            severity: 'error',
            summary: 'Fehler',
            detail: messages['wrongAlgorithmStep'],
            life: 3000,
          })
        }
      }
    },

    SelectCard(index) {
      if (store.selectedCards.includes(index)) {
        if (store.selectedCards.length === 2) {
          setTimeout(() => {
            store.currentCards.forEach((card) => {
              card.closeCard()
              store.selectedCards.splice(0);
              store.numberOfFlippedCards = 0;
            })},100)
        } else {
          store.selectedCards = store.selectedCards.filter((card) => card !== index)
        }
      } else if (store.selectedCards.length < 2) {
        store.selectedCards.push(index)
        store.score++
      }
    },

    startOver() {
      this.prepareReset()

      setTimeout(() => {
        store.cards = store.startingCards.slice()
        store.containers.splice(0);
        store.containers.push(store.startingCards);
        this.visibleEndScreen = false;
        this.visibleEndScreen = false
        this.toast.add({ severity: 'success', summary: messages["restartGame"], life: 3000 })
      }, 400)
    },

    shuffel() {
      this.prepareReset()

      setTimeout(() => {
        if (store.selectedCategory === 'Quick Sort') {
          store.quickReshuffle = true;
          store.cards = store.startingCards.slice();
        } else {
          store.cards = store.cards.sort(() => Math.random() - 0.5)
          store.startingCards = store.cards.slice()
        }

        this.calculateScore();
        this.visibleEndScreen = false
        this.toast.add({ severity: 'success', summary: messages["shuffleCards"], life: 3000 })
      }, 450)
    },

    checkIfCorrect() {
      if (
        store.cards.every((card, index) => card.id === store.correctCards[index].id) ||
        store.containers[0].every((card, index) => card.id === store.correctCards[index].id)
      ) {
        this.calculateScore()
        this.openAllCards()
        nextTick(() => {
          this.visibleEndScreen = true
        })
      } else {
        this.toast.add({
          severity: 'error',
          summary: 'Fehler',
          detail: messages['wrongOrder'],
          life: 3000,
        })
      }
    },

    calculateScore() {
      this.isScoreCalculated = false

      this.bubbleSortResult = bubbleSortWithScore(store.startingCards)
      this.selectionSortResult = selectionSortWithScore(store.startingCards)
      this.insertionSortResult = insertionSortWithScore(store.startingCards)
      this.quickSortResult = quickSortWithScore(store.startingCards)
      this.mergeSortResult = mergeSortWithScore(store.startingCards)

      this.isScoreCalculated = true
    },

    //Alle Karten werden aufgedeckt
    openAllCards() {
      store.currentCards.forEach((card) => {
        card.openCard()
      })
    },
    //Alle Karten werden zugedeckt
    prepareReset() {
      store.currentCards.forEach((card) => {
        card.closeCard()
        card.colour = '#10b981'
      })
      this.numberOfSwaps = 0;
      this.selectedCards.splice(0);
      store.reloadPage = true
      store.dividingLinePosition = -1
      store.dividingContainerPosition = -1
      store.containers.splice(0)
      store.containers.push(store.startingCards)
      resetStartValues()
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
  line-height: 1.6;
}

</style>
