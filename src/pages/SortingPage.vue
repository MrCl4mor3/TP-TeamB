<script setup>
store.numberOfFlippedCards= 0;
store.score = 0;
store.cards = store.startingCards.slice();
</script>
<template>
  <ButtonPress icon="pi pi-home" aria-label="Save" @click="goToHomePage"/>
   <!--<p>bubblesort {{bubbleSortResult}}</p> -->
  <FieldSet :legend="`${store.selectedCategory} mit ${store.selectedMode}`" :toggleable="true" :collapsed="true">
    <template #toggleicon>
      <span>{{isExpanded ? "?" : "❓"}}</span>
    </template>
    <p class="m-0">
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
          <img :src="`/images/${card.id}.png`"/>
        </template>
      </FlippedCard>
    </div>
  </div>
  <!-- Hier werden die Buttons für die Funktionen des Spiels erstellt -->
  <div>
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
export default {
  data() {
    return {
      selectedCards: [],
      descriptionToAlgorithm: {
        'Bubble Sort':
          '1. Vergleiche die zwei benachbarte Elemente und tausche sie, wenn das linke Element kleiner ist las das Rechte.' +
          ' Angefangen wird mit den ersten beiden Elementen. ' +
          '2. Wiederhole Schritt 1 mit dem zweiten und dritten Element. Dies wird solange wiederholt, bis man beim ' +
          'letzten Element angekommen ist, d.h. das größte Element befindet sich nun ganz am Ende. ' +
          '3. Wiederhole Schritt 1 und 2 solange, bis keine Elemente mehr getauscht werden müssen.',
        'Insertion Sort':
          '1. Wähle das erste Element als sortiertes Element aus. ' +
          '2. Wähle das nächste Element aus und füge es an der richtigen Stelle in das sortierte Element ein, d.h. vergleiche' +
          ' es mit den schon sortierten Elementen und füge es passend ein. ' +
          '3. Wiederhole Schritt 2 für alle Elemente.',
        'Selection Sort':
          '1. Wähle das kleinste Element aus und tausche es mit dem ersten Element. ' +
          '2. Wähle das zweitkleinste Element aus und tausche es mit dem zweiten Element. ' +
          '3. Wiederhole Schritt 2 für alle Elemente.',
        'Quick Sort':
          '1. Wähle das letzte Element als Pivot-Element aus. ' +
          '2. Teile die Liste in zwei Teile (linke & rechte Teilliste), sodass alle Elemente kleiner als das Pivot-Element ' +
          'in der Linken und alle Elemente größer in der Rechten stehen. ' +
          '3. Wiederhole Schritt 2 für die beiden Teillisten solange, bis die neu erzeugten Teillisten nur noch ein Element enthalten.',
        'Merge Sort':
          '1. Teile die Liste in zwei Teile. Diese Teilung wird solange fortgesetzt, bis jede Teilung nur noch ein' +
          ' Element enthält. ' +
          '2. Sortiere die Teillisten alle für sich. ' +
          '3. Füge die sortierten Teillisten wieder zusammen.',
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
        alert('Wähle genau zwei Karten zum Tauschen aus.')
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
        alert('du darfst keine Karten ausgewählt haben wenn du mischst')
      }
    },
    shuffel() {
      if (this.selectedCards.length === 0) {
        store.cards = store.cards.sort(() => Math.random() - 0.5)
        store.startingCards = store.cards.slice()
        store.score = 0;
      } else {
        alert('du darfst keine Karten ausgewählt haben wenn du mischst')
      }
    },
    //Kontrolliert ob die Karten grade gleich angeordent sind wie die korrekten Karten
    checkIfCorrect() {
      if (store.cards.every((card, index) => card.id === store.correctCards[index].id)) {
        this.$router.push('/finishPage')
      } else {
        alert('Falsch sortiert!')
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
}
</style>
