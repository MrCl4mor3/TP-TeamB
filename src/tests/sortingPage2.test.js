import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import SortingPage2 from '@/pages/SortingPage2.vue'
import FlippedCard from '@/components/FlippedCard.vue'
import { store } from '../store'

// Mock für Vue Router
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}))

describe('SortingPage2.vue', () => {
  beforeEach(() => {
    // Store zurücksetzen
    store.numberOfFlippedCards = 0
    store.score = 0
    store.cards = [
      { id: 1, svg: document.createElementNS('http://www.w3.org/2000/svg', 'svg') },
      { id: 2, svg: document.createElementNS('http://www.w3.org/2000/svg', 'svg') },
      { id: 3, svg: document.createElementNS('http://www.w3.org/2000/svg', 'svg') },
      { id: 4, svg: document.createElementNS('http://www.w3.org/2000/svg', 'svg') }
    ]

    store.startingCards = store.cards.slice()
    store.correctCards = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }]
  })

  it('renders the correct number of cards', () => {
    const wrapper = mount(SortingPage2)
    const cards = wrapper.findAllComponents(FlippedCard)
    expect(cards.length).toBe(store.cards.length)
  })

  it('updates score when a card is selected', async () => {
    const wrapper = mount(SortingPage2)
    const firstCard = wrapper.findAllComponents(FlippedCard).at(0)

    await firstCard.trigger('click')
    expect(store.score).toBe(1)
  })

  it('renders FlippedCard components correctly', () => {
    const wrapper = mount(SortingPage2)
    const flippedCards = wrapper.findAllComponents(FlippedCard)

    expect(flippedCards.length).toBe(store.cards.length)
    flippedCards.forEach((cardWrapper, index) => {
      expect(cardWrapper.html()).toContain(store.cards[index].svg.outerHTML)
    })
  })

  it('triggers selectCards when a card is clicked', async () => {
    const selectCardsMock = vi.fn()

    const wrapper = mount(SortingPage2, {
      global: {
        stubs: {
          StandardLayout: {
            template: '<div><slot name="cards" :selectCards="selectCards"></slot></div>',
            props: ['selectCards'],
          }
        }
      },
      props: {
        selectCards: selectCardsMock
      }
    })

    const firstCard = wrapper.findComponent(FlippedCard)
    await firstCard.trigger('click')

    expect(selectCardsMock).toHaveBeenCalled()
  })

/*
  it('calls swapCards when swap button is clicked', async () => {
    const swapCardsMock = vi.fn()
    const wrapper = mount(SortingPage2, {
      slots: {
        extraButtons: { swapCards: swapCardsMock }
      }
    })

    const button = wrapper.findComponent({ name: 'ButtonPress' })
    await button.trigger('click')

    expect(swapCardsMock).toHaveBeenCalled()
  })
*/

  it('resets store state when component is mounted', () => {
    mount(SortingPage2)

    expect(store.numberOfFlippedCards).toBe(0)
    expect(store.score).toBe(0)
    expect(store.cards).toEqual(store.startingCards)
  })

})
