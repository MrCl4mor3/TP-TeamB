import { store } from './store'
import cardSvg from '@/assets/card2.svg'


import {
  bubbleSortWithScore,
  insertionSortWithScore,
  mergeSortWithScore, quickSortWithScore,
  selectionSortWithScore
} from '@/algorithms.js'

const algorithmMap = {
  'Bubble Sort': bubbleSortWithScore,
  'Selection Sort': selectionSortWithScore,
  'Insertion Sort': insertionSortWithScore,
  'Merge Sort': mergeSortWithScore,
  'Quick Sort': quickSortWithScore,
}



export function generateCards(selectedCategory, selectedMode, numberOfCards) {
  store.selectedMode = selectedMode
  store.selectedCategory = selectedCategory
  store.numberOfCards = numberOfCards

  //lade zunächst die svg Datei
  fetch(cardSvg)
    .then((response) => response.text())
    .then((svgContent) => {
      //Parse die SVG Datei und speichere sie in einer Variable
      const parser = new DOMParser()
      const svgDocument = parser.parseFromString(svgContent, 'image/svg+xml')
      let svgTemplate = svgDocument.documentElement

      //Min und Max Werte für die Zufallszahlen
      const min = 1
      const max = 20
      let cards = []
      //Karte 0 ist die Vorlage
      cards[store.numberOfCards - 1] = { id: store.numberOfCards - 1, svg: svgTemplate.cloneNode(true) };
      cards[store.numberOfCards - 1] = {
        id: store.numberOfCards - 1,
        svg: svgTemplate.cloneNode(true),
      }

      //Entfernen einzelner Komponenten
      for (let i = store.numberOfCards - 2; i >= 0; i--) {
        //Kopiere das Bild zuvor
        let oldCard = cards[i + 1]
        //Kopiere daraus das svg Element
        let oldSvg = oldCard.svg.cloneNode(true)
        //Update die ID in "card + i", zb card1.
        let newSvg = updateSvgID(oldSvg, 'card' + i)
        //Entferne nun ein Path mit einer zufälligen Nummer, die id ist in der Form "card1-3" für den 3. Pfad
        newSvg = removePart(`${'card' + i}-${getRandomInt(min, max)}`, newSvg)
        //Speicher das neue bild in cards ab
        cards[i] = { id: i, svg: newSvg }
      }
      //Speicher die Karten im Store ab
      store.correctCards = cards.slice()
      store.cards = cards.slice()
      while (arraysAreEqual(store.cards, store.correctCards)) {
        store.cards = store.cards.sort(() => Math.random() - 0.5)
      }
      store.startingCards = store.cards.slice()
      algorithmMap[store.selectedCategory](store.startingCards)
    })
    .catch((error) => {
      console.error('Error:', error)
    })
}

function removePart(id, svgContent) {
  const element = svgContent.querySelector(`#${id}`)
  console.log("id " + element)
  if (!element) {
    return svgContent
  }
  element.parentNode.removeChild(element)
  return svgContent
}


function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function updateSvgID(svgContent, newId) {
  if (svgContent.hasAttribute('id')) {
    svgContent.removeAttribute('id')
  }
  svgContent.setAttribute('id', newId)

  // Alle Elemente mit einer ID im SVG finden
  const allElements = svgContent.querySelectorAll('[id]')

  allElements.forEach((element, index) => {
    // Setze eine neue ID für jedes Element
    let newElementId = `${newId}-${index + 1}`

    // Falls das Element eine ID hat, wird sie ersetzt
    element.setAttribute('id', newElementId)
  })

  return svgContent
}

function arraysAreEqual(arr1, arr2) {
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      return false
    }
  }
  return true
}
