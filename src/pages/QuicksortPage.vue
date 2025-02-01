<script setup></script>

<template>
  <StandardLayout
    :store="store"
    :isExpanded="isExpanded"
  >
    <template #cards="{ selectCards2, numberOfSwaps }">
      <!-- übergibt die benötigten Methoden und variablen -->
      <div>
        <div class="card-grid">
          <div v-for="(card, index) in store.cards" :key="card.id" ref="cardlist" class="card-and-line">
            <FlippedCard @click="selectCards2(index)">
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


            <svg class="line" width="50" height="300">
              <!-- Linie -->
              <line
                v-show="index === numberOfSwaps"
                x1="25"
                y1="0"
                x2="25"
                y2="300"
                stroke="red"
                stroke-width="6"
              />
            </svg>
          </div>
        </div>
      </div>
    </template>
    <template #extraButtons="{ swapCards }">
      <ButtonPress label="vertauschen" icon="pi pi-arrow-right-arrow-left" @click="swapCards" />
      <ButtonPress label="kleiner" @click="moveToSmaller" />
      <ButtonPress label="größer" @click="moveToBigger" />
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
      lookingIndex: null,
      biggerCards: 0,
      smallerCards: 0
    }
  },
  methods: {
    //das Element muss nach links vom Pivotelement getauscht werden
    moveToSmaller() {
      if (store.selectedCards.length >= 1) {
        //tausch von Pivotelement und kleinerem Element
        let swapid = store.lookingIndex;
        alert(swapid);
        const temp = store.cards[swapid];
        store.cards[swapid] = store.cards[store.pivotElementIndex];
        store.cards[store.pivotElementIndex] = temp;
        store.pivotElementIndex = swapid;
        //alle Karten die größer als das Pivot gemerkt sind müssen wieder nach rechts getauscht werden
        if (this.biggerCards > 0) {
          for (let i = 0; i < this.biggerCards; i++) {
            const temp = store.cards[swapid];
            store.cards[swapid] = store.cards[swapid-1];
            store.cards[swapid-1] = temp;
            store.pivotElementIndex = swapid-1;
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
    },
    //wenn sie größer ist muss sich nur gemerkt werden wie viele in dem "Bigger" teil sind, keine Vertauschung
    moveToBigger() {
      if (store.selectedCards.length >= 1) {
        this.biggerCards++;
        store.lookingIndex++;
      } else {
        alert("select one non-pivot Card");
      }
    },
    selectPivot() {
      document.getElementsByClassName('card-container')[0].__vueParentComponent.ctx.toggleFlip();
      //Wenn es noch keines gibt wird das Erste Element genommen
      if (this.lookingIndex === null ) {
        alert("getting first pivot");
        this.lookingIndex = 0;
        store.lookingIndex = 1;
        store.pivotElementIndex = 0;
      } else {
        //Nicht das erste mal gedrückt, also müssen das alte Pivot, und kleinere/größere Blöcke mit nur
        //einem Element also fertig sortiert gespeichert werden
        store.pivotIndices.push(store.pivotElementIndex);
        if (this.biggerCards === 1) {
          store.pivotIndices.push(store.pivotElementIndex+1);
        }
        if (this.smallerCards === 1) {
          store.pivotIndices.push(store.pivotElementIndex-1);
        }
        let checked = 0;
        //check ob alles schon als sortiert gespeichert wurde
        if (store.pivotIndices.length === store.cards.length) {
          alert("done");
          checked = store.cards.length;
        }
        //geht weiter bis zum nächsten Element das noch nicht sortiert wurde oder pivotelement war.
        //Das ist dann das linke vom nächsten Abschnitt und damit neues Pivot
          while (store.pivotIndices.length < store.cards.length && checked < store.cards.length) {
          //falls am ende angekommen muss an den anfang gesprungen werden
            if (store.lookingIndex === store.cards.length) {
              store.lookingIndex = 0;
            }
            if (!store.pivotIndices.includes(store.lookingIndex)) {
              alert("new pivot"+ store.lookingIndex);
              store.pivotElementIndex = store.lookingIndex;
              this.biggerCards = 0;
              this.smallerCards = 0;
              checked = store.cards.length;
            }
            store.lookingIndex++;
            checked ++;
          }
      }
      alert(store.pivotIndices);
      //following only tests
   //   alert("pivotelement "+store.cards[0].id+ "  --  "+this.$refs.cardlist[0].id)
   //   store.pivotElementIndex = store.cards[0].id;
   //   if (store.cards[0].isFlipped){
   //     alert("flipped");
   //   } else if (!store.cards[0].isFlipped){
   //     alert("not flipped");
   //   } else {
   //     alert("uh oh");
   //   }
   //   store.cards[0].toggleFlip();
      //let ident = store.cards[0].id;
      //alert(ident+"  "+this.$refs.cardlist[ident]);
      //alert(ident+"   "+document.getElementById(ident)+" "+document.getElementById(ident).id)
    //  this.$refs.cardlist[0].click();
      //this.$refs.cardlist[0].addEventListener(onclick())
      //this.$refs.cardlist[0].toggleFlip();
      //document.getElementById(ident).toggleFlip();
    },

  },
}
</script>

<style>
/*Hier wird definiert wie die Karten angeordnet werden sollen*/
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  justify-items: center;
  font-family: Arial, sans-serif;
}
</style>

<style scoped>
.card-and-line {
  display: flex;
  align-items: center;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 32px;
  justify-items: center;
  font-family: Arial, sans-serif;
}
</style>
