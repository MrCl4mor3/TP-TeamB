import { store } from './store'
import cardSvg from '@/assets/card.svg'

export function generateCards(selectedCategory, selectedMode, numberOfCards) {
  store.selectedMode = selectedMode;
  store.selectedCategory = selectedCategory;
  store.numberOfCards = numberOfCards;

  //lade zunächst die svg Datei
  fetch(cardSvg)
    .then(response => response.text())
    .then(svgContent => {
      //Parse die SVG Datei und speichere sie in einer Variable
      const parser = new DOMParser();
      const svgDocument = parser.parseFromString(svgContent, 'image/svg+xml');
      let svgTemplate = svgDocument.documentElement;

      //Min und Max Werte für die Zufallszahlen
      const min = 1;
      const max = 28;
      let cards = [];
      //Karte 0 ist die Vorlage
      cards[0] = {id: 0, svg: svgTemplate.cloneNode(true)};

      //Entfernen einzelner Komponenten
      for (let i = 1; i < store.numberOfCards; i++) {
        //Kopiere das Bild zuvor
        let oldCard = cards[i - 1];
        //Kopiere daraus das svg Element
        let oldSvg = oldCard.svg.cloneNode(true);
        //Update die ID in "card + i", zb card1.
        let newSvg = updateSvgID(oldSvg, 'card'+ i);
        //Entferne nun ein Path mit einer zufälligen Nummer, die id ist der Form "card1-3" für den 3. Pfad
        newSvg = removePart(`${'card' + i}-${getRandomInt(min, max)}`, newSvg);
        //Speicher das neue bild in cards ab
        cards[i] = {id: i, svg: newSvg};
      }
      //Speicher die Karten im Store ab
      store.cards = cards;
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

function removePart(id, svgContent) {
  const element = svgContent.querySelector(`#${id}`);
  element.parentNode.removeChild(element);
  return svgContent;
}


function getRandomInt(min, max) {
  const random = Math.floor(Math.random() * (max - min + 1)) + min;
  console.log(random);
  return random;
}

function updateSvgID(svgContent, newId) {
  if (svgContent.hasAttribute("id")) {
    svgContent.removeAttribute("id");
  }
  svgContent.setAttribute("id", newId);

  // Alle IDs innerhalb des SVGs neu setzen, um Konflikte zu vermeiden.
  const allPaths = svgContent.querySelectorAll('[id]');
  allPaths.forEach((path, index) => {
    path.setAttribute('id', `${newId}-${index + 1}`);
  });

  return svgContent;
}

