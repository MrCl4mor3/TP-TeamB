<script setup></script>

<template>
  <StandardLayout :store="store" :isExpanded="isExpanded">
    <template #cards="{ selectCards2 }">
      <!-- übergibt die benötigten Methoden und variablen -->
      <div>
        <div class="card-grid">
          <div
            v-for="(card, index) in store.cards"
            :key="card.id"
            ref="cardlist"
            class="card-and-line"
          >
            <FlippedCard @click="selectCards2(index)" :card-id="card.id" ref="singlecard">
              <template #front>
                <div class="frontsite"></div>
              </template>
              <template #back>
                <div class="backsite">
                  <div v-html="card.svg.outerHTML"></div>
                </div>
              </template>
            </FlippedCard>

            <svg class="line" width="50" height="300">
              <!-- Linie -->
              <line
                v-show="index === this.numberOfSwaps"
                x1="6"
                y1="0"
                x2="6"
                y2="300"
                stroke="red"
                stroke-width="5"
              />
            </svg>
          </div>
        </div>
      </div>
    </template>
    <template #extraButtons="{}">
      <ButtonPress label="kleiner" icon="pi pi-arrow-left" @click="moveToSmaller" />
      <ButtonPress label="größer" icon="pi pi-arrow-right" @click="moveToBigger" />
      <ButtonPress label="Pivotelement" @click="selectPivot" />
    </template>
  </StandardLayout>
</template>

<script>
import StandardLayout from './PageLayout.vue'
import { store } from '@/store.js'
import FlippedCard from '@/components/FlippedCard.vue'

