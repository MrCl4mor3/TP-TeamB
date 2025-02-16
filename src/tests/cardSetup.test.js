import { describe, it, expect, vi} from 'vitest'
import { store } from '../store'
import { generateCards, } from '@/cardSetup.js'
import cardSvg from '../assets/card2.svg'





describe('Store', () => {
  it('should generate Cards', () => {
    generateCards('Mode1','Bubble Sort',4)
    expect(store.selectedMode).toBe('Bubble Sort');
    expect(store.selectedCategory).toBe('Mode1');


  })

  it('should get cards', () => {
    generateCards('Mode1','Bubble Sort',4)
    expect(store.cards).not.toBeNull;

  })




})


