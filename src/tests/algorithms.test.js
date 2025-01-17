import { expect,test } from 'vitest';
import {
  bubbleSortWithScore,
  selectionSortWithScore,
  insertionSortWithScore,
  quickSortWithScore,
  mergeSortWithScore,
} from '@/algorithms.js'
const testCases = [
  {
    description: 'Der Sortieralgorithmus sortiert den Array richtig',
    input: [
      { id: 3 },
      { id: 7 },
      { id: 2 },
      { id: 4 },
      { id: 1 },
    ],
    expected: [
      { id: 1 },
      { id: 2 },
      { id: 3 },
      { id: 4 },
      { id: 7 },
    ],
  }
];
test('bubbleSort gibt den richtigen score aus', () => {
  const arr = [
    { id: 3 },
    { id: 7 },
    { id: 2 },
    { id: 4 },
    { id: 1 },
  ];
  const {score} = bubbleSortWithScore(arr);
  expect(score).toEqual(20);
});

test('bubblesort gibt einen score von lenghth - 1 zurück, wenn der Array bereits sortiert ist', () => {
  const arr = [
    { id: 1 },
    { id: 2 },
    { id: 3 },
    { id: 4 },
    { id: 5 },
  ];
  const {score} = bubbleSortWithScore(arr);
  expect(score).toEqual(4);
});

test('bubblesort gibt einen score von 0 zurück, wenn der Array leer ist', () => {
  const arr = [];
  const {score} = bubbleSortWithScore(arr);
  expect(score).toEqual(0);
});

test('bubblesort gibt einen score von 0 zurück, wenn der Array nur ein Element enthält', () => {
  const arr = [{ id: 1 }];
  const {score} = bubbleSortWithScore(arr);
  expect(score).toEqual(0);
});

test('bubblesort sortiert den Array korrekt', () => {
  const arr = [
    { id: 3 },
    { id: 7 },
    { id: 2 },
    { id: 4 },
    { id: 1 },
  ];

  const {sortedArray} = bubbleSortWithScore(arr, true);
  expect(sortedArray).toEqual([
    { id: 1 },
    { id: 2 },
    { id: 3 },
    { id: 4 },
    { id: 7 },
  ]);
});

