import { store } from './store';

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

export function generateCards2(selectedCategory, selectedMode, numberOfCards) {
  store.selectedMode = selectedMode;
  store.selectedCategory = selectedCategory;
  store.numberOfCards = numberOfCards;
}
