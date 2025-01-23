<template>
  <div>

    <div>
      <ButtonPress icon="pi pi-home" aria-label="Save" @click="goToHomePage" />
    </div>

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




    <div>
      <p>Score: {{ store.score }}</p>
    </div>
    <!-- hier werden die Karten in den einzelnen Seiten hinzugefügt -->
    <slot name="cards"
          :select-cards="SelectCard"
          :number-of-swaps="this.numberOfSwaps"/>

    <!-- hier werden die zusätzlichen Knöpfe hinzugefügt -->
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
import bubbleSortDescription from "@/descriptions/algorithmDescriptions.json";
import errorMessages from "@/descriptions/ErrorMessages.json";
import { store } from '@/store.js'

export default {
  name: "StandardLayout",
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
      console.log(store.selectedMode);
      let canSort = true;

      if (store.selectedMode === "Vorgegebenes Sortieren") {
        canSort = !!(store.correctSortingOrder[this.numberOfSwaps].includes(store.selectedCards[0]) &&
          store.correctSortingOrder[this.numberOfSwaps].includes(store.selectedCards[1]));
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
