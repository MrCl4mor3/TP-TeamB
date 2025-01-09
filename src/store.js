import { reactive } from 'vue'

// Funktion, die den initialen Zustand zurückgibt
function getDefaultStore() {
  return {
    numberOfCards: 0,
    numberOfFlippedCards: 0,
    cards: [],
    startingCards: [],
    correctCards: [],
    score: 0,
    selectedCategory: null,
    selectedMode: null,
    correctSortingOrder: [],

  }
}

// Den Store mit dem initialen Zustand initialisieren
export const store = reactive(getDefaultStore())

export function resetStore() {
  Object.assign(store, getDefaultStore())
}
