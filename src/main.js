import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'

import InputNumber from 'primevue/inputnumber'
import Button from 'primevue/button'
import Fieldset from 'primevue/fieldset'
import '@/assets/styles/global.css'
import '@/assets/styles/homePage.css'

const app = createApp(App)
app.use(PrimeVue, {
  // PrimeVue aktivieren
  theme: {
    preset: Aura,
  },
})
app.use(router)
app.mount('#app')
app.component('ButtonPress', Button) // Button-Komponente registrieren
app.component('InputNumber', InputNumber) // InputNumber-Komponente registrieren
app.component('FieldSet', Fieldset)
