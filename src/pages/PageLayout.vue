<template>
  <div>



    <!-- Header -->
    <div>
      <ButtonPress icon="pi pi-home" aria-label="Save" @click="goToHomePage" />
    </div>

    <!-- FieldSet -->
    <FieldSet
      :legend="`${store.selectedCategory} , ${store.selectedMode}`"
      :toggleable="true"
      :collapsed="true"
    >
      <template #toggleicon>
        <span>{{ isExpanded ? '?' : '❓' }}</span>
      </template>
      <p class="m-0" style="white-space: pre-wrap">
        {{ descriptionToAlgorithm[store.selectedCategory] }}
      </p>
    </FieldSet>



    <!-- Score -->
    <div>
      <p>Score: {{ store.score }}</p>
    </div>
    <!-- Dynamic Content -->
    <slot name="content"
          :select-cards="SelectCard"
          :number-of-swaps="this.numberOfSwaps"/>

    <!-- Card Grid
    <div class="card-grid">
      <div v-for="(card, index) in store.cards" :key="card.id" class="card-and-line">
        <FlippedCard @click="SelectCard(index)">
          <template #front>
            <h1></h1>
          </template>
          <template #back>
            <img :src="`./images/${card.id}.png`" />
          </template>
        </FlippedCard>

          <svg class="line" width="50" height="300">
             Linie
            <line v-show="index === 0" x1="25" y1="0" x2="25" y2="300" stroke="red" stroke-width="6" />
          </svg>
      </div>
    </div>
    -->


    <!-- Button Container -->
    <div class="button-container">
      <slot name="extraButtons"
        :swap-cards="SwapCards"
      />
      <ButtonPress label="Starte neu" @click="startOver" />
      <ButtonPress label="misch erneut" @click="shuffel" />
      <ButtonPress label="Beende Spiel" @click="checkIfCorrect" />
    </div>
  </div>
</template>

<script>
import FlippedCard from "@/components/FlippedCard.vue";
import bubbleSortDescription from "@/descriptions/algorithmDescriptions.json";
import errorMessages from "@/descriptions/ErrorMessages.json";
import { store } from '@/store.js'

export default {
  name: "StandardLayout",
  components: {
    FlippedCard,
  },
  props: {
    store: {
      type: Object,
      required: true,
    },
    isExpanded: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      numberOfSwaps: 0,
      selectedCards: [],
      descriptionToAlgorithm: {
        "Bubble Sort": bubbleSortDescription["Bubble Sort"],
        "Selection Sort": bubbleSortDescription["Selection Sort"],
        "Insertion Sort": bubbleSortDescription["Insertion Sort"],
        "Merge Sort": bubbleSortDescription["Merge Sort"],
        "Quick Sort": bubbleSortDescription["Quick Sort"],
      },
    };
  },
  methods: {
    SwapCards() {
      let canSort = true;

      if (store.selectedMode === "Vorgegebenes Sortieren") {
        if (
          store.correctSortingOrder[this.numberOfSwaps].includes(store.selectedCards[0]) &&
          store.correctSortingOrder[this.numberOfSwaps].includes(store.selectedCards[1])
        ) {
          canSort = true;
        } else {
          canSort = false;
        }
      }
      if (store.selectedCards.length === 2 && canSort) {
        const [firstIndex, secondIndex] = store.selectedCards;
        const temp = store.cards[firstIndex];
        store.cards[firstIndex] = store.cards[secondIndex];
        store.cards[secondIndex] = temp;
        this.numberOfSwaps++;
      } else {
        alert(errorMessages["selectTwoCards"]);
      }
    },
    SelectCard(index) {
      if (store.selectedCards.includes(index)) {
        store.selectedCards = store.selectedCards.filter((card) => card !== index);
      } else if (store.selectedCards.length < 2) {
        store.selectedCards.push(index);
        store.score++;
      }
    },
    startOver() {
      if (store.selectedCards.length === 0) {
        store.cards = store.startingCards.slice();
        store.score = 0;
      } else {
        alert(errorMessages["restartError"]);
      }
    },
    shuffel() {
      if (store.selectedCards.length === 0) {
        store.cards = store.cards.sort(() => Math.random() - 0.5);
        store.startingCards = store.cards.slice();
        store.score = 0;
      } else {
        alert(errorMessages["shuffleError"]);
      }
    },
    checkIfCorrect() {
      if (
        store.cards.every(
          (card, index) => card.id === store.correctCards[index].id
        )
      ) {
        this.$router.push("/finishPage");
      } else {
        alert(errorMessages["wrongOrder"]);
      }
    },
    goToHomePage() {
      this.$router.push("/");
      store.selectedCards = [];
    },
    moveSmallerCard() {

    }
  },
};
</script>

<style scoped>


.button-container {
  display: flex;
  justify-content: center;
  gap: 10px;
  font-family: Arial, sans-serif;
  margin-top: 20px;
}



</style>
