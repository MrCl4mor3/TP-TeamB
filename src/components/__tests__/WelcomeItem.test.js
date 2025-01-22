import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import WelcomeItem from '../WelcomeItem.vue'

describe('WelcomeItem.vue', () => {
  it('renders slots correctly', () => {
    const wrapper = mount(WelcomeItem, {
      slots: {
        icon: '<span class="test-icon">Icon Content</span>',
        heading: 'Test Heading',
        default: 'Default Slot Content',
      },
    })

    // Prüfen, ob der Icon-Slot gerendert wird
    expect(wrapper.find('.test-icon').exists()).toBe(true)
    expect(wrapper.find('.test-icon').text()).toBe('Icon Content')

    // Prüfen, ob der Heading-Slot gerendert wird
    expect(wrapper.find('h3').exists()).toBe(true)
    expect(wrapper.find('h3').text()).toBe('Test Heading')

    // Prüfen, ob der Default-Slot gerendert wird
    expect(wrapper.find('.details').text()).toContain('Default Slot Content')
  })

  it('has the correct structure and classes', () => {
    const wrapper = mount(WelcomeItem, {
      slots: {
        icon: '<span class="test-icon">Icon Content</span>',
        heading: 'Test Heading',
        default: 'Default Slot Content',
      },
    })

    // Überprüfen, ob die Root-Elementklasse korrekt ist
    expect(wrapper.classes()).toContain('item')

    // Überprüfen, ob die Details-Klasse vorhanden ist
    expect(wrapper.find('.details').exists()).toBe(true)
  })
})
