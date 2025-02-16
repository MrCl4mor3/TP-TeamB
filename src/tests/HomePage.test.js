import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import HomePage from '@/pages/HomePage.vue'
import { resetStore } from '@/store.js'
import { generateCards } from '@/cardSetup.js'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'

// Mocking der Funktionen
vi.mock('@/store.js', () => ({
  resetStore: vi.fn(),
}))

vi.mock('@/cardSetup.js', () => ({
  generateCards: vi.fn(),
}))

describe('HomePage.vue', () => {
  let wrapper

  beforeEach(() => {
    // Setup: Mount the component before each test
    wrapper = mount(HomePage, {
      global: {
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

  it('should show tutorial if user is visiting for the first time', () => {
    // Simulate first visit by clearing sessionStorage
    sessionStorage.clear()

    // Re-mount the wrapper
    wrapper = mount(HomePage, {
      global: {
        mocks: {
          $router: {
            push: vi.fn(),
          },
        },
      },
    })

    // Assert that the tutorial modal is shown
    expect(wrapper.vm.visibleTutorial).toBe(true)
  })

  it('goes To SortingPage if event.key === \'Enter\''), () => {
    wrapper.vm.event.key === 'Enter'
    wrapper.vm.handleKeyPress('Enter')
    expect(wrapper.vm.goToSortingPage()).toBeCalledTimes(1);
  }



})
