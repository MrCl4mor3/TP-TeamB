
<template>
  <div>
    <h1>Sortieralgorithmen</h1>
    <ButtonPress label="Start" @click="goToSortingPage" />
  </div>

  <div>
    <h2>Anzahl Karten</h2>
    <InputNumber v-model="numberOfCards" inputId="AnzahlKarten" showButtons :min="4" :max="20" />
  </div>



</template>

<script>
import { store } from '../store';
export default {
  data() {
    return {
      cards: [],
    };
  },
  methods: {
    // Methode um zur Sortierseite zu navigieren, dabei wird die Anzahl der Karten im Store gespeichert
    // und die Karten werden in einem Array gespeiert und gemischt.
    goToSortingPage() {
      store.numberOfCards = this.numberOfCards;
      const cards = Array.from({ length: this.numberOfCards }, (_, index) => ({
        id: index,        //Identifikator der Karte
        value: `Karte ${index + 1}`,  //Wert der Karte hier müsste man dann das Bild einfügen
      }));
      //die Karten werden gemischt und sowohl die korrekte als auch die start Reihenfolge wird gespeichert
        store.correctCards = cards.slice();
        store.cards = cards
        store.cards = store.cards.sort(() => Math.random() - 0.5);
        store.startingCards = cards.slice();
      this.$router.push("/sortingPage");
    },
  },
};
</script>

<style scoped>
/*Styling für die Überschrift*/
h1 {
  font-size: 80px;
  text-align: center;
}

</style>