export default {
  name: 'GamePage',
  components: {
    StandardLayout,
    FlippedCard,
  },
  data() {
    return {
      numberOfSwaps: 0,
      store,
      selectedCard: null,
      pivotElement: null,
      firsttime: true,
      biggerCards: 0,
      smallerCards: 0,
      trueCardRef: [],
      startigCardIds: [],
    }
  },
  methods: {
    selectPivot() {
      //Als erste Aktion muss ein PIvotelement gewählt werden,
      if (this.firsttime) {
        this.firsttime = false;
        store.lookingIndex = 1;
        store.pivotElementIndex = 0;
        this.numberOfSwaps = 0;
        //in der ersten Aktion wird trueCardRef aufgesetzt. Dieser ist nötig damit karten korrekt umrandet werder können,
        //da sich bei vertauschen die Position der Karten verändern, aber die Id gleich bleibt
        for (let i = 0; i < store.cards.length; i++) {
          this.trueCardRef.push(i);
        }
        //für korrektes späteres ändern der Kartenrückseiten wird die die Originalreihenfolge der Karten-ids gespeichert
        const allCards = this.$refs.singlecard;
        // Sichergehen, dass es ein Array von Instanzen ist
        if (Array.isArray(allCards)) {
          allCards.forEach(card => {
            this.startigCardIds.push(card);
          });
        } else {
          alert("UhOh only 1 Card exists, that should never happen");
        }
        //erstes Pivotelement wird aufgedeckt und umrandet
        this.startigCardIds[0].toggleFlip();
        this.$refs.cardlist[this.trueCardRef[0]].firstChild.firstChild.style.border = '2px solid green';
        store.selectedCards.push(0);
        store.score++;
      } else {
        //ist der Teilarray fertig einsortiert
        if (store.lookingIndex >= store.cards.length || store.pivotIndices.includes(store.lookingIndex)){
          //Nicht das erste mal gedrückt, also muss das alte Pivotelement als fertig sortiert gespeichert werden
          store.pivotIndices.push(store.pivotElementIndex);
          this.startigCardIds[this.trueCardRef[store.pivotElementIndex]].colourchange();
          this.$refs.cardlist[this.trueCardRef[store.pivotElementIndex]].firstChild.firstChild.style.border = null;
          //alle Karten werden zugedeckt
          for (let i = 0; i < store.cards.length; i++) {
            if (store.selectedCards.includes(i)){
              this.startigCardIds[this.trueCardRef[i]].toggleFlip();
            }
          }
          store.selectedCards.splice(0);
          //einelementige Teilmengen sind auch schon sortiert, also müssen dementsprechend makiert werden
          if (this.biggerCards === 1) {
            store.pivotIndices.push(store.pivotElementIndex+1);
            this.startigCardIds[this.trueCardRef[store.pivotElementIndex+1]].colourchange();
          }
          if (this.smallerCards === 1) {
            store.pivotIndices.push(store.pivotElementIndex-1);
            this.startigCardIds[this.trueCardRef[store.pivotElementIndex-1]].colourchange();
          }
          let checked = 0;
          //check ob alles schon als sortiert gespeichert wurde
          if (store.pivotIndices.length === store.cards.length) {
            checked = store.cards.length;
          }
          //geht weiter bis zum nächsten Element das noch nicht sortiert wurde oder pivotelement war.
          //Dieses ist dann das linke vom nächsten Abschnitt und damit neues Pivot
          while (store.pivotIndices.length < store.cards.length && checked < store.cards.length) {
            //falls am ende angekommen muss an den anfang gesprungen werden
            if (store.lookingIndex >= store.cards.length) {
              store.lookingIndex = 0;
            }
            if (!store.pivotIndices.includes(store.lookingIndex)) {
              store.pivotElementIndex = store.lookingIndex;

              //neues Pivot wird makiert
              this.startigCardIds[this.trueCardRef[store.pivotElementIndex]].toggleFlip();
              this.$refs.cardlist[this.trueCardRef[store.pivotElementIndex]].firstChild.firstChild.style.border = '2px solid green';
              store.selectedCards.push(store.pivotElementIndex);

              this.numberOfSwaps = store.lookingIndex;
              this.biggerCards = 0;
              this.smallerCards = 0;
              checked = store.cards.length;
            }
            store.lookingIndex++;
            checked ++;
          }
        } else {
          alert("Der aktuelle Teil ist noch nicht fertig eingeordnet");
        }
        store.score++;
      }
    },
    //das Element muss nach links vom Pivotelement getauscht werden
    moveToSmaller() {
      if (this.firsttime) {
        alert("Zum starten auf Pivotelement klicken")
      } else {
        if (store.selectedCards.length === 2) {
          //tausch von Pivotelement und kleinerem Element
          let swapid = store.lookingIndex;
          const temp = store.cards[swapid];
          store.cards[swapid] = store.cards[store.pivotElementIndex];
          store.cards[store.pivotElementIndex] = temp;
          //updaten der trueCardRef nach vertauschen von elementen
          let tempref = this.trueCardRef[swapid];
          this.trueCardRef[swapid] = this.trueCardRef[store.pivotElementIndex];
          this.trueCardRef[store.pivotElementIndex] = tempref;

          //automatisches Zudecken der Karte
          this.startigCardIds[this.trueCardRef[store.pivotElementIndex]].toggleFlip();
          store.selectedCards = store.selectedCards.filter((card) => card !== store.pivotElementIndex);

          store.pivotElementIndex = swapid;
          //alle Karten die größer als das Pivot gemerkt sind müssen wieder nach rechts getauscht werden
          if (this.biggerCards > 0) {
            for (let i = 0; i < this.biggerCards; i++) {
              const temp = store.cards[swapid];
              store.cards[swapid] = store.cards[swapid - 1];
              store.cards[swapid - 1] = temp;

              //updaten der trueCardRef nach vertauschen von elementen
              let tempref = this.trueCardRef[swapid];
              this.trueCardRef[swapid] = this.trueCardRef[swapid - 1];
              this.trueCardRef[swapid - 1] = tempref;

              store.pivotElementIndex = swapid - 1;
              swapid--;
            }
            //damit die korrekten Karten als aufgedeckt gespeichert sind
            store.selectedCards = store.selectedCards.filter((card) => card !== store.lookingIndex);
            store.selectedCards.push(swapid);
          }
          this.smallerCards++;
          store.lookingIndex++;
          this.numberOfSwaps++;
        } else {
          alert("select one non-pivot Card");
        }
      }
    },
    //wenn sie größer ist muss sich nur gemerkt werden wie viele in dem "Bigger" teil sind, keine Vertauschung notwendig
    moveToBigger() {
      if (this.firsttime) {
        alert("Zum starten auf Pivotelement klicken")
      } else {
        if (store.selectedCards.length === 2) {
          this.biggerCards++;
          //automatisches Zudecken der Karte
          this.startigCardIds[this.trueCardRef[store.lookingIndex]].toggleFlip();
          store.selectedCards = store.selectedCards.filter((card) => card !== store.lookingIndex);

          store.lookingIndex++;
          this.numberOfSwaps++;
        } else {
          alert("select one non-pivot Card");
        }
      }
    },
  },
}
</script>


<style scoped>
.card-and-line {
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-grid {
  margin-left: 24px;
}

</style>
