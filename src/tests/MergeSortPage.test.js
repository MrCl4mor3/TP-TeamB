import { mount, shallowMount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import MergeSortPage from '@/pages/MergeSortPage.vue';
import { store } from '@/store.js';
import { useToast } from 'primevue/usetoast';

vi.mock('@/store.js', () => ({
  store: {
    containers: [
      [{ id: 1, svg: { outerHTML: '<svg>card1</svg>' } }],
      [{ id: 2, svg: { outerHTML: '<svg>card2</svg>' } }],
    ],
    numberOfFlippedCards: 0,
    selectedLines: 0,
  },
}));

vi.mock('primevue/usetoast', () => {
  const toastMock = {
    add: vi.fn(),
  };
  return {
    useToast: vi.fn(() => toastMock),
  };
});


describe('MergeSortPage.vue', () => {

  beforeEach(() => {
    store.currentCards = [] // Initialisiere das Array
    store.containers = [[{ id: 1, svg: '<svg></svg>' }]]
    store.numberOfFlippedCards = 0
    store.currentSelectedContainer = null
  })

  it('renders the component', () => {
    const wrapper = mount(MergeSortPage);
    expect(wrapper.exists()).toBe(true);
  });

  it('calls dragStart and updates draggedIndex', async () => {
    const wrapper = mount(MergeSortPage);
    await wrapper.vm.dragStart(0);
    expect(wrapper.vm.draggedIndex).toBe(0);
  });

  it('calls drop and merges containers when allowed', async () => {
    const wrapper = mount(MergeSortPage);
    store.numberOfFlippedCards = 0;
    await wrapper.vm.drop(1);
    expect(store.containers.length).toBe(1);
  });

  it('prevents drop if numberOfFlippedCards is not 0', async () => {
    const toast = useToast(); // Verwende den gemockten Toast
    store.numberOfFlippedCards = 1; // Stelle sicher, dass die Bedingung greift
    const wrapper = shallowMount(MergeSortPage);

    await wrapper.vm.drop(1);
    await wrapper.vm.$nextTick(); // Warte auf UI-Updates

    expect(toast.add).toHaveBeenCalledTimes(1); // Prüfen, ob genau 1x aufgerufen
    expect(toast.add).toHaveBeenCalledWith({
      severity: 'error',
      summary: 'Alle Karten müssen umgedreht sein!',
      life: 3000,
    });
  });
});
