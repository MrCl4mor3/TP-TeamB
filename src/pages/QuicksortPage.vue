<script setup></script>

<template>
  <StandardLayout :store="store" :isExpanded="isExpanded">
    <template #cards="{}">
      <!-- übergibt die benötigten Methoden und variablen -->
      <div>
        <div class="flex-container-row">
          <div
            v-for="(card, index) in store.cards"
            :key="card.id"
            ref="cardlist"
            class="card-and-line"
          >
            <FlippedCard @click="this.SelectCardQuick(index)" :card-id="card.id" ref="singlecard">
              <template #front>
                <div class="frontsite"></div>
              </template>
              <template #back>
                <div class="backsite">
                  <div v-html="card.svg?.outerHTML"></div>
                </div>
              </template>
            </FlippedCard>
            <svg class="line" width="10" height="300">
              <!-- Linie -->
              <line
                v-show="index === this.lineposition"
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
import { useToast } from 'primevue/usetoast'
import messages from '@/descriptions/messages.json'

export default {
  name: 'GamePage',
  components: {
    StandardLayout,
    FlippedCard,
  },
  data() {
    return {
      lineposition: 0,
      newPivotFound: false,
      store,
      selectedCard: null,
      pivotElement: null,
      firsttime: true,
      biggerCards: 0,
      smallerCards: 0,
      trueCardRef: [],
      startigCardIds: [],
      toast: null,
    }
  },
  mounted() {
    this.toast = useToast()
  },
  methods: {
    /**
     * Wählt das nächste Pivotelement aus und markiert alle sortierten Karten. Hier wird auch der Setup für Quicksort gemacht
     */
    selectPivot() {
      //Beim Pagereload wird alles zurückgesetzt
      if (store.reloadPage) {
        this.resetQuickPage()
        store.reloadPage = false
      }
      //Als erste Aktion muss ein Pivotelement gewählt werden, hier werden dann alle Werte initialisiert
      if (this.firsttime) {
        this.firsttime = false
        store.lookingIndex = 1
        store.pivotElementIndex = 0
        store.numberOfSwaps = 0
        this.lineposition = 0
        //in der ersten Aktion wird trueCardRef aufgesetzt. Dieser ist nötig damit karten korrekt umrandet werder können,
        //da sich bei vertauschen die Position der Karten verändern, aber die Id gleich bleibt
        this.trueCardRef.splice(0)
        for (let i = 0; i < store.cards.length; i++) {
          this.trueCardRef.push(i)
        }
        //für korrektes späteres ändern der Kartenrückseiten wird die die Originalreihenfolge der Karten-ids gespeichert
        const allCards = this.$refs.singlecard
        this.startigCardIds.splice(0)
        // Sichergehen, dass es ein Array von Instanzen ist
        if (Array.isArray(allCards)) {
          allCards.forEach((card) => {
            this.startigCardIds.push(card)
          })
        } else {
          this.toast.add({ severity: 'error', summary: messages['oneCard'], life: 3000 })
        }
        //Hier wird beim reshufflen die Reihenfolge der Card gemischt.
        if (store.quickReshuffle) {
          for (let i = this.startigCardIds.length - 1; i >= 0; i--) {
            const j = Math.floor(Math.random() * (i + 1))
            let temp = store.cards[i]
            store.cards[i] = store.cards[j]
            store.cards[j] = temp
            //updaten der trueCardRef nach vertauschen von elementen, damit die Karten korrekt angesprochen werden können
            let tempref = this.trueCardRef[i]
            this.trueCardRef[i] = this.trueCardRef[j]
            this.trueCardRef[j] = tempref
          }
          store.quickReshuffle = false
        }

        //erstes Pivotelement wird aufgedeckt und umrandet
        this.startigCardIds[this.trueCardRef[0]].toggleFlip()
        this.$refs.cardlist[this.trueCardRef[0]].firstChild.firstChild.style.border =
          '2px solid green'
        store.selectedCards.push(0)
        store.score++
      } else {
        let checked = 0
        //check ob alles schon als sortiert gespeichert wurde
        if (store.pivotIndices.length === store.cards.length) {
          checked = store.cards.length
        }
        //ist der Teilarray fertig einsortiert, also sind wir am ende des Karten Array oder beim altem pivotelement angekommen
        if (
          (store.lookingIndex >= store.cards.length ||
            store.pivotIndices.includes(store.lookingIndex)) &&
          checked < store.cards.length
        ) {
          //Nicht das erste mal gedrückt, also muss das alte Pivotelement als fertig sortiert gespeichert werden
          store.pivotIndices.push(store.pivotElementIndex)
          this.startigCardIds[this.trueCardRef[store.pivotElementIndex]].changeColour()

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
            this.startigCardIds[this.trueCardRef[store.pivotElementIndex + 1]].changeColour()
          }
          if (this.smallerCards === 1) {
            store.pivotIndices.push(store.pivotElementIndex - 1)
            this.startigCardIds[this.trueCardRef[store.pivotElementIndex - 1]].changeColour()
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
              this.newPivotFound = true

              //neues Pivot wird makiert
              this.startigCardIds[this.trueCardRef[store.pivotElementIndex]].toggleFlip()
              this.$refs.cardlist[
                this.trueCardRef[store.pivotElementIndex]
              ].firstChild.firstChild.style.border = '2px solid green'
              store.selectedCards.push(store.pivotElementIndex)

              this.lineposition = store.lookingIndex
              this.biggerCards = 0
              this.smallerCards = 0
              checked = store.cards.length
            }
            store.lookingIndex++
            checked++
          }
          if (this.newPivotFound === false) {
            store.score--
          } else {
            this.newPivotFound = false
          }
        } else {
          //die Fälle das Pivotelementgedrückt wurde wenn entweder der Teilarray noch nicht soritert wurde oder jetzt alle Karten einsortiert sind
          if (checked < store.cards.length) {
            this.toast.add({ severity: 'error', summary: messages['finshThePart'], life: 3000 })
          } else {
            this.toast.add({
              severity: 'success',
              summary: messages['quicksortSuccess'],
              life: 3000,
            })
            store.score--
          }
        }
        store.score++
        //weil sich hier so viel tut wird ein toast ausgegeben
        this.toast.add({ severity: 'info', summary: messages['choosingNewPivot'], life: 3000 })
      }
    },
    /**
     * für Quicksort, es werden Pivotelement und feste Elemente erkannt und anders behandelt
     * @param {Number} index die Position der Karte, die gerade geklickt wurde.
     */
    SelectCardQuick(index) {
      //Beim Pagereload wird alles zurückgesetzt
      if (store.reloadPage) {
        this.resetQuickPage()
        store.reloadPage = false
      }
      //hier muss abgefangen werden wenn zuerst auf Karten geklickt wird, ohne das Quicksort initialisiert wurde durch erstes pivotelement drücken
      //Dabei wird die gedrückte Karte wieder umgedreht und evtl bei reload der reset schonmal gemacht
      if (this.firsttime) {
        this.toast.add({ severity: 'info', summary: messages['clickPivotToStart'], life: 3000 })

        let tempcards = this.$refs.singlecard
        this.startigCardIds.splice(0)
        // Sichergehen, dass es ein Array von Instanzen ist
        if (Array.isArray(tempcards)) {
          tempcards.forEach((card) => {
            this.startigCardIds.push(card)
          })
        } else {
          this.toast.add({ severity: 'error', summary: messages['oneCard'], life: 3000 })
        }
        this.startigCardIds[index].toggleFlip()
      } else {
        //ist geklickte Karte Pivotelement oder schon fest?
        if (store.pivotIndices.includes(index) || store.pivotElementIndex === index) {
          if (store.pivotIndices.includes(index)) {
            this.toast.add({
              severity: 'info',
              summary: messages['unselectableBecauseFixed'],
              life: 3000,
            })
          } else if (store.pivotElementIndex === index) {
            this.toast.add({ severity: 'error', summary: messages['pivotelement'], life: 3000 })
          }
          this.startigCardIds[this.trueCardRef[index]].toggleFlip()
        } else {
          //ist die geklickte Karte schon ausgewählt?
          if (store.selectedCards.includes(index)) {
            store.selectedCards = store.selectedCards.filter((card) => card !== index)
            store.score--
            //Karte ist noch nicht ausgewählt
          } else if (store.selectedCards.length < 2) {
            //Ist das die richtige nächste Karte?
            if (index === store.lookingIndex) {
              store.selectedCards.push(index)
              store.score++
            } else {
              this.toast.add({
                severity: 'error',
                summary: messages['wrongAlgorithmStep'],
                life: 3000,
              })
              this.startigCardIds[this.trueCardRef[index]].toggleFlip()
            }
          }
        }
      }
    },
    /**
     * Die gerade aufgedeckte Karte wird nach Links vom Pivotelement getauscht, wenn es wirklich kleiner ist.
     * Dabei müssen alle Karten die in "Bigger" einsortiert sind wieder in die korrekte Position gebracht werden
     */
    moveToSmaller() {
      //Beim Pagereload wird alles zurückgesetzt
      if (store.reloadPage) {
        this.resetQuickPage()
        store.reloadPage = false
      }
      if (this.firsttime) {
        this.toast.add({ severity: 'info', summary: messages['clickPivotToStart'], life: 3000 })
      } else {
        if (store.selectedCards.length === 2) {
          if (
            this.startigCardIds[this.trueCardRef[store.lookingIndex]].checkId() <
            this.startigCardIds[this.trueCardRef[store.pivotElementIndex]].checkId()
          ) {
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
            let willBeFlipped = null
            willBeFlipped = this.startigCardIds[this.trueCardRef[store.pivotElementIndex]]
            setTimeout(() => {
              willBeFlipped.toggleFlip()
            }, 30)
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
              store.selectedCards = store.selectedCards.filter(
                (card) => card !== store.lookingIndex,
              )
              store.selectedCards.push(swapid)
            }
            this.smallerCards++
            store.lookingIndex++
            store.numberOfSwaps++
            this.lineposition++
          } else {
            this.toast.add({ severity: 'error', summary: messages['wrongSide'], life: 3000 })
          }
        } else {
          this.toast.add({ severity: 'error', summary: messages['missingNonPivot'], life: 3000 })
        }
      }
    },
    /**
     * Wenn die gerade aufgedeckte Karte größer als das Pivotelement ist wird sie in dem "Bigger" Teil einsortiert, dabei ist kein vertauschen nötig (Karte bleibt rechts vom Pivot)
     */
    moveToBigger() {
      //Beim Pagereload wird alles zurückgesetzt
      if (store.reloadPage) {
        this.resetQuickPage()
        store.reloadPage = false
      }
      if (this.firsttime) {
        this.toast.add({ severity: 'info', summary: messages['clickPivotToStart'], life: 3000 })
      } else {
        if (store.selectedCards.length === 2) {
          if (
            this.startigCardIds[this.trueCardRef[store.lookingIndex]].checkId() >
            this.startigCardIds[this.trueCardRef[store.pivotElementIndex]].checkId()
          ) {
            this.biggerCards++
            //automatisches Zudecken der Karte
            this.startigCardIds[this.trueCardRef[store.lookingIndex]].toggleFlip()
            store.selectedCards = store.selectedCards.filter((card) => card !== store.lookingIndex)

            store.lookingIndex++
            store.numberOfSwaps++
            this.lineposition++
          } else {
            this.toast.add({ severity: 'error', summary: messages['wrongSide'], life: 3000 })
          }
        } else {
          this.toast.add({ severity: 'error', summary: messages['missingNonPivot'], life: 3000 })
        }
      }
    },
    /**
     * reset der Quicksort page zu dem Startzustand
     */
    resetQuickPage() {
      //pivotboarder weg
      if (!this.firsttime) {
        this.$refs.cardlist[
          this.trueCardRef[store.pivotElementIndex]
        ].firstChild.firstChild.style.border = null
      }
      //kartenrückseite auf default farbe
      this.startigCardIds.forEach((card) => {
        card.colour = '#10b981'
      })
      //reset variablen die von Quicksortpage benutzt werden und im store gespeichert sind
      store.selectedCards.splice(0)
      store.pivotIndices.splice(0)
      store.lookingIndex = 0
      store.pivotElementIndex = 0
      store.numberOfSwaps = 0

      //reset lokale variablen
      this.selectedCard = null
      this.pivotElement = null
      this.firsttime = true
      this.biggerCards = 0
      this.smallerCards = 0
      this.trueCardRef.splice(0)
      this.startigCardIds.splice(0)
      this.lineposition = 0
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

.flex-container-row {
  margin-left: 24px;
}
</style>
