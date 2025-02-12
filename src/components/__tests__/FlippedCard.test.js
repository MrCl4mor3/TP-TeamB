import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import FlippedCard from '../FlippedCard.vue'
import { store } from '../../store'

describe('FlippedCard Component', () => {
  let wrapper

  beforeEach(() => {
    // Store zurücksetzen vor jedem Test
    store.numberOfFlippedCards = 0
    wrapper = mount(FlippedCard, {
      global: {
        provide: {
          store,
        },
      },
    })
  })

  it('should flip the card when clicked and less than 2 cards are flipped', async () => {
    expect(wrapper.vm.isFlipped).toBe(false)
    expect(store.numberOfFlippedCards).toBe(0)

    await wrapper.vm.toggleFlip()

    expect(wrapper.vm.isFlipped).toBe(true)
    expect(store.numberOfFlippedCards).toBe(1)
  })

  it('should not flip the card if 2 cards are already flipped', async () => {
    store.numberOfFlippedCards = 2

    expect(wrapper.vm.isFlipped).toBe(false)
    await wrapper.vm.toggleFlip()

    // Zustand bleibt unverändert
    expect(wrapper.vm.isFlipped).toBe(false)
    expect(store.numberOfFlippedCards).toBe(2)
  })

  it('should unflip the card and decrease the flipped count', async () => {
    wrapper.vm.isFlipped = true
    store.numberOfFlippedCards = 1

    await wrapper.vm.toggleFlip()

    expect(wrapper.vm.isFlipped).toBe(false)
    expect(store.numberOfFlippedCards).toBe(0)
  })

  it('should handle consecutive flips correctly', async () => {
    expect(wrapper.vm.isFlipped).toBe(false)
    expect(store.numberOfFlippedCards).toBe(0)

    // Flip die Karte
    await wrapper.vm.toggleFlip()
    expect(wrapper.vm.isFlipped).toBe(true)
    expect(store.numberOfFlippedCards).toBe(1)

    // Unflip die Karte
    await wrapper.vm.toggleFlip()
    expect(wrapper.vm.isFlipped).toBe(false)
    expect(store.numberOfFlippedCards).toBe(0)
  })

  it('should open the card when openCard() is called', () => {
    expect(wrapper.vm.isFlipped).toBe(false)
    wrapper.vm.openCard()
    expect(wrapper.vm.isFlipped).toBe(true)
  })

  it('should close the card when closeCard() is called', () => {
    wrapper.vm.isFlipped = true
    wrapper.vm.closeCard()
    expect(wrapper.vm.isFlipped).toBe(false)
  })

  it('should toggle the card colour when colourchange() is called', () => {
    expect(wrapper.vm.colour).toBe('#10b981')

    wrapper.vm.colourchange()
    expect(wrapper.vm.colour).toBe('grey')

    wrapper.vm.colourchange()
    expect(wrapper.vm.colour).toBe('#10b981')
  })
})
