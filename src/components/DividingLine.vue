<script setup></script>

<template>
  <svg class="line" width="30" height="300" @click="selectLine()">
    <!-- Linie -->
    <!--kein plan warum aber x=15 wäre nicht mittig-->
    <line
      x1="20"
      y1="0"
      x2="20"
      y2="300"
      :stroke="isSelected ? 'blue' : isDividingLine ? 'green' : 'red'"
      stroke-width="6"
    />
  </svg>
</template>
<script>
import { store } from '../store'
export default {
  setup() {
    return { store } //Setup, damit auf store zugegriffen werden kann
  },
  //werden beim erstellen übergeben im mergesort
  props: {
    containerIndex: Number,
    lineIndex: Number,
  },
  data() {
    //variablen die in der Komponente verwendet werden
    return {
      isSelected: false,
      isDividingLine: false,
    }
  },
  //checked ob diese Linie als Trennlinie Markiert werden muss
  mounted() {
    if (store.dividingContainerPosition === this.containerIndex && store.dividingLinePosition === this.lineIndex) {
      this.isDividingLine = true;
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
    },
    reloadRecolour () {
      if (store.dividingContainerPosition === this.containerIndex && store.dividingLinePosition === this.lineIndex) {
        this.isDividingLine = true;
      }else {
        this.isDividingLine = false;
        this.isSelected = false;
      }
    }
    }
  }
</script>

