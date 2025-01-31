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
  bubbleSortWithScore: vi.fn().mockReturnValue({ score: 10 }),
  selectionSortWithScore: vi.fn().mockReturnValue({ score: 15 }),
  insertionSortWithScore: vi.fn().mockReturnValue({ score: 20 }),
  quickSortWithScore: vi.fn().mockReturnValue({ score: 25 }),
  mergeSortWithScore: vi.fn().mockReturnValue({ score: 30 }),
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

  it('should call sorting algorithms and display their results', async () => {
    // Arrange: mount the component
    const wrapper = mount(FinishPage)

    // Assert: check if the sorting algorithm results are displayed correctly
    expect(wrapper.html()).toMatch(/<p>bubblesort\s*\{\s*"score":\s*10\s*\}<\/p>/)
    expect(wrapper.html()).toMatch(/<p>selectionSort\s*\{\s*"score":\s*15\s*\}<\/p>/)
    expect(wrapper.html()).toMatch(/<p>insertionSort\s*\{\s*"score":\s*20\s*\}<\/p>/)
    expect(wrapper.html()).toMatch(/<p>quickSort\s*\{\s*"score":\s*25\s*\}<\/p>/)
    expect(wrapper.html()).toMatch(/<p>mergeSort\s*\{\s*"score":\s*30\s*\}<\/p>/)

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
