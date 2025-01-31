import { describe, it, expect, beforeEach } from 'vitest'
import { generateCards, generateCards2 } from '@/cardSetup.js'
import { store } from '@/store'

describe('cardSetup.js', () => {
  beforeEach(() => {
    // Zurücksetzen des Stores vor jedem Test
    store.selectedCategory = null
    store.selectedMode = null
    store.numberOfCards = 0
    store.cards = []
    store.correctCards = []
    store.startingCards = []

      //numberOfFlippedCards: 0,
      //score: 0,
      //correctSortingOrder: [],
      //selectedCards: [],
  })

  describe('generateCards', () => {
    it('should set the store values correctly', () => {
      generateCards('Kategorie1', 'Modus1', 5)

      expect(store.selectedCategory).toBe('Kategorie1')
      expect(store.selectedMode).toBe('Modus1')
      expect(store.numberOfCards).toBe(5)
    })

    it('should generate the correct number of cards', () => {
      generateCards('Kategorie1', 'Modus1', 5)

      expect(store.cards).toHaveLength(5)
      expect(store.correctCards).toHaveLength(5)
      expect(store.startingCards).toHaveLength(5)
    })

    it('should shuffle the cards', () => {
      generateCards('Kategorie1', 'Modus1', 5)

      const cardIds = store.correctCards.map((card) => card.id)
      const shuffledCardIds = store.cards.map((card) => card.id)

      // Karten sollten gemischt sein, d.h. die Reihenfolge sollte nicht identisch sein
      expect(shuffledCardIds).not.toEqual(cardIds)

      // Die gemischten Karten sollten die gleichen IDs enthalten
      expect(shuffledCardIds.sort()).toEqual(cardIds.sort())
    })

  })

})
