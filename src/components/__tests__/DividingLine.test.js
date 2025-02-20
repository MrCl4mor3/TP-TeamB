import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach } from 'vitest';
import DividingLine from '../DividingLine.vue';
import { store } from '../../store'

describe('LineComponent.vue', () => {

  let wrapper

  beforeEach(() => {
    // Store zurücksetzen vor jedem Test
    store.dividingContainerPosition = -1
    store.dividingLinePosition = -1

    wrapper = mount(DividingLine, {
      props: {
        containerIndex: 0,
        lineIndex: 0,
      },
    })
  })

  it('renders the SVG line correctly', () => {
    const wrapper = mount(DividingLine);
    const line = wrapper.find('line');
    expect(line.exists()).toBe(true);
  });

  it('toggles selection state when clicked', async () => {
    store.selectedLines = 0; // Stelle sicher, dass der Store-Status korrekt ist
    const wrapper = mount(DividingLine);
    const svg = wrapper.find('svg');

    await svg.trigger('click');
    expect(wrapper.vm.isSelected).toBe(true);
    expect(store.selectedLines).toBe(1);

    await svg.trigger('click');
    expect(wrapper.vm.isSelected).toBe(false);
    expect(store.selectedLines).toBe(0);
  });

  it('does not select line if another line is selected', async () => {
    store.selectedLines = 1; // Simuliere, dass bereits eine Linie ausgewählt ist
    const wrapper = mount(DividingLine);
    const svg = wrapper.find('svg');

    await svg.trigger('click');
    expect(wrapper.vm.isSelected).toBe(false);
    expect(store.selectedLines).toBe(1);
  });

  it('should set isDividingLine to true when the dividing line matches', async () => {
    // Simuliere, dass die Linie eine Trennlinie ist
    store.dividingContainerPosition = 0
    store.dividingLinePosition = 0

    await wrapper.vm.reloadRecolour()

    expect(wrapper.vm.isDividingLine).toBe(true) // Sollte grün sein
  })

  it('should set isDividingLine to false when the dividing line does not match', async () => {
    // Simuliere, dass die Linie KEINE Trennlinie ist
    store.dividingContainerPosition = 1
    store.dividingLinePosition = 1

    await wrapper.vm.reloadRecolour()

    expect(wrapper.vm.isDividingLine).toBe(false) // Sollte rot sein
  })
});
