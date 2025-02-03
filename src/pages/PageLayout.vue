<script setup>
import { ref } from 'vue'
import Dialog from 'primevue/dialog'
import { useToast } from "primevue/usetoast";
import Toast from "primevue/toast";

const toast = useToast();

const showToast = () => {
  console.log('Toast wurde angezeigt');
  toast.add({ severity: 'success', summary: 'Erfolg', detail: 'Toast wurde angezeigt', life: 3000 });
}

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
      <ButtonPress icon="pi pi-refresh" @click="showToast(); shuffel()"></ButtonPress>
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

  <Toast/>

  <div>
    <!-- hier werden die Karten in den einzelnen Seiten hinzugefügt -->
    <slot name="cards"
          :select-cards="SelectCard"
          :select-cards2="SelectCardQuick"/>
  </div>

  <footer>
    <!--Einfügen des Scores -->
    <div class="score">
      <h2>Score: {{ store.score }}</h2>
    </div>
    <!-- hier werden die zusätzlichen Knöpfe hinzugefügt -->
    <div class="button-container">
      <slot name="extraButtons" :swap-cards="SwapCards" />
      <ButtonPress label="fertig sortiert" @click="checkIfCorrect" />
    </div>
  </footer>
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
      visibleTutorial: false,
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
        alert(errorMessages['wrongAlgorithmStep'])
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
      if (store.cards.every((card, index) => card.id === store.correctCards[index].id)
        || store.containers[0].every((card, index) => card.id === store.correctCards[index].id)) {
        this.$router.push('/finishPage')
      } else {
        alert(errorMessages['wrongOrder'])
      }
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
  padding: 1rem;
  font-size: 1.2em;
  line-height: 1.6;
}

header {
  justify-content: space-between;
}
</style>
