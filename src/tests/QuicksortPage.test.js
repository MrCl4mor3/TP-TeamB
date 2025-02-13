import { describe, it, expect, beforeEach} from 'vitest'
import { mount } from '@vue/test-utils'
import QuicksortPage from '@/pages/QuicksortPage.vue'
import { store } from '@/store'
import { createApp } from 'vue'
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'

describe('QuicksortPage.vue', () => {
  let wrapper

  beforeEach(() => {
    // Store zurücksetzen vor jedem Test
    store.numberOfSwaps = 0
    store.selectedCards = []
    store.pivotIndices = []
    store.lookingIndex = 0
    store.pivotElementIndex = 0
    store.reloadPage = false
    store.cards = [
      { id: 0, svg: { outerHTML: '<svg></svg>' } },
      { id: 1, svg: { outerHTML: '<svg></svg>' } },
      { id: 2, svg: { outerHTML: '<svg></svg>' } }
    ]
    store.quickReshuffle = false
    store.score = 0

    // App erstellen und PrimeVue + ToastService als Plugins bereitstellen
    const app = createApp(QuicksortPage)
    app.use(PrimeVue)
    app.use(ToastService)

    wrapper = mount(QuicksortPage, {
      global: {
        plugins: [PrimeVue, ToastService]
      }
    })
  })

  it('selectPivot() should initialize the sorting process', async () => {
    await wrapper.vm.selectPivot()

    expect(wrapper.vm.firsttime).toBe(false)
    expect(store.pivotElementIndex).toBe(0)
    expect(wrapper.vm.numberOfSwaps).toBe(0)
    expect(store.selectedCards.length).toBe(1)
    expect(store.selectedCards[0]).toBe(0)
  })

  it('selectCardQuick() should toggle card selection based on pivot', async () => {
    await wrapper.vm.selectPivot() // Initialisiere den Quicksort

    // Teste Auswahl der Karte
    await wrapper.vm.SelectCardQuick(1)
    expect(store.selectedCards).toContain(1)

    // Teste die Auswahl der Karte erneut (doppelklicken auf dieselbe Karte sollte sie abwählen)
    await wrapper.vm.SelectCardQuick(1)
    expect(store.selectedCards).not.toContain(1)
  })

  it('moveToSmaller correctly moves selected card to smaller section', async () => {
    store.cards = [0,1,2]
    //store.pivotElementIndex = 0;  // Setze Pivot-Index
    await wrapper.vm.selectPivot();
    store.selectedCards = [0,1];
    this.firsttime = false;
    await wrapper.vm.moveToSmaller();

    //expect(store.selectedCards).not.toContain(1);
    //expect(store.selectedCards).toContain(0);
    expect(store.cards[0]).toBe(1);
    expect(store.cards[1]).toBe(0);
    expect(store.cards[2]).toBe(2);
  });

  it('moveToBigger() should move selected card to bigger section', async () => {
    this.biggerCards = 0
    store.cards = [0,1,2]
    await wrapper.vm.selectPivot() // Initialisiere den Quicksort
    await wrapper.vm.SelectCardQuick(1) // Wähle eine Karte aus
    store.selectedCards = [0,1]
    store.lookingIndex = 2


    // Rufe moveToBigger auf
    await wrapper.vm.moveToBigger()
    console.log("BliBlaBlub selectedCards:  " + store.selectedCards + "Cards:  " + store.cards + "biggerCards:  " + this.biggerCards)
    // Überprüfe, ob der Move korrekt durchgeführt wurde
    // expect(store.selectedCards).toBe([0])
    expect(this.biggerCards).toBe(1)
  })

  it('resetQuickPage() should reset the page to initial state', async () => {
    //await wrapper.vm.selectPivot() // Initialisiere den Quicksort
    store.selectedCards.push(1)
    expect(store.selectedCards.length).toBe(1)

    await wrapper.vm.resetQuickPage()

    // Überprüfe, ob alle Variablen zurückgesetzt wurden
    expect(store.selectedCards.length).toBe(0)
    expect(store.pivotElementIndex).toBe(0)
    expect(store.numberOfSwaps).toBe(0)
    //expect(this.smallerCards).toBe(0)
   //expect(this.biggerCards).toBe(0)
    expect(store.lookingIndex).toBe(0)
    expect(wrapper.vm.firsttime).toBe(true)
  })
})
