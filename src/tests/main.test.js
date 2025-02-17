import { describe, it, expect, vi } from 'vitest'
import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/router'
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'

import InputNumber from 'primevue/inputnumber'
import Button from 'primevue/button'
import Fieldset from 'primevue/fieldset'
import SplitButton from 'primevue/splitbutton'
import ToastService from 'primevue/toastservice'

import '@/assets/global.css'
import 'primeicons/primeicons.css'
import '@/main.js'

describe('Main.js App Setup', () => {
  it('erstellt und mountet die Vue App erfolgreich', () => {
    const app = createApp(App)

    // Mocking `mount`
    app.mount = vi.fn()

    app.use(PrimeVue, { theme: { preset: Aura } })
    app.use(router)
    app.use(ToastService)

    app.component('ButtonPress', Button)
    app.component('InputNumber', InputNumber)
    app.component('FieldSet', Fieldset)
    app.component('SplitButton', SplitButton)

    // App sollte korrekt gemountet werden
    app.mount('#app')
    expect(app.mount).toHaveBeenCalledWith('#app')
    expect(app._context.components['ButtonPress']).toBeDefined()
    expect(app._context.components['InputNumber']).toBeDefined()
    expect(app._context.app).toBeDefined()

  })
})
