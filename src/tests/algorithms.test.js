import { expect, test } from 'vitest'
import {
  bubbleSortWithScore,
  selectionSortWithScore,
  insertionSortWithScore,
  quickSortWithScore,
  mergeSortWithScore,
} from '@/algorithms.js'

const algorithms = [
  { name: 'bubbleSort', fn: bubbleSortWithScore },
  { name: 'selectionSort', fn: selectionSortWithScore },
  { name: 'insertionSort', fn: insertionSortWithScore },
  { name: 'quickSort', fn: quickSortWithScore },
  { name: 'mergeSort', fn: mergeSortWithScore },
]

const testCases = [
  {
    description: 'sortiert einen unsortierten Array korrekt',
    input: [{ id: 3 }, { id: 7 }, { id: 2 }, { id: 4 }, { id: 1 }],
    expected: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 7 }],
  },
  {
    description: 'sortiert einen bereits sortierten Array korrekt',
    input: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }],
    expected: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }],
  },
  {
    description: 'gibt einen leeren Array unverändert zurück',
    input: [],
    expected: [],
  },
  {
    description: 'gibt einen Array mit einem Element unverändert zurück',
    input: [{ id: 1 }],
    expected: [{ id: 1 }],
  },
]

algorithms.forEach(({ name, fn }) => {
  testCases.forEach(({ description, input, expected }) => {
    test(`${name} ${description}`, () => {
      const { sortedArray } = fn(input, true)
      expect(sortedArray).toEqual(expected)
    })
  })

  test(`${name} gibt den richtigen Score für einen unsortierten Array aus`, () => {
    const arr = [{ id: 3 }, { id: 7 }, { id: 2 }, { id: 4 }, { id: 1 }]
    const { scoreSwap, scoreLook } = fn(arr)

    if (name === 'bubbleSort') {
      expect(scoreSwap).toBe(7)
      expect(scoreLook).toBe(40)
    } else if (name === 'selectionSort') {
      expect(scoreSwap).toBe(3)
      expect(scoreLook).toBe(20)
    } else if (name === 'insertionSort') {
      expect(scoreSwap).toBe(7)
      expect(scoreLook).toBe(15)
    } else if (name === 'quickSort') {
      expect(scoreSwap).toBe(6)
      expect(scoreLook).toBe(9)
    } else if (name === 'mergeSort') {
      expect(scoreSwap).toBe(8)
      expect(scoreLook).toBe(8)
    }
  })

  test(`${name} gibt einen Score von 0 zurück, wenn der Array leer ist`, () => {
    const arr = []
    const { scoreSwap, scoreLook } = fn(arr)

    expect(scoreSwap).toEqual(0) // Keine Swaps erforderlich
    expect(scoreLook).toEqual(0) // Keine Vergleiche erforderlich
  })

  test(`${name} gibt einen Score von 0 zurück, wenn der Array nur ein Element enthält`, () => {
    const arr = [{ id: 1 }]
    const { scoreSwap, scoreLook } = fn(arr)
    expect(scoreSwap).toEqual(0) // Keine Swaps erforderlich
    expect(scoreLook).toEqual(0) // Keine Vergleiche erforderlich
  })
})
