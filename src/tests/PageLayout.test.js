import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import PageLayout from '@/pages/PageLayout.vue';
import { store, resetStartValues } from '../../src/store';
import { useToast } from 'primevue/usetoast'
import messages from '@/descriptions/messages.json'


// Store und Toast mocken


const toastMock = { add: vi.fn() };


vi.mock("primevue/usetoast", () => ({
  useToast: vi.fn(() => toastMock),
}));

describe('PageLayout.vue', () => {
  let wrapper
  let toast

  beforeEach(() => {
    wrapper = mount(PageLayout, {
      props: {
        store,
        isExpanded: true,
      },
      global: {
        mocks: {
          $router: {
            push: vi.fn(),
          },
        },
      },
    })

    toast = useToast()
  })

  /*
  temporär entfernt
  it('öffnet das Tutorial', () => {
    expect(wrapper.vm.visibleTutorial).toBe(false)
    wrapper.vm.openTutorial()
    expect(wrapper.vm.visibleTutorial).toBe(true)
  })

   */

  it('tauscht Karten, wenn SwapCards erlaubt ist', () => {

    vi.mock('@/store', () => ({
      store: {
        selectedMode: 'Vorgegebenes Sortieren',
        selectedCategory: 'Bubble Sort',
        score: 0,
        cards: [{ id: 1 }, { id: 2 }, { id: 3 }],
        startingCards: [{ id: 1 }, { id: 2 }, { id: 3 }],
        correctCards: [{ id: 1 }, { id: 2 }, { id: 3 }],
        selectedCards: [],
        containers: [[]],
        correctSortingOrderBubble: [[0, 1], [1, 2]],
        numberOfFlippedCards: 0,
        currentCards: [{ closeCard: vi.fn(), openCard: vi.fn() }],
      },

      resetStartValues: vi.fn(),
    }))
    store.selectedCards = [1, 2] // Simuliert eine gültige Auswahl
    wrapper.vm.SwapCards()

    expect(store.cards[0].id).toBe(1)
    expect(store.cards[1].id).toBe(2)

    store.selectedCards = [2, 1]
    wrapper.vm.SwapCards()
    expect(store.cards[0].id).toBe(1)
    expect(store.cards[1].id).toBe(2)
  })

  it('zeigt eine Fehlermeldung, wenn SwapCards nicht erlaubt ist', () => {
    store.selectedCards = [0] // Falsche Auswahl
    wrapper.vm.SwapCards()


    expect(toastMock.add).toHaveBeenCalledWith({
      severity: 'error',
      summary: 'Fehler',
      detail: messages['selectTwoCards'],
      life: 3000,}
    )
  })

  it('bubble sort', async () => {
    store.cards = [0, 1, 2, 3]
    store.selectedCards = [2, 0] // Reihenfolge angepasst
    store.selectedCategory = 'Bubble Sort';
    store.numberOfSwaps = 0; // Setzt den Startindex für correctSortingOrderSelect
    store.correctSortingOrderBubble = [[2, 0]]; // Muss mit selectedCards übereinstimmen

    await wrapper.vm.SwapCards()

    expect(store.numberOfSwaps).toBe(1); // Sollte nun erfolgreich erhöht werden
  });

  it('selectionSort', async () => {
    store.cards = [0, 1, 2, 3]
    store.selectedCards = [2, 0] // Reihenfolge angepasst
    store.selectedCategory = 'Selection Sort';
    store.numberOfSwaps = 0; // Setzt den Startindex für correctSortingOrderSelect
    store.correctSortingOrderSelect = [[2, 0]]; // Muss mit selectedCards übereinstimmen

    await wrapper.vm.SwapCards()

    expect(store.numberOfSwaps).toBe(1); // Sollte nun erfolgreich erhöht werden
  });

  it('selectionSort else', async () => {
    store.cards = [0, 1, 2, 3]
    store.selectedCards = [2, 0] // Reihenfolge angepasst
    store.selectedCategory = 'Selection Sort';
    store.numberOfSwaps = 2; // Setzt den Startindex für correctSortingOrderSelect
    store.correctSortingOrderSelect = [[2, 0]]; // Muss mit selectedCards übereinstimmen

    await wrapper.vm.SwapCards()

    expect(toast.add).toHaveBeenCalledWith(
      expect.objectContaining({
        severity: 'success',
      }))

  });

  it('Insert Sort', async () => {
    store.cards = [0, 1, 2, 3]
    store.selectedCards = [2, 0] // Reihenfolge angepasst
    store.selectedCategory = 'Insertion Sort';
    store.numberOfSwaps = 0; // Setzt den Startindex für correctSortingOrderSelect
    store.correctSortingOrderInsert = [[2, 0]]; // Muss mit selectedCards übereinstimmen

    await wrapper.vm.SwapCards()

    expect(store.numberOfSwaps).toBe(1); // Sollte nun erfolgreich erhöht werden
  });

  it('Insert Sort else', async () => {
    store.cards = [0, 1, 2, 3]
    store.selectedCards = [2, 0] // Reihenfolge angepasst
    store.selectedCategory = 'Insertion Sort';
    store.numberOfSwaps = 2; // Setzt den Startindex für correctSortingOrderSelect
    store.correctSortingOrderInsert = [[2, 0]]; // Muss mit selectedCards übereinstimmen

    await wrapper.vm.SwapCards()

    expect(toast.add).toHaveBeenCalledWith(
      expect.objectContaining({
        severity: 'success',
      }))

  });


  it('shuffles when Quicksort', async () => {
    store.correctCards = [{id: 0}, {id: 1}, {id: 2}];
    wrapper.vm.store.startingCards = [{id: 0}, {id: 1}, {id: 2}];
    store.selectedCategory = 'Quick Sort';

    wrapper.vm.shuffel()
    await new Promise((resolve) => setTimeout(resolve, 1000))

    expect(store.quickReshuffle).toBe(true)
    expect(store.cards[0]).toEqual({id: 0});
    expect(store.cards[1]).toEqual({id: 1})
    expect(store.cards[2]).toEqual({id: 2})
  })


  it('shuffles when not Quicksort', async () => {
    store.correctCards = [{id: 0}, {id: 1}, {id: 2}];
    wrapper.vm.store.startingCards = [{id: 0}, {id: 1}, {id: 2}];
    store.selectedCategory = 'Bubble Sort';

    wrapper.vm.shuffel()
    await new Promise((resolve) => setTimeout(resolve, 1000))

    expect(store.cards).not.toEqual({id: 0}, {id: 1}, {id: 2})
  })



/*
temporär entfernt
  it('startet das Spiel neu', async () => {
    wrapper.vm.startOver()
    await new Promise((resolve) => setTimeout(resolve, 500))

    expect(store.cards).toEqual(store.startingCards)
    expect(wrapper.vm.visibleEndScreen).toBe(false)
    expect(resetStartValues).toHaveBeenCalled()
    expect(toast.add).toHaveBeenCalledWith(
      expect.objectContaining({
        severity: 'success',
      })
    )
  })


 */
  it('fügt eine Karte zur Auswahl hinzu und erhöht den Score', () => {
    store.selectedCards = []
    store.score = 0

    wrapper.vm.SelectCard(1)

    expect(store.selectedCards).toEqual([1])
    expect(store.score).toBe(1)
  })

  it('fügt eine zweite Karte zur Auswahl hinzu', () => {
    store.selectedCards = [1]
    store.score = 1

    wrapper.vm.SelectCard(2)

    expect(store.selectedCards).toEqual([1, 2])
    expect(store.score).toBe(2)
  })



  it('deckt eine Karte zu, wenn sie erneut ausgewählt wird', async () => {
    store.selectedCards = [1, 2]
    store.currentCards = [{ closeCard: vi.fn() }, { closeCard: vi.fn() }]

    wrapper.vm.SelectCard(1) // Karte 1 erneut auswählen

    await new Promise((resolve) => setTimeout(resolve, 150)) // Warten, bis das Timeout durchläuft

    expect(store.selectedCards).toEqual([]) // Alle Karten sollten entfernt sein
  })


  it('setzt die Auswahl zurück, wenn eine dritte Karte ausgewählt wird', () => {
    store.selectedCards = [1, 2]
    store.numberOfFlippedCards = 2
    store.currentCards = [{ closeCard: vi.fn() }, { closeCard: vi.fn() }]

    wrapper.vm.SelectCard(3) // Dritte Karte auswählen

    vi.useFakeTimers() // Simuliert das setTimeout

    expect(store.selectedCards).toEqual([1, 2])
    expect(store.numberOfFlippedCards).toBe(2)
  })



  it('deckt alle Karten auf mit openAllCards()', () => {
    store.currentCards = [{ openCard: vi.fn() }, { openCard: vi.fn() }, { openCard: vi.fn() }];

    wrapper.vm.openAllCards();

    store.currentCards.forEach((card) => {
      expect(card.openCard).toHaveBeenCalled();
    });
  });

  /*
  temporär entfernt

  it('öffnet FinishScreen bei checkedIfCorrect()', async () => {
    store.cards = [{id: 0}, {id: 1}, {id: 2}];
    store.correctCards = [{id: 0}, {id: 1}, {id: 2}];
    wrapper.vm.store.startingCards = [{id: 0}, {id: 1}, {id: 2}];
    store.correctSortingOrderInsert = [{id: 0}, {id: 1}, {id: 2}];

    await wrapper.vm.checkIfCorrect()

    expect(wrapper.vm.visibleEndScreen).toBe(true)
  })



   */

  //it('öffnet FinishScreen bei checkedIfCorrect() mit mehreren Containern', () => {
  //  store.cards = [[{id: 0}, {id: 1}], {id: 2}];
 //   store.correctCards = [[{id: 0}, {id: 1}], {id: 2}];

  //  wrapper.vm.checkIfCorrect()

  //  expect(wrapper.vm.visibleEndScreen).toBe(true)
  //})

  it('zeigt Fehlermeldung an, falls Karten noch nicht korrekt sortiert'), () => {
    store.cards = [{id: 0}, {id: 1}, {id: 2}];
    store.correctCards = [{id: 1}, {id: 0}, {id: 2}];

    wrapper.vm.checkIfCorrect()

    expect(toastMock.add).toHaveBeenCalledWith({
      severity: 'error',
      summary: 'Fehler',
      detail: messages['wrongOrder'],
      life: 3000,}
    )
  }






  it('gibt eine formatierte Beschreibung für "Free Sort" zurück, wenn der Modus "Freies Sortieren" ist', () => {
    wrapper.vm.store.selectedMode = 'Freies Sortieren';

    const result = wrapper.vm.formatDescription('Irgendeine Kategorie');

    expect(result).toBe(wrapper.vm.descriptionToAlgorithm['Free Sort']
      ? wrapper.vm.descriptionToAlgorithm['Free Sort']
        .split('\n')
        .map((line) => `<p>${line}</p>`)
        .join('')
      : ''
    );
  });

  it('gibt einen leeren String zurück, falls die Kategorie keine Beschreibung hat', () => {
    wrapper.vm.store.selectedMode = ''; // Irgendein anderer Modus
    wrapper.vm.descriptionToAlgorithm = {}; // Leeres Objekt statt `null`

    const result = wrapper.vm.formatDescription('Nicht vorhandene Kategorie');

    expect(result).toBe('');
  });

  it('formatiert eine Beschreibung korrekt mit <p>-Tags', () => {
    wrapper.vm.store.selectedMode = ''; // Standardmodus

    const result = wrapper.vm.formatDescription('Bubble Sort');

    expect(result).toBe("<p>1. Vergleiche zwei benachbarte Elemente und tausche sie, wenn das linke Element größer ist als das rechte. Angefangen wird mit den Elementen in Position 1 und 2.</p><p>2. Wiederhole Schritt 1 mit den Elementen in Position 2 und 3, dann mit denen in Position 3 und 4, usw. Dies wird so lange wiederholt, bis man beim letzten Element angekommen ist, d.h. das größte Element befindet sich nun ganz am Ende und muss beim nächsten Schritt 2 nicht wieder getauscht werden.</p><p>3. Wiederhole Schritt 1 und 2 so lange, bis keine Elemente mehr getauscht werden müssen.</p><p> - Wie Blubberblasen (bubbles) im Wasser steigt also bei jedem Durchgang das größte Element zum Ende auf.</p>")

  });




})
