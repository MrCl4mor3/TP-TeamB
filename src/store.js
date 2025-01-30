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
    selectedLines: 0,
    containers: [],
  }
}

/*
export const store = reactive({
  lines: [], // Array für die Linien
  setDividingLines() {
    this.lines.forEach(line => {
      if (line.isSelected) {
        line.isDividingLine = true
      }
    })
  }
})


 */

// Den Store mit dem initialen Zustand initialisieren
export const store = reactive(getDefaultStore())

export function resetStore() {
  Object.assign(store, getDefaultStore())
}
