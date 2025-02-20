import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import App from '@/App.vue'
import { createRouter, createWebHistory } from 'vue-router'

// Dummy-Komponente für den Router
const TestComponent = { template: '<div>Test</div>' }

// Router mit einer Test-Route
const router = createRouter({
  history: createWebHistory(),
  routes: [{ path: '/', component: TestComponent }],
})

describe('App.vue', () => {
  it('rendert die Router-View korrekt', async () => {
    router.push('/') // Route setzen
    await router.isReady() // Warten, bis Router geladen ist

    const wrapper = mount(App, {
      global: { plugins: [router] },
    })

    expect(wrapper.findComponent(TestComponent).exists()).toBe(true)
  })
})
