import { store } from './store'
import cardSvg from '@/assets/card2.svg'

import {
  bubbleSortWithScore,
  insertionSortWithScore,
  mergeSortWithScore,
  quickSortWithScore,
  selectionSortWithScore,
} from '@/algorithms.js'

const algorithmMap = {
  'Bubble Sort': bubbleSortWithScore,
  'Selection Sort': selectionSortWithScore,
  'Insertion Sort': insertionSortWithScore,
  'Merge Sort': mergeSortWithScore,
  'Quick Sort': quickSortWithScore,
}

/**
 * Generiert die Karten für das Spiel.
 * Die Karten werden aus einer SVG-Datei generiert, indem zufällig Elemente entfernt werden.
 * @param selectedCategory Die ausgewählte Kategorie
 * @param selectedMode Der ausgewählte Modus
 * @param numberOfCards Die Anzahl der Karten, die generiert werden sollen
 */
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

      //Min und Max Werte für die Zufallszahlen der zu entfernenden ids
      const {min, max} = findMinMaxIds(svgTemplate)
      let cards = []
      let removedParts = []

      //Erstelle die Karten und speichere sie in cards ab
      let svg = svgTemplate.cloneNode(true)
      //Update die ID's in "card + i", zb card1.
      let newSvg = updateSvgID(svg, 'card' + (numberOfCards - 1))
      cards[store.numberOfCards - 1] = {
        id: store.numberOfCards,
        svg: newSvg,
      }

      //Entfernen einzelner Komponenten
      for (let i = store.numberOfCards - 2; i >= 0; i--) {
        //Kopiere das Bild zuvor
        let oldCard = cards[i + 1]
        //Kopiere daraus das svg Element
        let oldSvg = oldCard.svg.cloneNode(true)
        //Update die ID's in "card + i", zb card1.
        let newSvg = updateSvgID(oldSvg, 'card' + i)

        //Entferne nun ein Element mit einer zufälligen Nummer, die id ist in der Form "card1-3" für den 3. Pfad
        //Entferne nur Pfade, die noch nicht entfernt wurden
        while (true) {
          let randomID = getRandomInt(min, max)
          if (!removedParts.includes(randomID)) {
            removedParts.push(randomID)
            newSvg = removePart(`card${i}-${randomID}`, newSvg)
            //Speicher das neue bild in cards ab
            cards[i] = { id: i, svg: newSvg }
            break
          }
        }
      }

      // Anzahl an Elemente, die noch möglich sind zu entfernen
      const elementsLeft = max - store.numberOfCards
      // Lösche weitere Elemente
      for (let i = 0; i < elementsLeft; i++) {
        // Wähle zufällig einer der Karten aus, um dort ein zusätzliches Element zu löschen.
        // Bei -1 wird kein Element gelöscht
        const removeIndexCards = getRandomInt(-1, numberOfCards - 1)

        // Wähle zufällig eine ID, die gelöscht werden soll und noch nicht gelöscht wurde
        let randomID
        do {
          randomID = getRandomInt(min, max)
        } while (removedParts.includes(randomID))
        removedParts.push(randomID)

        // Das zu löschende Element muss nun in alle Karten bis zum removeIndex gelöscht werden
        for (let j = 0; j <= removeIndexCards; j++) {
          let oldSvg = cards[j].svg.cloneNode(true)
          let newSvg = removePart(`card${j}-${randomID}`, oldSvg)
          cards[j] = { id: j, svg: newSvg }
        }
      }

      //Speicher die Karten im Store ab
      store.correctCards = cards.slice()
      store.cards = cards.slice()

      //Mische die Karten solange, bis sie nicht mehr gleich sind
      while (arraysAreEqual(store.cards, store.correctCards)) {
        store.cards = store.cards.sort(() => Math.random() - 0.5)
      }

      store.startingCards = store.cards.slice()
      store.containers.push(store.startingCards)

      algorithmMap[store.selectedCategory](store.startingCards)
    })

    .catch((error) => {
      console.error('Error:', error)
    })
}

/**
 * Entfernt ein Element aus dem SVG-Element
 * @param id Die ID des zu entfernenden Elements
 * @param svgContent Das SVG-Element, aus dem das Element entfernt werden soll
 * @returns {Element} Das SVG-Element ohne das entfernte Element
 */
function removePart(id, svgContent) {
  const element = svgContent.querySelector(`#${id}`)
  if (element) {
    element.parentNode.removeChild(element)
  }
  return svgContent
}

/**
 * Gibt eine zufällige Ganzzahl zwischen min und max zurück (inklusive).
 * @param min
 * @param max
 * @returns {number}
 */
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * Ändert die ID des SVG-Elements und aller enthaltenen Elemente.
 * @param {Element} svgContent Das SVG-Element, dessen ID geändert werden soll.
 * @param {string} newId Die neue ID.
 * @returns {Element} Das SVG-Element mit der neuen ID.
 */
function updateSvgID(svgContent, newId) {
  // Entferne die ID des Haupt-SVG-Elements, falls vorhanden
  if (svgContent.hasAttribute('id')) {
    svgContent.removeAttribute('id')
  }
  svgContent.setAttribute('id', newId)

  // Alle Elemente mit einer ID im SVG finden
  const allElements = svgContent.querySelectorAll('[id]')

  allElements.forEach((element) => {
    const currentId = element.getAttribute('id')

    // Extrahiere die bestehende Nummerierung (Suffix) aus der aktuellen ID
    const idParts = currentId.split('-')
    if (idParts.length > 1) {
      const suffix = idParts[idParts.length - 1]
      // Setze die neue ID mit dem neuen Präfix (newId) und dem alten Suffix
      const newElementId = `${newId}-${suffix}`
      element.setAttribute('id', newElementId)
    }
  })

  return svgContent
}

/**
 * Überprüft, ob zwei Arrays gleich sind.
 */
function arraysAreEqual(arr1, arr2) {
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      return false
    }
  }
  return true
}

/**
 * Findet die minimale und maximale ID der SVG-Elemente
 * @param {Element} svgContent Das SVG-Element, dessen IDs geprüft werden sollen.
 * @returns {Object} Ein Objekt mit den minimalen und maximalen IDs.
 */
function findMinMaxIds(svgContent) {
  let min = 0
  let max = 0

  let ids = Array.from(svgContent.querySelectorAll('[id]')).map(elem => parseInt(elem.id.split('-')[1]))
  min = Math.min(...ids)
  max = Math.max(...ids)

  return {min, max}
}
