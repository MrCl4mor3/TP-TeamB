import { store } from './store'

export function bubbleSortWithScore(cards, returnSorted = false) {
  let sortingCards = cards.slice()
  let scoreSwap = 0
  let scoreLook = 0
  store.correctSortingOrderBubble.splice(0);
  let swapped

  do {
    swapped = false
    for (let i = 0; i < sortingCards.length - 1; i++) {
      scoreLook = scoreLook + 2 // da zwei Elemente betrachtet werden
      if (sortingCards[i].id > sortingCards[i + 1].id) {
        store.correctSortingOrderBubble.push([i, i + 1])

        const temp = sortingCards[i]
        sortingCards[i] = sortingCards[i + 1]
        sortingCards[i + 1] = temp
        swapped = true
        scoreSwap++
      }
    }
  } while (swapped)

  if (returnSorted) {
    return {scoreSwap, scoreLook, sortedArray: sortingCards }
  }

  return { scoreSwap, scoreLook }
}
export function selectionSortWithScore(cards, returnSorted = false) {
  let sortingCards = cards.slice()
  let scoreSwap = 0
  let scoreLook = 0
  store.correctSortingOrderSelect.splice(0);

  for (let i = 0; i < sortingCards.length; i++) {
    let minIndex = i
    for (let j = i + 1; j < sortingCards.length; j++) {
      scoreLook = scoreLook + 2 // da zwei Elemente betrachtet werden
      if (sortingCards[j].id < sortingCards[minIndex].id) {
        minIndex = j
      }
    }
    if (minIndex !== i) {
      store.correctSortingOrderSelect.push([i, minIndex])

      const temp = sortingCards[i]
      sortingCards[i] = sortingCards[minIndex]
      sortingCards[minIndex] = temp
      scoreSwap++
    }
  }

  if (returnSorted) {
    return { sortedArray: sortingCards }
  }

  return { scoreSwap, scoreLook }
}

export function insertionSortWithScore(cards, returnSorted = false) {
  let sortingCards = cards.slice()
  let scoreSwap = 0
  let scoreLook = 0
  store.correctSortingOrderInsert.splice(0);

  for (let i = 1; i < sortingCards.length; i++) {
    scoreLook++ //
    let current = sortingCards[i]
    let j = i - 1
    while (j >= 0 && sortingCards[j].id > current.id) {
      scoreLook++
      store.correctSortingOrderInsert.push([j, j + 1])
      sortingCards[j + 1] = sortingCards[j]
      scoreSwap++
      j--
    }
    scoreLook++
    sortingCards[j + 1] = current
  }

  if (returnSorted) {
    return { sortedArray: sortingCards }
  }

  return { scoreSwap, scoreLook }
}

export function quickSortWithScore(cards, returnSorted = false) {
  let score = 0
  let scoreSwap = 0
  let scoreLook = 0

  function quickSort(array) {
    if (array.length <= 1) {
      return array
    }

    scoreLook++
    const pivot = array[0]
    const left = []
    const right = []

    for (let i = 0; i < array.length - 1; i++) {
      console.log("test")

      scoreLook++
      if (array[i].id < pivot.id) {
        scoreSwap++
        left.push(array[i])
      } else {
        scoreSwap++
        right.push(array[i])
      }
    }
    scoreLook++ //da bei der if Bedingung das letzte Element nicht betrachtet wird

    return [...quickSort(left), pivot, ...quickSort(right)]
  }

  const sortedArray = quickSort(cards.slice())

  if (returnSorted) {
    return { score, sortedArray }
  }

  return { score, scoreSwap, scoreLook }
}

export function mergeSortWithScore(cards, returnSorted = false) {
  let score = 0;
  let scoreSwap = 0;
  let scoreLook = 0;

  function insertionSort(array, start, end) {
    for (let i = start + 1; i <= end; i++) {
      let key = array[i];
      let j = i - 1;

      scoreLook++; // Betrachte das aktuelle Element

      // Verschieben der Elemente nach rechts, um Platz für das Schlüssel-Element zu schaffen
      while (j >= start && array[j].id > key.id) {
        array[j + 1] = array[j];
        j--;
        scoreSwap++; // Dieser Swap zählt, da das Element tatsächlich verschoben wird
      }

      array[j + 1] = key; // Füge das Schlüssel-Element ein
    }
  }

  function mergeSort(array, start, end) {
    if (start >= end) {
      return;
    }

    const middle = Math.floor((start + end) / 2);

    mergeSort(array, start, middle);    // Linke Hälfte sortieren
    mergeSort(array, middle + 1, end); // Rechte Hälfte sortieren

    // Füge beide Hälften zusammen und führe InsertionSort durch
    insertionSort(array, start, end);
  }

  mergeSort(cards, 0, cards.length - 1);

  if (returnSorted) {
    return { score, sortedArray: cards };
  }

  return { score, scoreSwap, scoreLook };
}
