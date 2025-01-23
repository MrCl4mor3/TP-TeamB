import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import HomePage from '@/pages/HomePage.vue'
import { resetStore } from '../store'
import { generateCards } from '@/setupCards';

// Mock für Vue Router
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}))

// Mock für generateCards
vi.mock('@/setupCards.js', () => ({
  generateCards: vi.fn(),
}))

describe('HomePage.vue', () => {
  let wrapper
  const routerMock = vi.mocked({
    push: vi.fn(),
  })

  beforeEach(() => {
    // Store zurücksetzen und Komponente mounten
    resetStore()
    wrapper = mount(HomePage, {
      global: {
        mocks: {
          $router: routerMock,
        },
      },
    })
  })

  it('renders the headline and description', () => {
    expect(wrapper.find('h1').text()).toBe(wrapper.vm.description.headline)
    expect(wrapper.find('.description-container').exists()).toBe(true)
  })

  it('renders algorithm and mode selection options', () => {
    const algorithmOptions = wrapper.findAll('.radio-group-algorithms input')
    const modeOptions = wrapper.findAll('.radio-group-modes input')

    expect(algorithmOptions.length).toBe(wrapper.vm.algorithms.length)
    expect(modeOptions.length).toBe(wrapper.vm.modes.length)
  })

  //nicht notwendig?
  it('renders the number of cards input', () => {
    const inputNumber = wrapper.find('input#AnzahlKarten')
    expect(inputNumber.exists()).toBe(true)
    expect(inputNumber.element.type).toBe('number')
  })

  it('updates selected algorithm and mode when clicked', async () => {
    const firstAlgorithm = wrapper.find('.radio-group-algorithms input')
    const firstMode = wrapper.find('.radio-group-modes input')

    await firstAlgorithm.setValue()
    await firstMode.setValue()

    expect(wrapper.vm.selectedCategory).toBe(wrapper.vm.algorithms[0].name)
    expect(wrapper.vm.selectedMode).toBe(wrapper.vm.modes[0].name)
  })

  it('validates input and navigates to sorting page on start button click', async () => {
    const startButton = wrapper.find('.start-container ButtonPress button')

    // Set valid inputs
    wrapper.vm.selectedCategory = 'Bubble Sort'
    wrapper.vm.selectedMode = 'Freies Sortieren'
    wrapper.vm.numberOfCards = 10

    await startButton.trigger('click')

    expect(generateCards).toHaveBeenCalledWith('Bubble Sort', 'Freies Sortieren', 10)
    expect(routerMock.push).toHaveBeenCalledWith('/sortingPage')
  })

  it('shows an alert if no algorithm is selected', async () => {
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {})
    const startButton = wrapper.find('.start-container button')

    // Set invalid inputs
    wrapper.vm.selectedCategory = null
    wrapper.vm.selectedMode = 'Freies Sortieren'
    wrapper.vm.numberOfCards = 10

    await startButton.trigger('click')

    expect(alertMock).toHaveBeenCalledWith('Bitte wählen Sie einen Algorithmus aus!')
    alertMock.mockRestore()
  })

  it('shows an alert if no mode is selected', async () => {
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {})
    const startButton = wrapper.find('.start-container button')

    // Set invalid inputs
    wrapper.vm.selectedCategory = 'Bubble Sort'
    wrapper.vm.selectedMode = null
    wrapper.vm.numberOfCards = 10

    await startButton.trigger('click')

    expect(alertMock).toHaveBeenCalledWith('Bitte wählen Sie einen Modus aus!')
    alertMock.mockRestore()
  })

  it('shows an alert if the number of cards is out of range', async () => {
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {})
    const startButton = wrapper.find('.start-container button')

    // Set invalid inputs
    wrapper.vm.selectedCategory = 'Bubble Sort'
    wrapper.vm.selectedMode = 'Freies Sortieren'
    wrapper.vm.numberOfCards = 25 // Out of range

    await startButton.trigger('click')

    expect(alertMock).toHaveBeenCalledWith('Bitte geben Sie eine Anzahl zwischen 4 und 20 ein!')
    alertMock.mockRestore()
  })

  it('navigates to the test page when "t" key is pressed', async () => {
    await wrapper.trigger('keyup', { key: 't' })
    expect(routerMock.push).toHaveBeenCalledWith('/testPage')
  })

  it('navigates to the sorting page when "Enter" key is pressed', async () => {
    // Set valid inputs
    wrapper.vm.selectedCategory = 'Bubble Sort'
    wrapper.vm.selectedMode = 'Freies Sortieren'
    wrapper.vm.numberOfCards = 10

    await wrapper.trigger('keyup', { key: 'Enter' })

    expect(generateCards).toHaveBeenCalledWith('Bubble Sort', 'Freies Sortieren', 10)
    expect(routerMock.push).toHaveBeenCalledWith('/sortingPage')
  })
})
