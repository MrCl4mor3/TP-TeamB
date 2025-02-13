import { reactive } from 'vue'

// Funktion, die den initialen Zustand zurückgibt
function getDefaultStore() {
  return {
    numberOfCards: 0,
    numberOfFlippedCards: 0,
    numberOfSwaps:0,
    cards: [],
    startingCards: [],
    correctCards: [],
    score: 0,
    selectedCategory: null,
    selectedMode: null,
    correctSortingOrderBubble: [],
    correctSortingOrderInsert: [],
    correctSortingOrderSelect: [],
    selectedCards: [],
    pivotIndices: [],
    lookingIndex: -1,
    pivotElementIndex: -1,
    selectedLines: 0,
    containers: [],
    currentSelectedContainer: -1,
    dividingContainerPosition: -1,
    dividingLinePosition: -1,
    currentCards: [],
    reloadPage: false,
    quickReshuffle: false,
    swapedScore: 0,
    lookedScore: 0,
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
