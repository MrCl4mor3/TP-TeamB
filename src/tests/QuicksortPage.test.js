import { describe, it, expect, beforeEach } from 'vitest'
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
    // Vorbedingungen einrichten
    store.selectedCards = [0, 1];  // Die ausgewählten Karten (z.B. mit den Indizes 0 und 1)
    store.pivotElementIndex = 0;  // Setze Pivot-Index

    // Funktion aufrufen
    await wrapper.vm.moveToSmaller();

    // Debugging: Überprüfen, was in store.selectedCards nach dem Funktionsaufruf enthalten ist
    console.log("Selected Cards after moveToSmaller:", store.selectedCards);

    // Prüfen, dass die Karte 1 nicht mehr in selectedCards enthalten ist
    expect(store.selectedCards).not.toContain(1);
  });



  it('moveToBigger() should move selected card to bigger section', async () => {
    await wrapper.vm.selectPivot() // Initialisiere den Quicksort
    await wrapper.vm.SelectCardQuick(2) // Wähle eine Karte aus
    store.lookingIndex = 2

    // Bevor der Move erfolgt
    expect(store.selectedCards).toContain(2)

    // Rufe moveToBigger auf
    await wrapper.vm.moveToBigger()

    // Überprüfe, ob der Move korrekt durchgeführt wurde
    expect(store.selectedCards).not.toContain(2)
    expect(store.biggerCards).toBe(1)
    expect(store.smallerCards).toBe(0)
  })

  it('resetQuickPage() should reset the page to initial state', async () => {
    await wrapper.vm.selectPivot() // Initialisiere den Quicksort
    store.selectedCards.push(1)

    expect(store.selectedCards.length).toBe(1)

    await wrapper.vm.resetQuickPage()

    // Überprüfe, ob alle Variablen zurückgesetzt wurden
    expect(store.selectedCards.length).toBe(0)
    expect(store.pivotElementIndex).toBe(0)
    expect(store.numberOfSwaps).toBe(0)
    expect(store.smallerCards).toBe(0)
    expect(store.biggerCards).toBe(0)
    expect(store.lookingIndex).toBe(0)
    expect(wrapper.vm.firsttime).toBe(true)
  })
})
