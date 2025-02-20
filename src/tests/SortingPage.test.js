import { describe, it, expect ,vi} from 'vitest';
import { shallowMount } from '@vue/test-utils';
import SortingPage from '@/pages/SortingPage.vue';
import { store } from '@/store.js';

describe('SortingPage', () => {


  it('should have store in data', () => {
    const wrapper = shallowMount(SortingPage);
    expect(wrapper.vm.store).toBe(store);
  });


})
