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

  // Test für checkHover
  it('should show tooltip when hover and 2 cards are flipped', async () => {
    store.numberOfFlippedCards = 2

    // Über die Karte "hovern"
    await wrapper.trigger('mouseover')

    // Teste showTooltip.value
    expect(wrapper.vm.showTooltip.value).toBe(true)
  })

  it('should hide tooltip when hover is removed', async () => {
    wrapper.vm.showTooltip.value = true

    // Entferne den "hover" durch ein "mouseout"
    await wrapper.trigger('mouseout')

    // Teste showTooltip.value
    expect(wrapper.vm.showTooltip.value).toBe(false)
  })

  // Test für changeColour
  it('should change the colour of the card when changeColour is called', () => {
    expect(wrapper.vm.colour).toBe('#10b981')  // Anfangszustand ist grün
    wrapper.vm.changeColour()
    expect(wrapper.vm.colour).toBe('grey')  // Nach dem Aufruf sollte die Farbe grau sein

    wrapper.vm.changeColour()
    expect(wrapper.vm.colour).toBe('#10b981')  // Nach einem weiteren Aufruf sollte sie wieder grün sein
  })
})
