<script setup>
store.numberOfFlippedCards= 0;
store.score = 0;
store.cards = store.startingCards.slice();
</script>
<template>
  <ButtonPress icon="pi pi-home" aria-label="Save" @click="goToHomePage"/>
  <FieldSet :legend="`${store.selectedCategory} , ${store.selectedMode}`" :toggleable="true" :collapsed="true">
    <template #toggleicon>
      <span>{{isExpanded ? "?" : "❓"}}</span>
    </template>
    <p class="m-0" style="white-space: pre-wrap;">
      {{this.descriptionToAlgorithm[store.selectedCategory]}}
    </p>
  </FieldSet>

  <div>
    <p>Score: {{ store.score }}</p>
  </div>
  <div class="card-grid">
    <!-- Hier wird für jede Karte ein FlippedCard erstellt -->
    <div v-for="(card, index) in store.cards" :key="card.id">
      <FlippedCard @click="SelectCard(index)">
        <template #front>
          <h1></h1>
        </template>
        <template #back>
          <img :src="`./images/${card.id}.png`"/>
        </template>
      </FlippedCard>
    </div>
  </div>
  <!-- Hier werden die Buttons für die Funktionen des Spiels erstellt -->
  <div class="button-container">
    <ButtonPress label="Vertausch" @click="SwapCards" />
    <ButtonPress label="Starte neu" @click="startOver" />
    <ButtonPress label="misch erneut" @click="shuffel" />
    <ButtonPress label="Beende Spiel" @click="checkIfCorrect" />
  </div>
</template>

<script>
import FlippedCard from '@/components/FlippedCard.vue'
import { store } from '../store'
import 'primeicons/primeicons.css';
import bubbleSortDescription from '../descriptions/algorithmDescriptions.json'
import errorMessages from '../descriptions/ErrorMessages.json'
export default {
  data() {
    return {
      selectedCards: [],
      descriptionToAlgorithm: {
        'Bubble Sort': bubbleSortDescription['Bubble Sort'],
        'Selection Sort': bubbleSortDescription['Selection Sort'],
        'Insertion Sort': bubbleSortDescription['Insertion Sort'],
        'Merge Sort': bubbleSortDescription['Merge Sort'],
        'Quick Sort': bubbleSortDescription['Quick Sort'],
      }
    }
  },
  components: {
    FlippedCard,
  },
  setup() {
    return { store }
  },
  methods: {
    // Tausche die Positionen der beiden Karten im Store wenn zwei Karten ausgewählt wurden
    SwapCards() {
      if (this.selectedCards.length === 2) {
        const [firstIndex, secondIndex] = this.selectedCards
        const temp = store.cards[firstIndex]
        store.cards[firstIndex] = store.cards[secondIndex]
        store.cards[secondIndex] = temp
      } else {
        alert(errorMessages['selectTwoCards'])
      }
    },
    // Methode um die Karte auszuwählen, heirbei wird die Karte aus dem Array der ausgewählten
    // Karten entfernt wenn sie schon ausgewählt wurde, ansonsten wird sie hinzugefügt
    SelectCard(index) {
      if (this.selectedCards.includes(index)) {
        this.selectedCards = this.selectedCards.filter((card) => card !== index)
      } else if (this.selectedCards.length < 2) {
        this.selectedCards.push(index)
        store.score++
      }
    },
    startOver() {
      if (this.selectedCards.length === 0) {
        store.cards = store.startingCards.slice()
        store.score = 0;
      } else {
        alert(errorMessages['restartError'])
      }
    },
    shuffel() {
      if (this.selectedCards.length === 0) {
        store.cards = store.cards.sort(() => Math.random() - 0.5)
        store.startingCards = store.cards.slice()
        store.score = 0;
      } else {
        alert(errorMessages['shuffleError'])
      }
    },
    //Kontrolliert ob die Karten grade gleich angeordent sind wie die korrekten Karten
    checkIfCorrect() {
      if (store.cards.every((card, index) => card.id === store.correctCards[index].id)) {
        this.$router.push('/finishPage')
      } else {
        alert(errorMessages['wrongOrder'])
      }
    },
    goToHomePage() {
      this.$router.push('/')
      this.selectedCards = [];
    },
  },
}
</script>

<style>
/*Hier wird definiert wie die Karten angeordnet werden sollen*/
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  justify-items: center;
  font-family: Arial, sans-serif;
}
</style>

<style scoped>
/*Styling für die Buttons*/
.button-container {
  display: flex;
  justify-content: center;
  gap: 10px;
  font-family: Arial, sans-serif;
  margin-top: 20px;

}
</style>
