import { describe, it, expect, beforeEach} from 'vitest'
import { mount } from '@vue/test-utils'
import QuickSortPage from '@/pages/QuicksortPage.vue'
import { store } from '@/store'
import { createApp } from 'vue'
//import FlippedCard from '@/components/FlippedCard.vue'
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import { vi } from 'vitest';
import messages from '@/descriptions/messages.json'
import FlippedCard from '@/components/FlippedCard.vue'
//import MergeSortPage from '@/pages/MergeSortPage.vue'

const toastMock = { add: vi.fn() };

vi.mock('@/store.js', () => ({
  store: {
    containers: [
      [{ id: 1, svg: { outerHTML: '<svg>card1</svg>' } }],
      [{ id: 2, svg: { outerHTML: '<svg>card2</svg>' } }],
      [{ id: 3, svg: { outerHTML: '<svg>card3</svg>' } }],
    ],
    numberOfFlippedCards: 0,
    selectedLines: 0,
    currentCards: [],
  },
}));

vi.mock("primevue/usetoast", () => ({
  useToast: vi.fn(() => toastMock),
}));

describe('QuicksortPage.vue', () => {
let wrapper

  beforeEach(() => {
    // Store zurücksetzen vor jedem Test
    //store.current = []
    store.numberOfSwaps = 0
    store.selectedCards = []
    store.pivotIndices = []
    store.lookingIndex = 0
    store.pivotElementIndex = 0
    store.reloadPage = false
    store.cards = [
      { id: 0, svg: { outerHTML: '<svg></svg>' } },
      { id: 1, svg: { outerHTML: '<svg></svg>' } },
      { id: 2, svg: { outerHTML: '<svg></svg>' } },
      { id: 3, svg: { outerHTML: '<svg></svg>' } },
      { id: 4, svg: { outerHTML: '<svg></svg>' } }

    ]
    store.quickReshuffle = false
    store.score = 0

    // App erstellen und PrimeVue + ToastService als Plugins bereitstellen
    const app = createApp(QuickSortPage)
    app.use(PrimeVue)
    app.use(ToastService)


    wrapper = mount(QuickSortPage, {
      global: {
        plugins: [[PrimeVue, {ripple: true}], ToastService],
      },
      provide: {
        store,
        FlippedCard
      },
    })


  })

  it('selectPivot() should initialize the sorting process', async () => {
    await wrapper.vm.selectPivot()

    expect(wrapper.vm.firsttime).toBe(false)
    expect(store.pivotElementIndex).toBe(0)
    expect(store.numberOfSwaps).toBe(0)
    expect(store.selectedCards.length).toBe(1)
    expect(store.selectedCards[0]).toBe(0)
  })



  it('reshuffls the cards in selectPivot()', async () => {
    //const wrapper = mount(QuickSortPage)

    store.quickReshuffle = true;
    store.cards = [0,1,2,3]

    await wrapper.vm.selectPivot()

    expect(store.cards).not.toBe([0,1,2,3]);
  })

  it('all cards checked in selectPivot()', async () => {
    //const wrapper = mount(QuickSortPage)

    console.log("this is a test")
    console.log(wrapper); // Falls null oder undefined → Mounting schlägt fehl
    console.log(wrapper.vm); // Falls null → Problem mit Mounting oder Setup()
    console.log("this is a test")
    expect(wrapper.exists()).toBe(true);


    wrapper.vm.firsttime = false;
    store.cards = [0,1,2,3]
    store.pivotIndices = [0,1,2,3];

    await wrapper.vm.selectPivot()



    console.log("test test test")
    console.log(wrapper.vm.firsttime);
    console.log(wrapper.vm.selectPivot());

    expect(toastMock.add).toHaveBeenCalledWith({ severity: 'success', summary: messages['quicksortSuccess'], life: 3000 });
  })

  /*
  it('select pivot else', async () => {

    store.reloadPage = false;
    wrapper.vm.firsttime = false;
    store.cards = [
      { id: 0, svg: { outerHTML: '<svg></svg>' },  colour: 'grey' },
      { id: 1, svg: { outerHTML: '<svg></svg>' },  colour: 'grey'  },
      { id: 2, svg: { outerHTML: '<svg></svg>' },  colour: 'grey'  }
    ]
    store.lookingIndex = 3
    store.pivotIndices = [0,2];
    store.pivotElementIndex = 1
    wrapper.vm.startigCardIds = [
      {colour: '#10b981', changeColour: vi.fn(), toggleFlip: vi.fn()  },
      {colour: '#10b981', changeColour: vi.fn(), toggleFlip: vi.fn() },
      {colour: '#10b981' , changeColour: vi.fn(), toggleFlip: vi.fn()  }
    ]

    console.log("asd")
    wrapper.vm.trueCardRef = [0,1]
    console.log(wrapper.vm.startigCardIds[wrapper.vm.trueCardRef[1]].colour)
    wrapper.vm.startigCardIds[wrapper.vm.trueCardRef[1]].changeColour();
    console.log(wrapper.vm.startigCardIds[wrapper.vm.trueCardRef[1]].colour)
    wrapper.vm.$refs.cardlist[
      wrapper.vm.trueCardRef[store.pivotElementIndex]
      ].firstChild.firstChild.style.border = ''

    await wrapper.vm.selectPivot()

  }) */


  it('selectCardQuick() should toggle card selection based on pivot', async () => {
    //const wrapper = mount(QuickSortPage)

    store.reloadPage = true
    await wrapper.vm.selectPivot() // Initialisiere den Quicksort


    await wrapper.vm.SelectCardQuick(1)
    expect(store.reloadPage).toBe(false)
    expect(store.selectedCards).toContain(1)

    // Teste die Auswahl der Karte erneut (doppelklicken auf dieselbe Karte sollte sie abwählen)
    await wrapper.vm.SelectCardQuick(1)
    expect(store.selectedCards).not.toContain(1)
  })



    it('moveToSmaller correctly moves selected card to smaller section', async () => {
      //const wrapper = mount(QuickSortPage)

      store.cards = [0,1,2]
      await wrapper.vm.selectPivot();
      store.selectedCards = [0,1];
      this.firsttime = false;
      await wrapper.vm.moveToSmaller();

      expect(store.cards[0]).toBe(1);
      expect(store.cards[1]).toBe(0);
      expect(store.cards[2]).toBe(2);
    });

    it('moveToSmaller correctly moves selected card to smaller section when there are already bigger Cards', async () => {
      //const wrapper = mount(QuickSortPage)

      store.cards = [0, 1, 2, 3];
      await wrapper.vm.selectPivot();

      store.selectedCards = [0, 1];
      await wrapper.vm.moveToBigger();

      store.selectedCards = [0, 2];
      await wrapper.vm.moveToSmaller();

      expect(store.cards[0]).toBe(2);
      expect(store.cards[1]).toBe(0);
      expect(store.cards[2]).toBe(1);
      expect(store.cards[3]).toBe(3);

    });


    it('moveToBigger() should move selected card to bigger section', async () => {
      //const wrapper = mount(QuickSortPage)

      wrapper.vm.biggerCards = 0
      store.cards = [0,1,2]
      await wrapper.vm.selectPivot() // Initialisiere den Quicksort
      await wrapper.vm.SelectCardQuick(1) // Wähle eine Karte aus
      store.selectedCards = [0,1]
      store.lookingIndex = 2

      // Rufe moveToBigger auf
      await wrapper.vm.moveToBigger()
      // Überprüfe, ob der Move korrekt durchgeführt wurde
      // expect(store.selectedCards).toBe([0])
      expect(wrapper.vm.biggerCards).toBe(1)
    })

    it('resetQuickPage() should reset the page to initial state', async () => {
      //const wrapper = mount(QuickSortPage)

      store.selectedCards.push(1)
      expect(store.selectedCards.length).toBe(1)

      await wrapper.vm.resetQuickPage()

      // Überprüfe, ob alle Variablen zurückgesetzt wurden
      expect(store.selectedCards.length).toBe(0)
      expect(store.pivotElementIndex).toBe(0)
      expect(store.numberOfSwaps).toBe(0)
      expect(wrapper.vm.smallerCards).toBe(0)
      expect(wrapper.vm.biggerCards).toBe(0)
      expect(store.lookingIndex).toBe(0)
      expect(wrapper.vm.firsttime).toBe(true)
    })

  /*
    it('resetQuickPage() on !firsttime'), async () => {
      wrapper.vm.firsttime = false
      await wrapper.vm.resetQuickPage()

    }


   */


    it('reloads page in selectPivot()', async () => {
      //const wrapper = mount(QuickSortPage)

      store.reloadPage = true
      await wrapper.vm.selectPivot()
      expect(store.reloadPage).toBe(false)
    })

    it('reloads page in moveToSmaller()', async () => {
      //const wrapper = mount(QuickSortPage)

      store.reloadPage = true
      await wrapper.vm.moveToSmaller()
      expect(store.reloadPage).toBe(false)
    })

    it('reloads page in moveToBigger()', async () => {
      //const wrapper = mount(QuickSortPage)

      store.reloadPage = true

      await wrapper.vm.moveToBigger()
      expect(store.reloadPage).toBe(false)
    })




})
