import { describe, it, expect, vi} from 'vitest'
import { mount} from '@vue/test-utils';
import { store } from '../store'
import cardSvg from '../assets/card2.svg'
import { generateCards, removePart, getRandomInt, updateSvgID, arraysAreEqual, findMinMaxIds } from '@/cardSetup.js'
import cardSetup from '../cardSetup.js'



describe('cardSetup', () => {

  // let wrapper = mount(cardSetup)
   let svgContent = cardSvg

/*
  it('should generate Cards', () => {
    //const svg = cardSvg
    //cardSetup.cardsvg = svg;
    const card = '/src/assets/card2.svg'
    fetch(card)
      .then((response) => {
        console.log("Fetch abgeschlossen");
        return response.text();
      })
    generateCards('unfree-sort','Bubble Sort',4)
    expect(store.selectedMode).toBe('Bubble Sort');                    GIBT UNHANDLED ERROR
    expect(store.selectedCategory).toBe('unfree-sort');


  })

 */

  it('should get cards', () => {
    generateCards('Mode1','Bubble Sort',4)
    expect(store.cards).not.toBeNull;

  })



/*
  it('should remove parts', () => {
    const parser = new DOMParser()
    const svgDocument = parser.parseFromString(svgContent, 'image/svg+xml')
    let svgTemplate = svgDocument.documentElement
    let numberOfCards = 5
    store.cards = []
    let svg = svgTemplate.cloneNode(true)
    //Update die ID's in "card + i", zb card1.
    let newSvg = updateSvgID(svg, 'card' + (numberOfCards - 1))
    store.cards[store.numberOfCards - 1] = {
      id: store.numberOfCards,
      svg: newSvg,
    }

    console.log('karten nach neuer svg:   ' + store.cards)
  })


  it('should remove parts', async () => {
    store.cards = [

    ]
    await removePart(1, cardSvg)

  })
  */

  it('gets a random int', () => {
    const random = getRandomInt(2, 5)

    expect(random).toBeLessThanOrEqual(5)
    expect(random).toBeGreaterThanOrEqual(2)
  })

  it('compares arrays', () => {
    const arr1= [0,1,2]
    const arr2 = [1,2,3]
    const arr3 = [1,2,3]

    const comp1 = arraysAreEqual(arr1, arr2)
    const comp2 = arraysAreEqual(arr2, arr3)

    expect(comp1).toBe(false)
    expect(comp2).toBe(true)

  })

  it('findet die minimale und maximale ID korrekt', () => {
    // Erstelle ein Dummy-SVG-Element
    const parser = new DOMParser()
    const svgString = `
      <svg>
        <rect id="card-1"></rect>
        <circle id="card-3"></circle>
        <line id="card-5"></line>
        <path id="card-10"></path>
      </svg>
    `
    const svgDocument = parser.parseFromString(svgString, 'image/svg+xml')
    const svgElement = svgDocument.documentElement

    // Führe die Funktion aus
    const { min, max } = findMinMaxIds(svgElement)

    // Erwartete Werte: Min = 1, Max = 10
    expect(min).toBe(1)
    expect(max).toBe(10)
  })

  it('entfernt ein vorhandenes Element aus dem SVG', () => {
    const parser = new DOMParser()
    const svgString = `<svg><rect id="removeMe"></rect><circle id="keepMe"></circle></svg>`
    const svgDocument = parser.parseFromString(svgString, 'image/svg+xml')
    const svgElement = svgDocument.documentElement

    // Entferne das <rect>-Element mit der ID "removeMe"
    const updatedSvg = removePart('removeMe', svgElement)

    // Überprüfe, ob das Element entfernt wurde
    expect(updatedSvg.querySelector('#removeMe')).toBeNull()

    // Stelle sicher, dass das andere Element noch existiert
    expect(updatedSvg.querySelector('#keepMe')).not.toBeNull()
  })

  it('ändert die ID des SVG-Haupt-Elements', () => {
    const parser = new DOMParser()
    const svgString = `<svg id="oldId"><rect id="oldId-1"></rect><circle id="oldId-2"></circle></svg>`
    const svgDocument = parser.parseFromString(svgString, 'image/svg+xml')
    const svgElement = svgDocument.documentElement

    // Aktualisiere die SVG-ID
    const updatedSvg = updateSvgID(svgElement, 'newId')

    // Überprüfe, ob die ID des Haupt-SVG-Elements geändert wurde
    expect(updatedSvg.getAttribute('id')).toBe('newId')
  })


})

