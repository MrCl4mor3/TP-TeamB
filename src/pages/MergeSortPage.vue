<script setup>
import DividingLine from '@/components/DividingLine.vue'

import { ref } from 'vue'

const draggedIndex = ref(null)

function dragStart(index) {
  draggedIndex.value = index
}

function drop(targetIndex) {
  if (store.numberOfFlippedCards === 0) {
    if (draggedIndex.value !== null && draggedIndex.value !== targetIndex) {
      const draggedContainer = store.containers[draggedIndex.value]
      store.containers[targetIndex] = [...store.containers[targetIndex], ...draggedContainer]
      store.containers.splice(draggedIndex.value, 1)
      draggedIndex.value = null
    }
  } else {
    alert('Karten müssen umgedreht sein')
  }
}
</script>

<template>
  <StandardLayout :store="store" :isExpanded="isExpanded">
    <template #cards>
      <!-- übergibt die benötigten Methoden und variablen -->
      <div class="grid-grids">
        <div
          v-for="(container, containerIndex) in store.containers"
          :key="containerIndex"
          class="container-and-line"
          draggable="true"
          @dragstart="
            dragStart(containerIndex);
            dragging(containerIndex)
          "
          @dragover.prevent
          @drop="
            drop(containerIndex);
            dividingMark(containerIndex)
          "
        >
          <div class="card-grid">
            <div v-for="(card, index) in container" :key="card.id" class="card-and-line">
              <FlippedCard
                :card-id="card.id"
                :ref="'flippedCard'"
                @click="selectCardsInContainer(containerIndex, index)"
              >
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
              <DividingLine
                :container-index=containerIndex
                :line-index=index
                v-if="index < container.length - 1"
                @click="selectALine(containerIndex, index)"
                ref="linie"
              />
            </div>
          </div>
        </div>
      </div>
    </template>
    <template #extraButtons>
      <ButtonPress label="vertauschen" @click="canSwapInContainer" />
      <ButtonPress label="split" @click="splitContainer" />
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
      draggedContainersize: 0,
    }
  },
  methods: {
    //Kartenaufdecken, mit check das nur Karten aus einem Container aufgedeckt werden dürfen
    selectCardsInContainer(containerIndex,cardIndex) {
      if(this.selectedCards.length === 0) {
        store.currentSelectedContainer = containerIndex
      }
      if(store.currentSelectedContainer === null || store.currentSelectedContainer === containerIndex) {
        store.currentSelectedContainer = containerIndex
        if (this.selectedCards.includes(cardIndex)) {
          this.selectedCards = this.selectedCards.filter((card) => card !== cardIndex)  //nach entfernen des container index hinzufügen
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
    //TODO canSort? sicher das diese methode voll funktionsfähig ist?
    canSwapInContainer() {
      const canSort = true

      if (this.selectedCards.length === 2 ) {
        console.log("test 2")
        const [firstIndex, secondIndex] = this.selectedCards
        const temp = store.containers[store.currentSelectedContainer][firstIndex]
        store.containers[store.currentSelectedContainer][firstIndex] = store.containers[store.currentSelectedContainer][secondIndex]
        store.containers[store.currentSelectedContainer][secondIndex] = temp
        this.numberOfSwaps++
      } else {
        alert(errorMessages['wrongAlgorithmStep'])
      }

    },
    //die Länge des gezogenen Containers muss gespeichert werden
    dragging(draggedContainer) {
      this.draggedContainersize = store.containers[draggedContainer].length;
    },
    //hier wird die Position der Linie gespeichert, die genau da ist wo die zwei fusionierten Container aufeinader treffen
    dividingMark(targetContainer) {
      //reset um von allen anderen Linien die Markierung wegzumachen
      store.dividingLinePosition = -1;
      store.dividingContainerPosition = -1;
      store.dividingLinePosition = store.containers[targetContainer].length-this.draggedContainersize-1;
      store.dividingContainerPosition = targetContainer;
      alert("container pos:"+targetContainer + " -- line pos:"+store.dividingLinePosition);

    },
    //Auswählen der Linie, festhalten der Position für den split
    selectALine(containerIndex, index) {
      if(store.selectedLines !== 0) {
        this.linePositionContainer = containerIndex
        this.linePositionCard = index
      } else {
        this.linePositionContainer = null
        this.linePositionCard = null
      }
    },
    //Splittet den Container an der gemerkten Position
    splitContainer() {
      const containerToSplit = store.containers[this.linePositionContainer]

      const firstHalf = containerToSplit.slice(0, this.linePositionCard + 1)
      const secondHalf = containerToSplit.slice(this.linePositionCard + 1)

      store.containers.splice(this.linePositionContainer, 1, firstHalf, secondHalf)
      store.selectedLines = 0;
      this.flipAllCards();
    },
    //dreht alle Karten um
    flipAllCards() {
      const allCards = this.$refs.flippedCard;

      // Prüfen, ob es ein Array von Instanzen ist (bei v-for)
      if (Array.isArray(allCards)) {
        allCards.forEach(card => {
          card.isFlipped = false;  // Setze jede Karte auf geflippt
        });
      } else if (allCards) {
        allCards.isFlipped = false;  // Falls es nur eine Instanz ist
      }
      store.numberOfFlippedCards = 0;
      store.currentSelectedContainer = null;
    }
  },
}
</script>

<style scoped>
.card-grid {
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
