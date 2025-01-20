import { store } from './store'
import cardSvg from '@/assets/card.svg'

export function generateCards(selectedCategory, selectedMode, numberOfCards) {

  store.selectedMode = selectedMode;
  store.selectedCategory = selectedCategory;
  store.numberOfCards = numberOfCards;

  fetch(cardSvg)
    .then(response => response.text())
    .then(svgContent => {
      const parser = new DOMParser();
      const svgDocument = parser.parseFromString(svgContent, 'image/svg+xml');
      let svgTemplate = svgDocument.documentElement;

      const min = 1;
      const max = 28;
      let cards = [];
      cards[0] = {id: 1, svg: svgTemplate.cloneNode(true)};


      for (let i = 1; i < store.numberOfCards; i++) {
        console.log(i);
        let oldCard = cards[i - 1];
        let oldSvg = oldCard.svg.cloneNode(true);
        let newSvg = updateSvgID(oldSvg, 'card'+ i);
        //newSvg = removePart(getRandomInt(min, max), newSvg);
        cards[i] = {id: i, svg: newSvg};
        console.log(i);
      }
      store.cards = cards;
    })
    .catch(error => {
      console.error('Error:', error);
    }
  );
}

function removePart(id, svgContent) {
  svgContent.getElementById(id).remove();

  return svgContent;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function updateSvgID(svgContent, newId) {
  if ( svgContent.hasAttribute("id")) {
    svgContent.removeAttribute("id");
  }
  svgContent.setAttribute("id", newId);

  return svgContent;
}
