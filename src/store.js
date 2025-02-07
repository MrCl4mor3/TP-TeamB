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
    selectedCards: [],
    pivotIndices: [],
    lookingIndex: 0,
    pivotElementIndex: 0,
    selectedLines: 0,
    containers: [],
    currentSelectedContainer: null,
    dividingContainerPosition: -1,
    dividingLinePosition: -1,
  }
}

// Den Store mit dem initialen Zustand initialisieren
export const store = reactive(getDefaultStore())

export function resetStore() {
  Object.assign(store, getDefaultStore())
}

export function resetStartValues() {
  store.numberOfFlippedCards = getDefaultStore().numberOfFlippedCards
  store.score = getDefaultStore().score
  store.selectedCards = getDefaultStore().selectedCards
}
