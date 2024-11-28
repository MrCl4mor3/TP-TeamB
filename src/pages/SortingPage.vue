

<template>
  <div class="card-grid">
    <!-- Hier wird für jede Karte ein FlippedCard erstellt -->
    <div v-for="(card, index) in store.cards" :key="card.id">
      <FlippedCard @click="SelectCard(index)">
        <template #front>
          <!--<h1>Vorderseite {{ card.value }}</h1> -->  <!-- zum testen wird VOrderseite beschriftet-->
          <h1></h1>
        </template>
        <template #back>
          <h1>Rückseite {{ card.value }}</h1>
        </template>
      </FlippedCard>
    </div>
  </div>
  <!-- Hier werden die Buttons für die Funktionen des Spiels erstellt -->
  <div>
    <ButtonPress label="Vertausch" @click="SwapCards" />
    <ButtonPress label="Starte neu" @click="startOver" />
    <ButtonPress label="misch erneut" @click="shuffel" />
    <ButtonPress label="Beende Spiel" @click="checkIfCorrect" />
  </div>
</template>

<script>
import FlippedCard from "@/components/FlippedCard.vue";
import { store } from '../store';
export default {
  data() {
    return {
      selectedCards: [],
      firstCard: null,
      secondCard: null,
    };
  },
  components: {
    FlippedCard,
  },
  setup() {
    return {store};
  },
  methods: {
    // Tausche die Positionen der beiden Karten im Store wenn zwei Karten ausgewählt wurden
    SwapCards() {
      if (this.selectedCards.length === 2) {
        const [firstIndex, secondIndex] = this.selectedCards;
        const temp = store.cards[firstIndex];
        store.cards[firstIndex] = store.cards[secondIndex];
        store.cards[secondIndex] = temp;

      } else {
        alert("Wähle genau zwei Karten zum Tauschen aus.");
      }
    },
    // Methode um die Karte auszuwählen, heirbei wird die Karte aus dem Array der ausgewählten
    // Karten entfernt wenn sie schon ausgewählt wurde, ansonsten wird sie hinzugefügt
    SelectCard(index) {
      if (this.selectedCards.includes(index)) {
        this.selectedCards = this.selectedCards.filter((card) => card !== index);
      } else if (this.selectedCards.length < 2) {
        this.selectedCards.push(index);
      }
    },
    startOver() {
      if(this.selectedCards.length === 0) {
        store.cards = store.startingCards.slice();
      }
      else {
        alert("du darfst keine Karten ausgewählt haben wenn du mischst")
      }
    },
    shuffel() {
      if (this.selectedCards.length === 0) {
        store.cards = store.cards.sort(() => Math.random() - 0.5);
        store.startingCards = store.cards.slice();
      }
      else {
        alert("du darfst keine Karten ausgewählt haben wenn du mischst")
      }
    },
    //Kontrolliert ob die Karten grade gleich angeordent sind wie die korrekten Karten
    checkIfCorrect() {
      if (store.cards.every((card, index) => card.id === store.correctCards[index].id)) {
        alert("Korrekt sortiert!");
      } else {
        alert("Falsch sortiert!");
      }
    },
  }

};
</script>
<style>
/*Hier wird definiert wie die Karten angeordnet werden sollen*/
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  justify-items: center;
}
</style>
