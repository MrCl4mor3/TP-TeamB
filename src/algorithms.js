
import { store } from './store'

export function bubbleSortWithScore(cards, returnSorted = false) {
  let sortingCards = cards.slice()
  let score = 0 // Score-Variable, um die Anzahl der Betrachtungen zu zählen
  let swapped

  do {
    swapped = false
    for (let i = 0; i < sortingCards.length - 1; i++) {
      score++ // Ein Element wird betrachtet
      console.log(score)
      if (sortingCards[i].id > sortingCards[i + 1].id) {
        store.correctSortingOrder.push([i, i + 1])

        // Elemente vertauschen
        const temp = sortingCards[i]
        sortingCards[i] = sortingCards[i + 1]
        sortingCards[i + 1] = temp
        swapped = true
      }
    }
  } while (swapped)

  if (returnSorted) {
    return { score, sortedArray: sortingCards }
  }

  return { score }
}
export function selectionSortWithScore(cards, returnSorted = false) {
  let sortingCards = cards.slice()
  let score = 0

  for (let i = 0; i < sortingCards.length; i++) {
    let minIndex = i
    for (let j = i + 1; j < sortingCards.length; j++) {
      score++ // Ein Element wird betrachtet
      console.log(score)
      if (sortingCards[j].id < sortingCards[minIndex].id) {
        minIndex = j
      }
    }
    if (minIndex !== i) {
      store.correctSortingOrder.push([i, minIndex])

      const temp = sortingCards[i]
      sortingCards[i] = sortingCards[minIndex]
      sortingCards[minIndex] = temp
    }
  }

  if (returnSorted) {
    return { score, sortedArray: sortingCards }
  }

  return { score }
}

export function insertionSortWithScore(cards, returnSorted = false) {
  let sortingCards = cards.slice()
  let score = 0

  for (let i = 1; i < sortingCards.length; i++) {
    let current = sortingCards[i]
    let j = i - 1
    while (j >= 0 && sortingCards[j].id > current.id) {
      score++ // Ein Element wird betrachtet
      console.log(score)
      store.correctSortingOrder.push([j, j + 1])
      sortingCards[j + 1] = sortingCards[j]
      j--
    }
    score++ // Auch wenn die Schleife abbricht, wird ein Element betrachtet
    sortingCards[j + 1] = current
  }

  if (returnSorted) {
    return { score, sortedArray: sortingCards }
  }

  return { score }
}

export function quickSortWithScore(cards, returnSorted = false) {
  let score = 0

  function quickSort(array) {
    if (array.length <= 1) {
      return array
    }

    const pivot = array[array.length - 1]
    const left = []
    const right = []

    for (let i = 0; i < array.length - 1; i++) {
      score++ // Ein Element wird betrachtet
      console.log(score)
      if (array[i].id < pivot.id) {
        left.push(array[i])
      } else {
        right.push(array[i])
      }
    }

    return [...quickSort(left), pivot, ...quickSort(right)]
  }

  const sortedArray = quickSort(cards.slice())

  if (returnSorted) {
    return { score, sortedArray }
  }

  return { score }
}

export function mergeSortWithScore(cards, returnSorted = false) {
  let score = 0

  function merge(left, right) {
    const result = []

    while (left.length && right.length) {
      score++ // Ein Element wird betrachtet
      console.log(score)
      if (left[0].id <= right[0].id) {
        result.push(left.shift())
      } else {
        result.push(right.shift())
      }
    }

    return [...result, ...left, ...right]
  }

  function mergeSort(array) {
    if (array.length <= 1) {
      return array
    }

    const middle = Math.floor(array.length / 2)
    const left = mergeSort(array.slice(0, middle))
    const right = mergeSort(array.slice(middle))

    return merge(left, right)
  }

  const sortedArray = mergeSort(cards.slice())

  if (returnSorted) {
    return { score, sortedArray }
  }


  return { score }
}
