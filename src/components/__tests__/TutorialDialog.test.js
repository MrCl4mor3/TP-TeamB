import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import TutorialDialog from '../TutorialDialog.vue'
import { generateCards } from '@/cardSetup.js'

vi.mock('@/store.js', () => ({
  store: {
    correctCards: [
      { svg: { outerHTML: '<svg>small</svg>' } },
      { svg: { outerHTML: '<svg>big</svg>' } },
    ],
  },
}))

vi.mock('@/cardSetup.js', () => ({
  generateCards: vi.fn(),
}))

describe('TutorialDialog.vue', () => {
  it('mounts and renders the dialog content', () => {
    const wrapper = mount(TutorialDialog)
    expect(wrapper.text()).toContain('Willkommen bei SortLab!')
  })

  it('calls generateCards on mount', () => {
    mount(TutorialDialog)
    expect(generateCards).toHaveBeenCalledWith('bubble-sort', 'free-sort', 4, false)
  })

  it('renders example cards correctly', () => {
    const wrapper = mount(TutorialDialog)
    const exampleCards = wrapper.findAll('.example-card')
    expect(exampleCards).toHaveLength(2)
    expect(exampleCards[0].html()).toContain('<svg>small</svg>')
    expect(exampleCards[1].html()).toContain('<svg>big</svg>')
  })
})
