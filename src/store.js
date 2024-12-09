import {reactive} from "vue";

// Alle globalen Variablen werden gespeichert
export const store = reactive({
  numberOfCards: 0,
  numberOfFlippedCards: 0,
  cards: [],
  startingCards: [],
  correctCards: [],
  score: 0,
  selectedCategory: null,
  selectedMode: null,
});
