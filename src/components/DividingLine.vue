<script setup>

</script>

<template>
  <svg class="line" width="50" height="300" @click="selectLine()">
    <!-- Linie -->
    <line
      x1="25"
      y1="0"
      x2="25"
      y2="300"

      :stroke="isSelected ? 'red' : 'grey'"

      stroke-width="6"
      :visibility="isSelected ? 'visible' : 'hidden'"
    />
  </svg>
</template>
<script>
import { store } from '../store'
export default {
  setup() {
    return { store } //Setup, damit auf store zugegriffen werden kann
  },
  data() {
    //variablen die in der Komponente verwendet werden
    return {
      isSelected: false,
      isDividingLine: false,
    }
  },
  methods: {
    selectLine() {
      if(this.isSelected) {
        this.isSelected = false
        store.selectedLines--
      } else if(!this.isSelected && store.selectedLines === 0) {
        store.selectedLines++
        this.isSelected = true
      }
    }

    }
  }

</script>

<style scoped>
</style>
