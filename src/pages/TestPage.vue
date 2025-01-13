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
import { onMounted } from 'vue'
import { svgLoader} from "@/setupCards.js";

const { svgContent, loadSvg } = svgLoader()
onMounted(async () => { loadSvg() })
</script>

<script>
export default {

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
