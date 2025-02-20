import { mount, shallowMount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import MergeSortPage from '@/pages/MergeSortPage.vue'
import { store } from '@/store.js'
import { createApp } from 'vue'
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import { useToast } from 'primevue/usetoast'
import messages from '@/descriptions/messages.json'

vi.mock('@/store.js', () => ({
  store: {
    containers: [
      [{ id: 1, svg: { outerHTML: '<svg>card1</svg>' } }],
      [{ id: 2, svg: { outerHTML: '<svg>card2</svg>' } }],
    ],
    numberOfFlippedCards: 0,
    selectedLines: 0,
  },
}))

vi.mock('primevue/usetoast', () => {
  const toastMock = {
    add: vi.fn(),
  }
  return {
    useToast: vi.fn(() => toastMock),
  }
})

describe('MergeSortPage.vue', () => {
  beforeEach(() => {
    store.currentCards = [] // Initialisiere das Array
    store.containers = [[{ id: 1, svg: '<svg></svg>' }]]
    store.numberOfFlippedCards = 0
    store.currentSelectedContainer = null

    // App erstellen und PrimeVue + ToastService als Plugins bereitstellen
    const app = createApp(MergeSortPage)
    app.use(PrimeVue)
    app.use(ToastService)
  })

  it('renders the component', () => {
    const wrapper = mount(MergeSortPage)
    expect(wrapper.exists()).toBe(true)
  })

  it('calls dragStart and updates draggedIndex', async () => {
    const wrapper = mount(MergeSortPage)
    await wrapper.vm.dragStart(0)
    expect(wrapper.vm.draggedIndex).toBe(0)
  })

  it('should reload page', async () => {
    const wrapper = mount(MergeSortPage)
    store.containers = [[0, 1], [2]] // Beispielhafte Containerstruktur
    store.currentSelectedContainer = 0
    store.numberOfSwaps = 0
    store.reloadPage = true
    store.selectedCards = [0, 1]

    await wrapper.vm.selectCardsInContainer(0, 0)
    expect(store.reloadPage).toBe(false)
  })

  it('else selected cards include', async () => {
    const wrapper = mount(MergeSortPage)
    store.containers = [[0, 1], [2]] // Beispielhafte Containerstruktur
    store.currentSelectedContainer = 0
    store.numberOfSwaps = 0
    store.reloadPage = false
    store.selectedCards = [0, 1]
    store.allowedToFlip = true
    wrapper.vm.selectedCards.length = 2
    await wrapper.vm.selectCardsInContainer(2, 0)
    expect(store.allowedToFlip).toBe(false)
  })

  it('calls drop and merges containers when allowed', async () => {
    const wrapper = mount(MergeSortPage)
    store.numberOfFlippedCards = 0
    await wrapper.vm.drop(1)
    expect(store.containers.length).toBe(1)
  })

  it('merges containers when draggedIndex is set and different from targetIndex', async () => {
    const wrapper = shallowMount(MergeSortPage)

    // Setup initial Zustand
    store.numberOfFlippedCards = 0
    store.containers = [[1], [2], [3]] // Beispielhafte Containerstruktur
    wrapper.vm.draggedIndex = 1 //{ value: 1 }; // Element aus Container 0 wird gezogen

    await wrapper.vm.drop(0) // Drop auf Container 1

    // Überprüfen, ob die Elemente zusammengeführt wurden
    expect(store.containers[0]).toEqual([1, 2]) // Container 1 enthält nun Container 0s Elemente
    expect(store.containers.length).toBe(2) // Ein Container weniger, da Container 0 entfernt wurde
    expect(wrapper.vm.draggedIndex).toBeNull // draggedIndex wurde zurückgesetzt
  })

  it('prevents drop if numberOfFlippedCards is not 0', async () => {
    const toast = useToast() // Verwende den gemockten Toast
    store.numberOfFlippedCards = 1 // Stelle sicher, dass die Bedingung greift
    const wrapper = shallowMount(MergeSortPage)

    await wrapper.vm.drop(1)
    await wrapper.vm.$nextTick() // Warte auf UI-Updates

    expect(toast.add).toHaveBeenCalledWith({
      severity: 'error',
      summary: 'Alle Karten müssen umgedreht sein!',
      life: 3000,
    })
  })

  it('swaps cards within a container', async () => {
    const wrapper = shallowMount(MergeSortPage)
    store.containers = [[0, 1], [2]] // Beispielhafte Containerstruktur
    store.currentSelectedContainer = 0
    store.numberOfSwaps = 0
    await wrapper.vm.selectCardsInContainer(0, 0)
    await wrapper.vm.selectCardsInContainer(0, 1)

    await wrapper.vm.canSwapInContainer()

    expect(store.numberOfSwaps).toBe(1)
    expect(store.containers[0]).toEqual([1, 0])
  })

  it('swaps cards within a dividing container', async () => {
    const wrapper = shallowMount(MergeSortPage)
    store.containers = [[0, 1], [2]] // Beispielhafte Containerstruktur
    store.currentSelectedContainer = 0
    store.numberOfSwaps = 0

    await wrapper.vm.selectCardsInContainer(0, 0)
    await wrapper.vm.selectCardsInContainer(0, 1)
    store.dividingLinePosition = 0
    store.dividingContainerPosition = 0

    await wrapper.vm.canSwapInContainer()

    expect(store.dividingLinePosition).toBe(1)
  })

  it('swaps cards within a dividing second container', async () => {
    const wrapper = shallowMount(MergeSortPage)
    store.containers = [[0, 1], [2]] // Beispielhafte Containerstruktur
    store.currentSelectedContainer = 0
    store.numberOfSwaps = 0

    await wrapper.vm.selectCardsInContainer(0, 0)
    await wrapper.vm.selectCardsInContainer(0, 1)
    store.dividingLinePosition = 1
    store.dividingContainerPosition = 0

    await wrapper.vm.canSwapInContainer()

    expect(store.dividingLinePosition).toBe(0)
  })

  it('swaps cards error', async () => {
    const wrapper = shallowMount(MergeSortPage)
    const toast = useToast() // Verwende den gemockten Toast

    await wrapper.vm.canSwapInContainer()

    expect(toast.add).toHaveBeenCalledWith({
      severity: 'error',
      summary: messages['wrongAlgorithmStep'],
      life: 3000,
    })
  })

  it('should dragging', async () => {
    const wrapper = shallowMount(MergeSortPage)
    store.containers = [[0, 1], [2]]
    await wrapper.vm.dragging(0)

    expect(wrapper.vm.draggedContainersize).toBe(2)
    expect(wrapper.vm.draggedContainerIndex).toBe(0)
  })

  it('dividing mark', async () => {
    const wrapper = shallowMount(MergeSortPage)

    store.containers = [[0, 1], [2]]
    await wrapper.vm.dragging(0)

    await wrapper.vm.dividingMark(1)

    expect(store.dividingLinePosition).toBe(-1)
    expect(store.dividingContainerPosition).toBe(0)
  })

  it('dividing mark if', async () => {
    const wrapper = shallowMount(MergeSortPage)

    store.containers = [[0, 1], [2]]
    await wrapper.vm.dragging(1)

    await wrapper.vm.dividingMark(0)

    expect(store.dividingLinePosition).toBe(0)
    expect(store.dividingContainerPosition).toBe(0)
  })

  it('reloads page during selectALine and selects a line', async () => {
    const wrapper = mount(MergeSortPage)

    store.selectedCards = [0, 1]
    store.reloadPage = true
    store.selectedLines = 1

    await wrapper.vm.selectALine(1, 1)

    expect(store.reloadPage).toBe(false)
    expect(wrapper.vm.linePositionContainer).toBeNull
    expect(wrapper.vm.linePositionCard).toBeNull
  })

  it('selects a new line', async () => {
    const wrapper = mount(MergeSortPage)
    store.reloadPage = false
    store.selectedLines = 0

    await wrapper.vm.selectALine(0, 0)

    expect(wrapper.vm.linePositionContainer).toBe(-1)
    expect(wrapper.vm.linePositionCard).toBe(-1)
  })

  it('flips all cards back', () => {
    const wrapper = mount(MergeSortPage, {
      global: {
        stubs: ['SingleCard'], // Falls `singlecard` eine eigene Komponente ist
      },
      data() {
        return {
          selectedCards: [1, 2], // Simulierte ausgewählte Karten
        }
      },
      ref() {
        return {
          singlecard: [{ isFlipped: true }, { isFlipped: true }],
        }
      },
    })

    wrapper.vm.flipAllCards()

    // Prüft, ob alle Karten zurückgesetzt wurden
    wrapper.vm.$refs.singlecard.forEach((card) => {
      expect(card.isFlipped).toBe(false)
    })

    // Prüft, ob der Store zurückgesetzt wurde
    expect(store.numberOfFlippedCards).toBe(0)
    expect(store.currentSelectedContainer).toBeNull()
    expect(store.selectedCards).toEqual([])
    expect(wrapper.vm.selectedCards).toEqual([])
  })

  it('resets MergePage', async () => {
    const wrapper = mount(MergeSortPage)
    await wrapper.vm.resetMergePage()

    // Überprüfe, ob alle Variablen zurückgesetzt wurden
    expect(store.numberOfFlippedCards).toBe(0)
    expect(store.currentSelectedContainer).toBe(null)
    expect(store.selectedLines).toBe(0)
    expect(store.dividingLinePosition).toBe(-1)
    expect(store.dividingContainerPosition).toBe(-1)
    //lokale Variablen überprüfen
    expect(wrapper.vm.linePositionContainer).toBe(-1)
    expect(wrapper.vm.linePositionCard).toBe(-1)
    expect(wrapper.vm.selectedContainerIndex).toBe(null)
    expect(wrapper.vm.draggedContainersize).toBe(0)
  })

  it('should split container', async () => {
    const wrapper = mount(MergeSortPage)

    store.containers = [[1, 2, 3, 4], [5]]
    store.selectedLines = 1
    await wrapper.vm.selectALine(0, 1)

    await wrapper.vm.splitContainer()

    expect(store.containers[0]).toStrictEqual([1, 2])
  })
})
