import { describe, it, expect } from 'vitest'
import { store, resetStore, resetStartValues } from '../store'

describe('Store', () => {
  it('should initialize with the correct default state', () => {
    // Erwarteter Standardzustand
    const defaultState = {
      numberOfCards: 0,
      numberOfFlippedCards: 0,
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

    // Store sollte mit dem Standardzustand übereinstimmen
    expect(store.numberOfCards).toBe(defaultState.numberOfCards)
    expect(store.numberOfFlippedCards).toBe(defaultState.numberOfFlippedCards)
    expect(store.cards).toEqual(defaultState.cards)
    // Weitere Checks für alle Felder
  })

  it('should allow modifications to the store', () => {
    // Modifikation des Stores
    store.numberOfCards = 5
    store.selectedCategory = 'TestCategory'

    // Überprüfen, ob die Modifikationen vorgenommen wurden
    expect(store.numberOfCards).toBe(5)
    expect(store.selectedCategory).toBe('TestCategory')
  })

  it('should reset to the default state when resetStore is called', () => {
    // Modifikation des Stores
    store.numberOfCards = 5
    store.selectedCategory = 'TestCategory'

    // Store zurücksetzen
    resetStore()

    // Überprüfen, ob der Store zurückgesetzt wurde
    expect(store.numberOfCards).toBe(0)
    expect(store.selectedCategory).toBeNull()
    expect(store.numberOfFlippedCards).toBe(0)
    expect(store.cards).toEqual([])
    // Weitere Überprüfungen des zurückgesetzten Zustands
  })

  it('should reset start values', () => {
    store.numberOfFlippedCards = 5
    store.score = 100
    store.selectedCards = [{ id: 1 }]

    resetStartValues()

    // Überprüfen, ob die Startwerte zurückgesetzt wurden
    expect(store.numberOfFlippedCards).toBe(0)
    expect(store.score).toBe(0)
    expect(store.selectedCards).toEqual([])
  })
})
