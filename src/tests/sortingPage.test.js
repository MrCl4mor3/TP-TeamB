import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import SortingPage from '@/pages/SortingPage.vue'
import FlippedCard from '@/components/FlippedCard.vue'
import { store } from '../store'

// Mock für Vue Router
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}))

describe('SortingPage.vue', () => {
  beforeEach(() => {
    // Store zurücksetzen
    store.numberOfFlippedCards = 0
    store.score = 0
    store.cards = [
      { id: 1 },
      { id: 2 },
      { id: 3 },
      { id: 4 },
    ]
    store.startingCards = store.cards.slice()
    store.correctCards = [
      { id: 1 },
      { id: 2 },
      { id: 3 },
      { id: 4 },
    ]
  })

  it('renders the correct number of cards', () => {
    const wrapper = mount(SortingPage)
    const cards = wrapper.findAllComponents(FlippedCard)
    expect(cards.length).toBe(store.cards.length)
  })

  it('updates score when a card is selected', async () => {
    const wrapper = mount(SortingPage)
    const firstCard = wrapper.findAllComponents(FlippedCard).at(0)

    await firstCard.trigger('click')
    expect(store.score).toBe(1)
  })

  it('swaps cards when two cards are selected', async () => {
    const wrapper = mount(SortingPage)
    const firstCard = wrapper.findAllComponents(FlippedCard).at(0)
    const secondCard = wrapper.findAllComponents(FlippedCard).at(1)

    // Wähle zwei Karten aus
    await firstCard.trigger('click')
    await secondCard.trigger('click')

    // Rufe die SwapCards-Methode auf
    await wrapper.vm.SwapCards()

    expect(store.cards[0].id).toBe(2)
    expect(store.cards[1].id).toBe(1)
  })

  it('does not swap cards if fewer than two cards are selected', () => {
    const wrapper = mount(SortingPage)
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {})

    // Wähle nur eine Karte aus
    wrapper.vm.selectedCards = [0]
    wrapper.vm.SwapCards()

    expect(alertMock).toHaveBeenCalledWith('Bitte wählen Sie zwei Karten aus!')
    alertMock.mockRestore()
  })

  it('restarts the game when no cards are selected', () => {
    const wrapper = mount(SortingPage)

    wrapper.vm.startOver()
    expect(store.cards).toEqual(store.startingCards)
    expect(store.score).toBe(0)
  })

  it('does not restart the game when cards are selected', () => {
    const wrapper = mount(SortingPage)
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {})

    wrapper.vm.selectedCards = [0]
    wrapper.vm.startOver()

    expect(alertMock).toHaveBeenCalledWith('Bitte wählen Sie keine Karten aus, um neu zu starten!')
    alertMock.mockRestore()
  })

  it('shuffles cards when no cards are selected', () => {
    const wrapper = mount(SortingPage)
    const originalCards = [...store.cards]

    wrapper.vm.shuffel()
    expect(store.cards).not.toEqual(originalCards)
  })

  it('does not shuffle cards when cards are selected', () => {
    const wrapper = mount(SortingPage)
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {})

    wrapper.vm.selectedCards = [0]
    wrapper.vm.shuffel()

    expect(alertMock).toHaveBeenCalledWith('Bitte wählen Sie keine Karten aus, um neu zu mischen!')
    alertMock.mockRestore()
  })

  it('navigates to the finish page when cards are in correct order', () => {
    const wrapper = mount(SortingPage)
    const routerMock = vi.mocked(wrapper.vm.$router.push)

    wrapper.vm.checkIfCorrect()
    expect(routerMock).toHaveBeenCalledWith('/finishPage')
  })

  it('shows an alert when cards are not in correct order', () => {
    const wrapper = mount(SortingPage)
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {})

    store.cards = [{ id: 2 }, { id: 1 }, { id: 3 }, { id: 4 }]
    wrapper.vm.checkIfCorrect()

    expect(alertMock).toHaveBeenCalledWith('Die Karten sind nicht korrekt sortiert!')
    alertMock.mockRestore()
  })
})
