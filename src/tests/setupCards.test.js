import { describe, it, expect, beforeEach } from 'vitest';
import { generateCards, generateCards2 } from '@/cardSetup.js';
import { store } from '@/store';

describe('setupCards.js', () => {
  beforeEach(() => {
    // Zurücksetzen des Stores vor jedem Test
    store.selectedCategory = null;
    store.selectedMode = null;
    store.numberOfCards = 0;
    store.cards = [];
    store.correctCards = [];
    store.startingCards = [];
  });

  describe('generateCards', () => {
    it('should set the store values correctly', () => {
      generateCards('Kategorie1', 'Modus1', 5);

      expect(store.selectedCategory).toBe('Kategorie1');
      expect(store.selectedMode).toBe('Modus1');
      expect(store.numberOfCards).toBe(5);
    });

    it('should generate the correct number of cards', () => {
      generateCards('Kategorie1', 'Modus1', 5);

      expect(store.cards).toHaveLength(5);
      expect(store.correctCards).toHaveLength(5);
      expect(store.startingCards).toHaveLength(5);
    });

    it('should shuffle the cards', () => {
      generateCards('Kategorie1', 'Modus1', 5);

      const cardIds = store.correctCards.map(card => card.id);
      const shuffledCardIds = store.cards.map(card => card.id);

      // Karten sollten gemischt sein, d. h. die Reihenfolge sollte nicht identisch sein
      expect(shuffledCardIds).not.toEqual(cardIds);

      // Die gemischten Karten sollten die gleichen IDs enthalten
      expect(shuffledCardIds.sort()).toEqual(cardIds.sort());
    });

    //wieso? starting cards sind anders als correct cards
    it('should store the correct cards in their original order', () => {
      generateCards('Kategorie1', 'Modus1', 5);

      const cardIds = store.correctCards.map(card => card.id);
      const startingCardIds = store.startingCards.map(card => card.id);

      expect(startingCardIds).toEqual(cardIds);
    });
  });

  describe('generateCards2', () => {
    it('should set the store values correctly without generating cards', () => {
      generateCards2('Kategorie2', 'Modus2', 3);

      expect(store.selectedCategory).toBe('Kategorie2');
      expect(store.selectedMode).toBe('Modus2');
      expect(store.numberOfCards).toBe(3);

      // Keine Karten sollten generiert werden
      expect(store.cards).toHaveLength(0);
      expect(store.correctCards).toHaveLength(0);
      expect(store.startingCards).toHaveLength(0);
    });
  });
});
