<template>

  <header>
    <ButtonPress icon="pi pi-home" aria-label="Save" @click="goToHomePage" />
    <h1>{{store.selectedCategory}} , {{store.selectedMode}}</h1>
    <div class="button-container-meta">
      <ButtonPress label="?"></ButtonPress>
      <SplitButton icon="pi pi-refresh" :model="refreshButton"/>
    </div>
  </header>

  <div>
    <FieldSet
      :legend="`${store.selectedCategory} , ${store.selectedMode}`"
      :toggleable="true"
      :co llapsed="true"
    >
      <template #toggleicon>
        <span>{{ isExpanded ? '?' : '❓' }}</span>
      </template>
      <p class="m-0" style="white-space: pre-wrap">
        {{ descriptionToAlgorithm[store.selectedCategory] }}
      </p>
    </FieldSet>

    <!-- hier werden die Karten in den einzelnen Seiten hinzugefügt -->
    <slot name="cards" :select-cards="SelectCard" :number-of-swaps="this.numberOfSwaps" />
  </div>

  <div class="footer">
    <!--Einfügen des Scores -->
    <div class="score">
      <h2>Score: {{ store.score }}</h2>
    </div>
    <!-- hier werden die zusätzlichen Knöpfe hinzugefügt -->
    <div class="button-container">
      <slot name="extraButtons" :swap-cards="SwapCards" />
      <ButtonPress label="Beende Spiel" @click="checkIfCorrect" />
    </div>
  </div>
</template>

<script>
import algorithmDescription from '@/descriptions/algorithmDescriptions.json'
import errorMessages from '@/descriptions/ErrorMessages.json'
import { store } from '@/store.js'

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
      refreshButton: [
        {
          label: 'Mische neu',
          command: () => this.shuffel(),
        },
        {
          label: 'Starte neu',
          command: () => this.startOver(),
        },
      ],
      numberOfSwaps: 0,
      selectedCards: [],
      descriptionToAlgorithm: {
        'Bubble Sort': algorithmDescription['Bubble Sort'],
        'Selection Sort': algorithmDescription['Selection Sort'],
        'Insertion Sort': algorithmDescription['Insertion Sort'],
        'Merge Sort': algorithmDescription['Merge Sort'],
        'Quick Sort': algorithmDescription['Quick Sort'],
      },
    }
  },
  methods: {
    SwapCards() {
      let canSort = true

      if (store.selectedMode === 'Vorgegebenes Sortieren') {
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
        alert(errorMessages['wrongAlgorithmStep'])
      }
    },
    SelectCard(index) {
      if (store.selectedCards.includes(index)) {
        store.selectedCards = store.selectedCards.filter((card) => card !== index)
      } else if (store.selectedCards.length < 2) {
        store.selectedCards.push(index)
        store.score++
      }
    },
    startOver() {
      if (store.selectedCards.length === 0) {
        store.cards = store.startingCards.slice()
        store.score = 0
      } else {
        alert(errorMessages['restartError'])
      }
    },
    shuffel() {
      if (store.selectedCards.length === 0) {
        store.cards = store.cards.sort(() => Math.random() - 0.5)
        store.startingCards = store.cards.slice()
        store.score = 0
      } else {
        alert(errorMessages['shuffleError'])
      }
    },
    checkIfCorrect() {
      if (store.cards.every((card, index) => card.id === store.correctCards[index].id)) {
        this.$router.push('/finishPage')
      } else {
        alert(errorMessages['wrongOrder'])
      }
    },
    goToHomePage() {
      this.$router.push('/')
      store.selectedCards = []
    },
  },
}
</script>

<style scoped>
.button-container {
  display: flex;
  gap: 10px;
  text-align: center;
  font-family: Arial, sans-serif;
}

.button-container-meta {
  display: flex;
  gap: 10px;
  font-family: Arial, sans-serif;
}

header {
  padding: 25px 10px;
  position: sticky;
  top: 0;
  background-color: lightgray;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.7);
  z-index: 1000;
}

.footer {
  display: flex;
  bottom: 0;
  position: sticky;
  z-index: 1000;
  background-color: lightgray;
  padding: 25px 10px;
  box-shadow: 0 -4px 6px rgba(0, 0, 0, 0.7);
  margin-top: 20px;
  justify-content: center;
}

.score {
  justify-self: left;
  left: 0;
  position: absolute;
}


h1 {
  margin: 0;
  font-family: Arial, sans-serif;
}
h2 {
  font-family: Arial, sans-serif;
}
</style>
