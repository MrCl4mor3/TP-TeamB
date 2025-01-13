import { store } from './store'

export function generateCards(selectedCategory, selectedMode, numberOfCards) {
  store.selectedMode = selectedMode
  store.selectedCategory = selectedCategory
  store.numberOfCards = numberOfCards

  const cards = Array.from({ length: numberOfCards }, (_, index) => ({
    id: index, //Identifikator der Karte
    value: `Karte ${index + 1}`, //Wert der Karte hier müsste man dann das Bild einfügen
  }))

  //die Karten werden gemischt und sowohl die korrekte als auch die start Reihenfolge wird gespeichert
  store.correctCards = cards.slice()
  store.cards = cards
  store.cards = store.cards.sort(() => Math.random() - 0.5)
  store.startingCards = cards.slice()
}


import { ref } from 'vue'
import cardSVG from './assets/card.svg'

export function svgLoader() {
  const svgContent = ref('')

  const loadSvg = async () => {
    try {
      const response = await fetch(cardSVG)
      if (!response.ok) {
        throw new Error('SVG konnte nicht geladen werden')
      }
      const svgText = await response.text()
      svgContent.value = svgText
    } catch (error) {
      console.error('Fehler beim Laden der SVG:', error)
    }
  }

  return {
    svgContent,
    loadSvg
  }
}



