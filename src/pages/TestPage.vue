<template>
  <div>
    <ButtonPress icon="pi pi-home" aria-label="Save" @click="goToHomePage" />
  </div>

  <div class="header">
    <h1>TestPage</h1>
  </div>
    <!-- Container für die geladene SVG -->
    <div id="svg-container" v-html="svgContent"></div>

</template>

<script setup>
import { ref, onMounted } from 'vue'
import cardSVG from '@/assets/card.svg'

const svgContainer = ref(null)
const svgContent = ref('')

onMounted(async () => {
  try {
    // SVG-Datei laden
    const response = await fetch(cardSVG)
    if (!response.ok) {
      throw new Error('SVG konnte nicht geladen werden')
    }
    const svgText = await response.text()

    // SVG-Inhalt in die ref speichern
    svgContent.value = svgText
  } catch (error) {
    console.error('Fehler beim Laden der SVG:', error)
  }
})
</script>

<script>
import 'primeicons/primeicons.css'
export default {
  setup() {
    return { store }
  },
  methods: {
    goToHomePage() {
      this.$router.push('/')
    },
  },
}
</script>

<style scoped>
/* Stil für das dynamisch geladene SVG */
#svg-container {
  width: 200px;
  height: 200px;
  margin-top: 20px;
}

#svg-container svg {
  width: 100%;
  height: 100%;
}

.header {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
  font-family: Arial, sans-serif;
  font-size: 24px;
}
</style>
