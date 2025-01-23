import { describe, it, expect } from 'vitest';
import { store, resetStore } from '../store'

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
    };

    // Store sollte mit dem Standardzustand übereinstimmen
    expect(store).toEqual(defaultState);
  });

  it('should allow modifications to the store', () => {
    // Modifikation des Stores
    store.numberOfCards = 5;
    store.selectedCategory = 'TestCategory';

    // Überprüfen, ob die Modifikationen vorgenommen wurden
    expect(store.numberOfCards).toBe(5);
    expect(store.selectedCategory).toBe('TestCategory');
  });

  it('should reset to the default state when resetStore is called', () => {
    // Modifikation des Stores
    store.numberOfCards = 5;
    store.selectedCategory = 'TestCategory';

    // Store zurücksetzen
    resetStore();

    // Erwarteter Standardzustand nach dem Zurücksetzen
    const defaultState = {
      numberOfCards: 0,
      numberOfFlippedCards: 0,
      cards: [],
      startingCards: [],
      correctCards: [],
      score: 0,
      selectedCategory: null,
      selectedMode: null,
    };

    // Überprüfen, ob der Store zurückgesetzt wurde
    expect(store).toEqual(defaultState);
  });
});
