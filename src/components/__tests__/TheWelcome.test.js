import { mount } from '@vue/test-utils'
import TheWelcome from '../TheWelcome.vue'
import WelcomeItem from '../WelcomeItem.vue'
import { describe, it, afterEach, expect, beforeEach } from 'vitest'


describe('TheWelcome.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(TheWelcome)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('renders all WelcomeItem components', () => {
    const items = wrapper.findAllComponents(WelcomeItem)
    expect(items.length).toBe(5) // Es gibt 5 WelcomeItem-Komponenten
  })

  it('renders the correct headings for each WelcomeItem', () => {
    const headings = wrapper.findAll('template[slot="heading"]')
    const expectedHeadings = [
      'Documentation',
      'Tooling',
      'Ecosystem',
      'Community',
      'Support Vue',
    ]

    headings.forEach((heading, index) => {
      expect(heading.text()).toBe(expectedHeadings[index])
    })
  })

  it('renders the correct icons in the WelcomeItem slots', () => {
    const icons = [
      'DocumentationIcon',
      'ToolingIcon',
      'EcosystemIcon',
      'CommunityIcon',
      'SupportIcon',
    ]

    icons.forEach((icon) => {
      const iconComponent = wrapper.findComponent({ name: icon })
      expect(iconComponent.exists()).toBe(true)
    })
  })

  it('renders the correct links in the content', () => {
    const links = wrapper.findAll('a')
    const expectedLinks = [
      'https://vuejs.org/',
      'https://vite.dev/guide/features.html',
      'https://code.visualstudio.com/',
      'https://github.com/johnsoncodehk/volar',
      'https://www.cypress.io/',
      'https://on.cypress.io/component',
      'https://pinia.vuejs.org/',
      'https://router.vuejs.org/',
      'https://test-utils.vuejs.org/',
      'https://github.com/vuejs/devtools',
      'https://github.com/vuejs/awesome-vue',
      'https://chat.vuejs.org',
      'https://stackoverflow.com/questions/tagged/vue.js',
      'https://news.vuejs.org',
      'https://twitter.com/vuejs',
      'https://vuejs.org/sponsor/',
    ]

    links.forEach((link, index) => {
      expect(link.attributes('href')).toBe(expectedLinks[index])
    })
  })

  it('ensures all links have proper attributes', () => {
    const links = wrapper.findAll('a')
    links.forEach((link) => {
      expect(link.attributes('target')).toBe('_blank')
      expect(link.attributes('rel')).toBe('noopener')
    })
  })
})
