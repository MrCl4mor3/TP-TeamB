<script setup></script>

<template>
  <StandardLayout :store="store" :isExpanded="isExpanded">
    <template #cards="{}">
      <!-- übergibt die benötigten Methoden und variablen -->
      <div>
        <div class="card-grid">
          <div
            v-for="(card, index) in store.cards"
            :key="card.id"
            ref="cardlist"
            class="card-and-line"
          >
            <FlippedCard @click="SelectCardQuick(index)" :card-id="card.id" ref="singlecard">
              <template #front>
                <div class="frontsite" >
                  <h1 style="color: black">{{ card.id }}</h1>
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
import { useToast} from "primevue/usetoast"

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
      toast: null
    }
  },
  mounted() {
    this.toast = useToast()
  },
  methods: {
    selectPivot() {
      //Beim Pagereload wird alles zurückgesetzt
      if (store.reloadPage) {
        this.resetQuickPage()
        store.reloadPage = false
      }
      //Als erste Aktion muss ein PIvotelement gewählt werden,
      if (this.firsttime) {
        this.firsttime = false
        store.lookingIndex = 1
        store.pivotElementIndex = 0
        this.numberOfSwaps = 0
        //in der ersten Aktion wird trueCardRef aufgesetzt. Dieser ist nötig damit karten korrekt umrandet werder können,
        //da sich bei vertauschen die Position der Karten verändern, aber die Id gleich bleibt
        this.trueCardRef.slice(0)
        for (let i = 0; i < store.cards.length; i++) {
          this.trueCardRef.push(i)
        }
        //für korrektes späteres ändern der Kartenrückseiten wird die die Originalreihenfolge der Karten-ids gespeichert
        const allCards = this.$refs.singlecard
        this.startigCardIds.slice(0)
        // Sichergehen, dass es ein Array von Instanzen ist
        if (Array.isArray(allCards)) {
          allCards.forEach((card) => {
            this.startigCardIds.push(card)
          })
        } else {
          this.toast.add({ severity: 'error', summary: 'Gerade existiert maximal eine Karte, etwas ist schief gelaufen', life: 3000 })
        }

        if (store.quickReshuffle) {
          for (let i = this.startigCardIds.length - 1; i >= 0; i--) {
            const j = Math.floor(Math.random() * (i+1));
            let temp = store.cards[i];
            store.cards[i] = store.cards[j];
            store.cards[j] = temp;
            //updaten der trueCardRef nach vertauschen von elementen
            let tempref = this.trueCardRef[i];
            this.trueCardRef[i] = this.trueCardRef[j];
            this.trueCardRef[j] = tempref;
          }
          store.quickReshuffle = false;
        }

        //erstes Pivotelement wird aufgedeckt und umrandet
        this.startigCardIds[this.trueCardRef[0]].toggleFlip();
        this.$refs.cardlist[this.trueCardRef[0]].firstChild.firstChild.style.border = '2px solid green';
        store.selectedCards.push(0);
        store.score++;
      } else {
        let checked = 0
        //check ob alles schon als sortiert gespeichert wurde
        if (store.pivotIndices.length === store.cards.length) {
          checked = store.cards.length
        }
        //ist der Teilarray fertig einsortiert
        if (
          (store.lookingIndex >= store.cards.length ||
            store.pivotIndices.includes(store.lookingIndex)) &&
          checked < store.cards.length
        ) {
          //Nicht das erste mal gedrückt, also muss das alte Pivotelement als fertig sortiert gespeichert werden
          store.pivotIndices.push(store.pivotElementIndex)
          this.startigCardIds[this.trueCardRef[store.pivotElementIndex]].colourchange()
          this.$refs.cardlist[
            this.trueCardRef[store.pivotElementIndex]
          ].firstChild.firstChild.style.border = null
          //alle Karten werden zugedeckt
          for (let i = 0; i < store.cards.length; i++) {
            if (store.selectedCards.includes(i)) {
              this.startigCardIds[this.trueCardRef[i]].toggleFlip()
            }
          }
          store.selectedCards.splice(0)
          //einelementige Teilmengen sind auch schon sortiert, also müssen dementsprechend makiert werden
          if (this.biggerCards === 1) {
            store.pivotIndices.push(store.pivotElementIndex + 1)
            this.startigCardIds[this.trueCardRef[store.pivotElementIndex + 1]].colourchange()
          }
          if (this.smallerCards === 1) {
            store.pivotIndices.push(store.pivotElementIndex - 1)
            this.startigCardIds[this.trueCardRef[store.pivotElementIndex - 1]].colourchange()
          }
          //geht weiter bis zum nächsten Element das noch nicht sortiert wurde oder pivotelement war.
          //Dieses ist dann das linke vom nächsten Abschnitt und damit neues Pivot
          while (store.pivotIndices.length < store.cards.length && checked < store.cards.length) {
            //falls am ende angekommen muss an den anfang gesprungen werden
            if (store.lookingIndex >= store.cards.length) {
              store.lookingIndex = 0
            }
            if (!store.pivotIndices.includes(store.lookingIndex)) {
              store.pivotElementIndex = store.lookingIndex

              //neues Pivot wird makiert
              this.startigCardIds[this.trueCardRef[store.pivotElementIndex]].toggleFlip()
              this.$refs.cardlist[
                this.trueCardRef[store.pivotElementIndex]
              ].firstChild.firstChild.style.border = '2px solid green'
              store.selectedCards.push(store.pivotElementIndex)

              this.numberOfSwaps = store.lookingIndex
              this.biggerCards = 0
              this.smallerCards = 0
              checked = store.cards.length
            }
            store.lookingIndex++
            checked++
          }
        } else {
          if (checked < store.cards.length){
            this.toast.add({ severity: 'error', summary: 'Der Aktuelle Teil muss noch fertiggemacht werden', life: 3000 })
          } else {
            this.toast.add({ severity: 'success', summary: 'Alle Karten sind bereits als sortiert markiert', life: 3000 })
          }
        }
        store.score++

        this.toast.add({ severity: 'info', summary: 'Das neue Pivotelement ist ausgewählt', life: 3000 })
      }
    },
    //für Quicksort, es werden Pivotelement erkannt und anders behandelt
    SelectCardQuick(index) {
      //hier muss abgefangen werden wenn zuerst auf Karten geklickt wird, ohne das Quicksort initialisiert wurde durch erstes pivotelement drücken
      if (this.firsttime) {
        this.toast.add({ severity: 'info', summary: 'Zum Starten auf "Pivotelement" klicken', life: 3000 })

        let tempcards = this.$refs.singlecard
        this.startigCardIds.slice(0)
        // Sichergehen, dass es ein Array von Instanzen ist
        if (Array.isArray(tempcards)) {
          tempcards.forEach((card) => {
            this.startigCardIds.push(card)
          })
        } else {
          this.toast.add({ severity: 'error', summary: 'Gerade existiert maximal eine Karte, etwas ist schief gelaufen', life: 3000 })
        }
        this.startigCardIds[index].toggleFlip();
        //Beim Pagereload wird alles zurückgesetzt
        if (store.reloadPage) {
          this.resetQuickPage();
          store.reloadPage = false;
        }
      } else {
        if (store.pivotIndices.includes(index) || store.pivotElementIndex === index) {
          this.toast.add({ severity: 'error', summary: 'Dies ist ein Pivotelement', life: 3000 })
          this.startigCardIds[this.trueCardRef[index]].toggleFlip();
        } else {
          if (store.selectedCards.includes(index)) {
            store.selectedCards = store.selectedCards.filter((card) => card !== index);
          } else if (store.selectedCards.length < 2) {
            if (index === store.lookingIndex) {
              store.selectedCards.push(index);
              store.score++;
            } else {
              this.toast.add({ severity: 'error', summary: 'Das ist die falsche Karte, der Algorithmus geht anders', life: 3000 })
              this.startigCardIds[this.trueCardRef[index]].toggleFlip();
            }
          }
        }
      }
    },
    //das Element muss nach links vom Pivotelement getauscht werden
    moveToSmaller() {
      //Beim Pagereload wird alles zurückgesetzt
      if (store.reloadPage) {
        this.resetQuickPage()
        store.reloadPage = false
      }
      if (this.firsttime) {
        this.toast.add({ severity: 'info', summary: 'Zum Starten auf "Pivotelement" klicken', life: 3000 })
      } else {
        if (store.selectedCards.length === 2) {
          //tausch von Pivotelement und kleinerem Element
          let swapid = store.lookingIndex
          const temp = store.cards[swapid]
          store.cards[swapid] = store.cards[store.pivotElementIndex]
          store.cards[store.pivotElementIndex] = temp
          //updaten der trueCardRef nach vertauschen von elementen
          let tempref = this.trueCardRef[swapid]
          this.trueCardRef[swapid] = this.trueCardRef[store.pivotElementIndex]
          this.trueCardRef[store.pivotElementIndex] = tempref

          //automatisches Zudecken der Karte
          let willBeFlipped = null;
          willBeFlipped = this.startigCardIds[this.trueCardRef[store.pivotElementIndex]];
          setTimeout(() => {willBeFlipped.toggleFlip();}, 200);
          // this.startigCardIds[this.trueCardRef[store.pivotElementIndex]].toggleFlip()
          store.selectedCards = store.selectedCards.filter(
            (card) => card !== store.pivotElementIndex,
          )

          store.pivotElementIndex = swapid
          //alle Karten die größer als das Pivot gemerkt sind müssen wieder nach rechts getauscht werden
          if (this.biggerCards > 0) {
            for (let i = 0; i < this.biggerCards; i++) {
              const temp = store.cards[swapid]
              store.cards[swapid] = store.cards[swapid - 1]
              store.cards[swapid - 1] = temp

              //updaten der trueCardRef nach vertauschen von elementen
              let tempref = this.trueCardRef[swapid]
              this.trueCardRef[swapid] = this.trueCardRef[swapid - 1]
              this.trueCardRef[swapid - 1] = tempref

              store.pivotElementIndex = swapid - 1
              swapid--
            }
            //damit die korrekten Karten als aufgedeckt gespeichert sind
            store.selectedCards = store.selectedCards.filter((card) => card !== store.lookingIndex)
            store.selectedCards.push(swapid)
          }
          this.smallerCards++
          store.lookingIndex++
          this.numberOfSwaps++
        } else {
          this.toast.add({ severity: 'error', summary: 'decke noch eine nicht-pivot Karte auf, um vergleichen zu können', life: 3000 })
        }
      }
    },
    //wenn sie größer ist muss sich nur gemerkt werden wie viele in dem "Bigger" teil sind, keine Vertauschung notwendig
    moveToBigger() {
      //Beim Pagereload wird alles zurückgesetzt
      if (store.reloadPage) {
        this.resetQuickPage()
        store.reloadPage = false
      }
      if (this.firsttime) {
        this.toast.add({ severity: 'info', summary: 'Zum Starten auf "Pivotelement" klicken', life: 3000 })
      } else {
        if (store.selectedCards.length === 2) {
          this.biggerCards++
          //automatisches Zudecken der Karte
          this.startigCardIds[this.trueCardRef[store.lookingIndex]].toggleFlip()
          store.selectedCards = store.selectedCards.filter((card) => card !== store.lookingIndex)

          store.lookingIndex++
          this.numberOfSwaps++
        } else {
          this.toast.add({ severity: 'error', summary: 'decke noch eine nicht-pivot Karte auf, um vergleichen zu können', life: 3000 })
        }
      }
    },
    //reset der ganze page zu dem Startzustand
    resetQuickPage() {
      //pivotboarder weg
      if (!this.firsttime) {
        this.$refs.cardlist[this.trueCardRef[store.pivotElementIndex]].firstChild.firstChild.style.border = null;
      }
      //kartenrückseite auf default farbe
      this.startigCardIds.forEach((card) => {
        card.colour = '#10b981'
      })
      //reset variablen die im store gespeichert sind
      store.selectedCards.splice(0)
      store.pivotIndices.splice(0)
      store.lookingIndex = 0
      store.pivotElementIndex = 0
      //reset lokale variablen
      this.numberOfSwaps = 0
      this.selectedCard = null
      this.pivotElement = null
      this.firsttime = true
      this.biggerCards = 0
      this.smallerCards = 0
      this.trueCardRef.splice(0)
      this.startigCardIds.splice(0)
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
