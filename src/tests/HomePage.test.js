import { mount } from '@vue/test-utils'
import HomePage from '@/pages/HomePage.vue'
import { resetStore } from '@/store.js'
import { generateCards } from '@/cardSetup.js'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import PrimeVue from 'primevue/config'


// Mocking der Funktionen
vi.mock('@/store.js', () => ({
  store: {
    correctCards: [{ id: 1 }, { id: 2 }, { id: 3 }],
  },
  resetStore: vi.fn(),
}))

vi.mock('@/cardSetup.js', () => ({
  generateCards: vi.fn(),
}))

describe('HomePage.vue', () => {
  let wrapper


  beforeEach(() => {
    wrapper = mount(HomePage, {
      global: {
        plugins: [PrimeVue],
        mocks: {
          $router: {
            push: vi.fn(),
          },
        },
      },
    })
  })


  afterEach(() => {
    // Cleanup: reset mocks after each test
    vi.clearAllMocks()
  })

  it('should initialize with correct default values', () => {
    // Check if the default values are correct after mounting
    expect(wrapper.vm.selectedCategory).toBe('Bubble Sort')
    expect(wrapper.vm.selectedMode).toBe('Freies Sortieren')
    expect(wrapper.vm.slideNumber).toBe(4) // Default value from startConfig
  })

  it('should call resetStore on mounted', () => {
    // Check if resetStore was called during mounting
    expect(resetStore).toHaveBeenCalled()
  })

  it('should not call generateCards if input is invalid', async () => {
    // Set invalid input (e.g., no algorithm selected)
    wrapper.vm.selectedCategory = null
    wrapper.vm.selectedMode = 'unfree-sort'
    wrapper.vm.slideNumber = 30 // outside valid range

    // Simulate button click (goToSortingPage)
    await wrapper.vm.goToSortingPage()

    // Assert that generateCards was not called
    expect(generateCards).not.toHaveBeenCalled()
  })

  it('should call generateCards if input is valid', async () => {
    // Set valid input
    wrapper.vm.selectedCategory = 'bubble-sort'
    wrapper.vm.selectedMode = 'free-sort'
    wrapper.vm.slideNumber = 10

    // Simulate button click (goToSortingPage)
    await wrapper.vm.goToSortingPage()

    // Assert that generateCards was called with correct arguments
    expect(generateCards).toHaveBeenCalledWith('bubble-sort', 'free-sort', 10)
  })

  it('goes To SortingPage if event.key === \'Enter\'', () => {
    const event = {key: 'Enter'}
    wrapper.vm.selectedCategory = 'bubble-sort'
    wrapper.vm.selectedMode = null
    wrapper.vm.slideNumber = 30 // outside valid range

    wrapper.vm.handleKeyPress(event)

    // Assert that generateCards was not called
    expect(generateCards).not.toHaveBeenCalled()

  })

})
