import { store } from './store'

export function bubbleSortWithScore(cards, returnSorted = false) {
  let sortingCards = cards.slice()
  let scoreSwap = 0
  let scoreLook = 0
  store.correctSortingOrderBubble.splice(0)
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
    return { scoreSwap, scoreLook, sortedArray: sortingCards }
  }

  return { scoreSwap, scoreLook }
}
export function selectionSortWithScore(cards, returnSorted = false) {
  let sortingCards = cards.slice()
  let scoreSwap = 0
  let scoreLook = 0
  store.correctSortingOrderSelect.splice(0)

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
  store.correctSortingOrderInsert.splice(0)

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

    for (let i = 1; i < array.length; i++) {
      scoreLook++ // Ein Element wird betrachtet
      if (array[i].id < pivot.id) {
        scoreSwap++
        left.push(array[i])
      } else {
        scoreSwap++

        right.push(array[i])
      }
    }

    return [...quickSort(left), pivot, ...quickSort(right)]
  }

  const sortedArray = quickSort(cards.slice())

  if (returnSorted) {
    return { score, sortedArray }
  }

  return { score, scoreSwap, scoreLook }
}

export function mergeSortWithScore(cards, returnSorted = false) {
  let score = 0
  let scoreSwap = 0
  let scoreLook = 0

  function merge(left, right) {
    const result = []

    while (left.length && right.length) {
      scoreLook++
      scoreSwap++
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

  return { score, scoreSwap, scoreLook }
}
