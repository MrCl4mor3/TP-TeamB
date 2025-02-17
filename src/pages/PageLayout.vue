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
    :modal = "true"
    @update:visible="prepareReset">
    <div class="dialog-content">
      <p>Du hast {{ store.score }} Karten angeschaut und {{ store.numberOfSwaps }} Karten vertauscht.</p>
      <p>Ein Computer würde mit den folgenden Algorithmen so viele Operationen benötigen:</p>
      <table class="finish-page-table">
        <thead>
        <tr>
          <th>Sortieralgorithmus</th>
          <th>Karten angeschaut</th>
          <th>Karten vertauscht</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="algorithm in algorithms" :key="algorithm.name">
          <td>{{ algorithm.name }}</td>
          <td>{{ algorithm.result?.scoreLook ?? '-' }}</td>
          <td>{{ algorithm.result?.scoreSwap ?? '-' }}</td>
        </tr>
        </tbody>
      </table>
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
      <h3>Angeschaut: {{ store.score }}, Vertauscht: {{store.numberOfSwaps}}</h3>

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

      if (store.selectedCards.length !== 2) {
        this.toast.add({
          severity: 'error',
          summary: 'Fehler',
          detail: messages['selectTwoCards'],
          life: 3000,
        })
        return
      }


      let canSort = true
      let finished = false

      if (
        store.selectedMode === 'Vorgegebenes Sortieren' &&
        store.selectedCategory !== 'Merge Sort'
      ) {
        if (store.selectedCategory === 'Bubble Sort') {
          if (store.numberOfSwaps < store.correctSortingOrderBubble.length) {
            canSort = !!(
              store.correctSortingOrderBubble[store.numberOfSwaps].includes(store.selectedCards[0]) &&
              store.correctSortingOrderBubble[store.numberOfSwaps].includes(store.selectedCards[1])
            )
          } else {
            canSort = false;
            finished = true;
          }
        } else if (store.selectedCategory === 'Selection Sort') {
          if (store.numberOfSwaps < store.correctSortingOrderSelect.length) {
            canSort = !!(
              store.correctSortingOrderSelect[store.numberOfSwaps].includes(store.selectedCards[0]) &&
              store.correctSortingOrderSelect[store.numberOfSwaps].includes(store.selectedCards[1])
            )
          } else {
            canSort = false;
            finished = true;
          }
        } else if (store.selectedCategory === 'Insertion Sort') {
          if (store.numberOfSwaps < store.correctSortingOrderInsert.length) {
            canSort = !!(
              store.correctSortingOrderInsert[store.numberOfSwaps].includes(store.selectedCards[0]) &&
              store.correctSortingOrderInsert[store.numberOfSwaps].includes(store.selectedCards[1])
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
        store.numberOfSwaps++

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
      console.log("asd")
      setTimeout(() => {
        console.log(store.selectedCategory)
        if (store.selectedCategory === 'Quick Sort') {
          store.quickReshuffle = true;
          console.log("asd " + store.quickReshuffle)
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
      this.algorithms = [
        { name: 'Bubble Sort', result: bubbleSortWithScore(this.store.startingCards) },
        { name: 'Selection Sort', result: selectionSortWithScore(this.store.startingCards) },
        { name: 'Insertion Sort', result: insertionSortWithScore(this.store.startingCards) },
        { name: 'Quick Sort', result: quickSortWithScore(this.store.startingCards) },
        { name: 'Merge Sort', result: mergeSortWithScore(this.store.startingCards) }
      ];
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
      store.numberOfSwaps = 0;
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
.finish-page-table {
  width: 100%;
  border-collapse: collapse;
  text-align: center;
  border: 1px solid #ddd;
  font-family: 'Arial', sans-serif;
}
.finish-page-table td {
  border: 1px solid #ddd;
  padding: 8px;
}

</style>
