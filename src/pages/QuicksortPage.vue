<script setup></script>

<template>
  <StandardLayout
    :store="store"
    :isExpanded="isExpanded"
  >
    <template #cards="{ selectCards2 }">
      <!-- übergibt die benötigten Methoden und variablen -->
      <div>
        <div class="card-grid">
          <div v-for="(card, index) in store.cards" :key="card.id" ref="cardlist" class="card-and-line">
            <FlippedCard @click="selectCards2(index)" ref="singlecard">
              <template #front>
                <div class="frontsite">
                </div>
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
    <template #extraButtons="{ }">
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
      trueCardRef: []
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
        //erstes Pivotelement wird aufgedeckt und umrandet
        document.getElementsByClassName('card-container')[0].__vueParentComponent.ctx.toggleFlip();
        this.$refs.cardlist[this.trueCardRef[0]].firstChild.firstChild.style.border = '2px solid blue';
        store.selectedCards.push(0);

      } else {
        if (store.lookingIndex >= store.cards.length || store.pivotIndices.includes(store.lookingIndex+1)){
          alert("zugelassen");
        } else {
          alert("nope");
        }
        //Nicht das erste mal gedrückt, also muss das alte Pivotelement als fertig sortiert gespeichert werden
        store.pivotIndices.push(store.pivotElementIndex);
        //alle Karten werden zugedeckt
        for (let i = 0; i < store.cards.length; i++) {
          if (store.selectedCards.includes(i)){
            document.getElementsByClassName('card-container')[i].__vueParentComponent.ctx.toggleFlip();
          }
        }
        store.selectedCards.splice(0);
        //einelementige Teilmengen sind auch schon sortiert, also müssen dementsprechend makiert werden
        if (this.biggerCards === 1) {
          store.pivotIndices.push(store.pivotElementIndex+1);
          this.$refs.cardlist[this.trueCardRef[store.pivotElementIndex+1]].firstChild.firstChild.style.border = '2px solid blue';
        }
        if (this.smallerCards === 1) {
          store.pivotIndices.push(store.pivotElementIndex-1);
          this.$refs.cardlist[this.trueCardRef[store.pivotElementIndex-1]].firstChild.firstChild.style.border = '2px solid blue';
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
            document.getElementsByClassName('card-container')[store.pivotElementIndex].__vueParentComponent.ctx.toggleFlip();
            this.$refs.cardlist[this.trueCardRef[store.pivotElementIndex]].firstChild.firstChild.style.border = '2px solid blue';
            store.selectedCards.push(store.pivotElementIndex);

            this.numberOfSwaps = store.lookingIndex;
            this.biggerCards = 0;
            this.smallerCards = 0;
            checked = store.cards.length;
          }
          store.lookingIndex++;
          checked ++;
        }
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

<style>
/*Hier wird definiert wie die Karten angeordnet werden sollen*/
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  column-gap: 10px;
  row-gap: 45px;
  justify-items: center;
  font-family: Arial, sans-serif;
}
</style>

<style scoped>
.card-and-line {
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  column-gap: 10px;
  row-gap: 45px;
  justify-items: center;
  font-family: Arial, sans-serif;
  margin-left: 24px;
}
</style>
