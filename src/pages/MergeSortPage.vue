<script setup>

import DividingLine from '@/components/DividingLine.vue'

import { ref } from 'vue'


const draggedIndex = ref(null)

function dragStart(index) {
  draggedIndex.value = index
}

function drop(targetIndex) {
  if (draggedIndex.value !== null && draggedIndex.value !== targetIndex) {
    // Hole den gezogenen Container
    const draggedContainer = store.containers[draggedIndex.value]

    // Füge alle Karten zum Ziel-Container hinzu
    store.containers[targetIndex] = [...store.containers[targetIndex], ...draggedContainer]

    // Entferne den alten, leeren Container
    store.containers.splice(draggedIndex.value, 1)

    // Reset
    draggedIndex.value = null

  }
}
</script>

<template>
  <StandardLayout :store="store" :isExpanded="isExpanded">
    <template #cards="{ selectCards}">
      <!-- übergibt die benötigten Methoden und variablen -->

        <div class="grid-grids">
          <div v-for="(container, containerIndex) in store.containers" :key="containerIndex" class="container-and-line"
               draggable="true"
               @dragstart="dragStart(containerIndex)"
               @dragover.prevent
               @drop="drop(containerIndex)">
            <div class="card-grid">
              <div v-for="(card, index) in container" :key="card.id" class="card-and-line">
            <FlippedCard @click="selectCardsInContainer(containerIndex, index)">
              <template #front>
                <div class="frontsite">
                  <h1>{{ card.id }}</h1>
                </div>
              </template>
              <template #back>
                <div class="backsite">
                  <div v-html="card.svg.outerHTML"></div>
                </div>
              </template>
            </FlippedCard>
            <DividingLine v-if="index < container.length - 1" @click="selectLine(containerIndex, index)" />
          </div>
        </div>
            <DividingLine v-if="(containerIndex < store.containers.length - 1) && (store.containers.length === store.cards.length)" @click="selectLine(containerIndex, index)" />
        </div>
      </div>
    </template>
    <template #extraButtons="{ swapCards }">
      <ButtonPress label="vertauschen" @click="canSwapInContainer" />
      <ButtonPress label="split" @click="splitContainer" />


      <p>container{{this.selectedContainerIndex}}</p>
      <p>{{store.cards.length}}</p>
      <P> {{this.selectedCards.length}}</P>
    </template>
  </StandardLayout>
</template>

<script>
import StandardLayout from './PageLayout.vue'
import { store } from '@/store.js'
import FlippedCard from '@/components/FlippedCard.vue'
import errorMessages from '@/descriptions/errorMessages.json'

export default {
  components: {
    StandardLayout,
    FlippedCard,
  },
  data() {
    return {
      store,
      linePositionContainer: null,
      linePositionCard: null,
      selectedContainerIndex: null,
      selectedCards: [],
    }
  },
  methods: {
    selectCardsInContainer(containerIndex,cardIndex) {
      if(this.selectedCards.length === 0) {
        this.selectedContainerIndex = containerIndex
      }
      if(this.selectedContainerIndex === null || this.selectedContainerIndex === containerIndex) {
        this.selectedContainerIndex = containerIndex
        if (this.selectedCards.includes(cardIndex)) {
          this.selectedCards = this.selectedCards.filter((card) => card !== cardIndex)  //ncoh entfernen des container index hinzufügen
        } else if (this.selectedCards.length < 2) {
          this.selectedCards.push(cardIndex)
          store.score++
        }
      } else {
        store.allowedToFlip = false
        console.log('mergesort')
        alert("falscher Container")
      }
    },
    canSwapInContainer() {
      const canSort = true

      if (this.selectedCards.length === 2 ) {
        console.log("test 2")
        const [firstIndex, secondIndex] = this.selectedCards
        const temp = store.containers[this.selectedContainerIndex][firstIndex]
        store.containers[this.selectedContainerIndex][firstIndex] = store.containers[this.selectedContainerIndex][secondIndex]
        store.containers[this.selectedContainerIndex][secondIndex] = temp
        this.numberOfSwaps++
      } else {
        alert(errorMessages['wrongAlgorithmStep'])
      }

    },
    selectLine(containerIndex, index) {
      if(store.selectedLines !== 0) {
        this.linePositionContainer = containerIndex
        this.linePositionCard = index
      } else {
        this.linePositionContainer = null
        this.linePositionCard = null
      }
    },
    splitContainer() {
      const containerToSplit = store.containers[this.linePositionContainer]

      const firstHalf = containerToSplit.slice(0, this.linePositionCard + 1)
      const secondHalf = containerToSplit.slice(this.linePositionCard + 1)

      store.containers.splice(this.linePositionContainer, 1, firstHalf, secondHalf)
      store.selectedLines = 0;
    },
  },
}
</script>
<style scoped>
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  justify-items: center;
  font-family: Arial, sans-serif;
  border: 4px solid mediumvioletred; /* Fügt eine weiße Umrandung hinzu */
  padding: 10px; /* Abstand zwischen Inhalt und Rahmen */
  margin-bottom: 20px; /* Abstand zwischen einzelnen Grids */
  border-radius: 10px; /* Optional: Abgerundete Ecken */
  width: max-content;
  max-width: 100%;
}
.card-and-line {
  display: flex;
  align-items: center;
  justify-content: center;
}
.container-and-line {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>

