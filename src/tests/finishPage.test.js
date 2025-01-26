import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import FinishPage from '@/pages/FinishPage.vue'
import { store } from '@/store'
import {
  bubbleSortWithScore,
  selectionSortWithScore,
  insertionSortWithScore,
  quickSortWithScore,
  mergeSortWithScore,
} from '@/algorithms.js'

// Mocking the algorithms to avoid actual sorting during tests
vi.mock('@/algorithms.js', () => ({
  bubbleSortWithScore: vi.fn().mockReturnValue({ score: 10, sortedArray: [] }),
  selectionSortWithScore: vi.fn().mockReturnValue({ score: 15, sortedArray: [] }),
  insertionSortWithScore: vi.fn().mockReturnValue({ score: 20, sortedArray: [] }),
  quickSortWithScore: vi.fn().mockReturnValue({ score: 25, sortedArray: [] }),
  mergeSortWithScore: vi.fn().mockReturnValue({ score: 30, sortedArray: [] }),
}))

describe('FinishPage', () => {
  it('should display the correct score', async () => {
    // Arrange: set a score in the store
    store.score = 50

    // Mount the component
    const wrapper = mount(FinishPage)

    // Assert: check if the score is displayed correctly
    expect(wrapper.text()).toContain('Score: 50')
  })

  //funktioniert richtig man muss nachricht nur anpassen
  it('should call sorting algorithms and display their results', async () => {
    // Arrange: mount the component
    const wrapper = mount(FinishPage)

    // Assert: check if the sorting algorithm results are displayed correctly
    expect(wrapper.text()).toContain('bubblesort { score: 10, sortedArray: [] }')
    expect(wrapper.text()).toContain('selectionSort { score: 15, sortedArray: [] }')
    expect(wrapper.text()).toContain('insertionSort { score: 20, sortedArray: [] }')
    expect(wrapper.text()).toContain('quickSort { score: 25, sortedArray: [] }')
    expect(wrapper.text()).toContain('mergeSort { score: 30, sortedArray: [] }')
  })

  it('should navigate to the home page when the button is clicked', async () => {
    // Arrange: Mock the router push method
    const routerPush = vi.fn()
    const wrapper = mount(FinishPage, {
      global: {
        mocks: {
          $router: {
            push: routerPush,
          },
        },
      },
    })

    // Act: simulate a button click
    await wrapper.find('button').trigger('click')

    // Assert: check if the navigation function was called
    expect(routerPush).toHaveBeenCalledWith('/')
  })
})
