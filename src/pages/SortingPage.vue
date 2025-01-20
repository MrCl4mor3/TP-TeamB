<script setup>
import { onMounted} from "vue";
import { store } from '../store'

store.numberOfFlippedCards = 0
store.score = 0
store.cards = store.startingCards.slice()

function generateCards() {
  let svgTemplate = document.getElementById('svgPicture');
  const min = 1;
  const max = 28;
  let cards = [];
  cards[0] = svgTemplate.cloneNode(true);

  for (let i = 1; i < store.numberOfCards; i++) {
    let newSvg = updateSvgID(cards[i - 1], 'card'+ i);
    newSvg = removePart(getRandomInt(min, max), newSvg);
    cards[i] = newSvg;
  }

}

function removePart(id, svgContent) {
  svgContent.getElementById(id).remove();

  return svgContent;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function updateSvgID(svgContent, newId) {
  if ( svgContent.hasAttribute("id")) {
    svgContent.removeAttribute("id");
  }
  svgContent.setAttribute("id", newId);

  return svgContent;
}

onMounted(() => {
  generateCards();
})
</script>


<template>

  <ButtonPress icon="pi pi-home" aria-label="Save" @click="goToHomePage" />

  <FieldSet
    :legend="`${store.selectedCategory} , ${store.selectedMode}`"
    :toggleable="true"
    :collapsed="true"
  >
    <template #toggleicon>
      <span>{{ isExpanded ? '?' : '❓' }}</span>
    </template>
    <p class="m-0" style="white-space: pre-wrap">
      {{ descriptionToAlgorithm[store.selectedCategory] }}
    </p>
  </FieldSet>


  <div>
    <p>Score: {{ store.score }}</p>
  </div>


  <div class="svgPrototyp">
    <svg id="svgPicture" x="0px" y="0px" width="100%" viewBox="0 0 200 300" enable-background="new 0 0 200 300" xml:space="preserve">


      <path id="1" fill="none" opacity="1.000000" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="3.000000" d=" M192.500000,75.500000   C192.204742,65.179153 190.255310,55.138527 184.394028,46.572514   C176.555191,35.116402 168.111389,35.929825 160.964722,47.979073   C155.080078,57.900558 153.663254,68.889877 153.078308,80.004120   C152.439133,92.149033 153.997421,104.160629 158.645294,115.440132   C160.662872,120.336456 163.522125,125.104706 168.972153,127.561760   C173.875061,129.772141 180.078400,127.860741 183.492081,122.494957   C188.349915,114.859192 190.831528,106.488632 192.145615,97.521339   C193.201447,90.316277 192.705246,83.168457 193.000000,76.000000  "/>
      <path id="2" fill="none" opacity="1.000000" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="3.000000" d=" M122.500000,114.500000   C117.053116,107.842598 109.896561,103.096001 103.662735,96.876785   C98.342995,101.305557 93.405128,105.383316 88.503189,109.503799   C75.827003,120.159142 62.992138,130.635223 50.569721,141.579132   C43.820431,147.525131 37.477425,153.921173 30.000000,159.000000  "/>
      <path id="3" fill="none" opacity="1.000000" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="3.000000" d=" M175.500000,129.500000   C176.581604,138.817001 175.998947,148.174316 175.800201,157.495743   C175.753387,159.691193 176.085968,161.831085 176.076294,164.000336   C175.958710,190.333145 176.006378,216.666672 175.978806,242.999985   C175.977585,244.166824 175.666672,245.333328 175.500000,246.500000  "/>
      <path id="4" fill="none" opacity="1.000000" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="3.000000" d=" M168.500000,156.000000   C167.656647,157.771820 168.015381,159.661285 168.013977,161.500015   C167.993591,188.166672 168.000000,214.833328 168.000000,241.500000  "/>
      <path id="5" fill="none" opacity="1.000000" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="3.000000" d=" M35.500000,156.000000   C36.343357,157.771820 35.984623,159.661285 35.986031,161.500015   C36.006409,188.166672 36.000000,214.833328 36.000000,241.500000  "/>
      <path id="6" fill="none" opacity="1.000000" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="3.000000" d=" M28.500000,128.500000   C28.666668,130.000000 28.977633,131.499878 28.978827,133.000015   C29.006273,167.500000 29.004894,202.000000 28.978956,236.499985   C28.978079,237.666779 28.666666,238.833328 28.500000,240.000000  "/>
      <path id="7" fill="none" opacity="1.000000" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="3.000000" d=" M7.000000,63.000000   C5.860377,70.966408 4.540944,78.745575 5.706627,87.041222   C6.752515,94.484352 7.748669,101.822853 9.974121,109.008018   C11.834251,115.013702 15.401081,120.003799 19.583242,124.421188   C23.789507,128.864044 31.212198,128.560760 36.004570,124.505402   C43.910419,117.815369 47.074677,108.459953 48.820698,98.967018   C51.981785,81.780586 51.510216,64.580872 44.973427,48.010483   C43.136990,43.355213 40.834858,38.811939 36.958466,35.549347   C29.386814,29.176620 20.193972,31.762184 14.344191,41.405483   C10.304201,48.065365 8.984432,55.430576 6.500000,62.500000  "/>
      <path id="8" fill="none" opacity="1.000000" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="3.000000" d=" M138.000000,155.000000   C138.000000,183.833328 138.000000,212.666672 138.000000,241.500000  "/>
      <path id="9" fill="none" opacity="1.000000" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="3.000000" d=" M77.000000,177.500000   C79.833336,186.833328 82.727036,196.148895 85.481064,205.505569   C87.718040,213.105576 89.787407,220.754929 92.104691,229.000000   C81.833336,229.000000 72.166664,229.000000 61.937733,229.000000   C62.276520,222.705124 64.816826,217.472443 66.158722,212.039200   C68.269112,203.494446 72.041504,195.401672 73.109283,186.513123   C73.380089,184.258865 75.000000,182.166672 76.000000,180.000000  "/>
      <path id="10" fill="none" opacity="1.000000" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="3.000000" d=" M111.500000,166.000000   C110.505722,171.642319 111.048538,177.331406 111.014984,183.000092   C110.959740,192.333084 111.280952,201.678543 110.887428,210.995239   C110.674644,216.032791 112.331009,219.826172 115.445351,223.545761   C119.786499,228.730621 124.862411,233.362701 128.000000,239.500000  "/>
      <path id="11" fill="none" opacity="1.000000" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="4.000000" d=" M132.500000,151.500000   C135.504654,152.729965 137.286652,151.706894 137.462189,148.497925   C137.635376,145.331955 137.500000,142.149124 137.500000,138.098465   C132.701477,140.071854 128.243988,138.901917 124.020905,139.622528   C116.778572,140.858368 109.706139,140.876160 102.483856,139.590729   C98.699135,138.917099 94.771713,139.458008 91.000000,140.500000  "/>
      <path id="12" fill="none" opacity="1.000000" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="3.000000" d=" M86.500000,138.500000   C85.333336,138.333328 84.091248,138.369232 83.012115,137.967453   C75.433487,135.145767 70.220612,136.288300 65.540367,142.530273   C58.681511,151.677856 59.016209,166.579269 69.069748,173.397156   C75.674568,177.876251 79.496277,178.333145 86.482162,172.478714   C95.651016,164.794861 95.382790,151.175613 90.576927,141.461945   C89.825287,139.942719 88.029732,140.397659 87.500000,139.000000  "/>
      <path id="13" fill="none" opacity="1.000000" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="4.000000" d=" M138.000000,138.000000   C141.059235,134.337463 137.755127,133.988266 135.490173,133.550873   C130.521881,132.591461 125.391541,132.486389 120.525703,133.611206   C113.425674,135.252502 106.441071,134.453415 99.527405,133.331161   C96.530708,132.844727 93.787361,133.430725 91.014618,133.669632   C88.815163,133.859131 86.256172,135.171600 87.000000,138.500000  "/>
      <path id="14" fill="none" opacity="1.000000" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="3.000000" d=" M126.500000,132.000000   C118.229454,121.782822 104.910393,122.016495 98.000000,132.500000  "/>
      <path id="15" fill="none" opacity="1.000000" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="4.000000" d=" M165.500000,154.000000   C156.517685,155.121277 147.498154,154.226074 138.498459,154.432495   C137.843613,154.447510 137.166672,153.500000 136.500000,153.000000  "/>
      <path id="16" fill="none" opacity="1.000000" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="3.000000" d=" M137.000000,184.500000   C128.306580,182.972458 119.862617,180.147720 111.000000,179.500000  "/>
      <path id="17" fill="none" opacity="1.000000" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="3.000000" d=" M39.500000,153.000000   C43.700787,155.056442 48.168732,153.645538 52.502819,153.961319   C55.321190,154.166656 58.166668,154.000000 61.000000,154.000000  "/>
      <path id="18" fill="none" opacity="1.000000" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="3.000000" d=" M111.000000,218.500000   C105.500000,225.000000 100.000000,231.500000 94.500000,238.000000  "/>
      <path id="19" fill="none" opacity="1.000000" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="3.000000" d=" M149.000000,137.000000   C154.879456,142.619202 161.182022,147.754608 166.735336,153.783218   C168.749191,155.969421 171.784012,158.258057 175.000000,159.500000  "/>
      <path id="20" fill="none" opacity="1.000000" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="3.000000" d=" M72.500000,187.500000   C66.043671,191.990799 61.034084,197.800690 57.000000,204.500000  "/>
      <path id="21" fill="none" opacity="1.000000" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="3.000000" d=" M158.000000,117.000000   C153.333328,125.833336 148.773911,134.726120 143.931030,143.461761   C142.576279,145.905457 141.863937,149.363937 138.000000,149.500000  "/>
      <path id="22" fill="none" opacity="1.000000" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="3.000000" d=" M128.000000,155.000000   C125.544060,158.210724 123.280365,161.548615 119.515549,163.529541   C112.390434,167.278519 102.833702,165.437378 97.546059,158.465073   C96.792557,157.471512 96.245872,156.420792 95.000000,156.000000  "/>
      <path id="23" fill="none" opacity="1.000000" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="3.000000" d=" M110.000000,179.000000   C104.244514,183.946869 100.411819,190.699997 94.766846,196.016052   C89.370827,192.421982 86.311165,186.710022 80.500000,184.500000  "/>
      <path id="24" fill="none" opacity="1.000000" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="3.000000" d=" M72.500000,230.000000   C70.526268,235.524307 67.144592,240.321945 64.500000,245.500000  "/>
      <path id="25" fill="none" opacity="1.000000" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="3.000000" d=" M81.500000,230.000000   C82.073074,234.347595 84.647606,237.945480 86.158302,241.940140   C86.621178,243.164108 86.894348,244.268280 87.000000,245.500000  "/>
      <path id="26" fill="none" opacity="1.000000" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="3.000000" d=" M124.500000,129.000000   C126.297668,125.314529 122.845871,122.740341 122.474144,119.502968   C122.274979,117.768440 120.409256,115.924263 123.259590,114.539124   C131.582397,120.651512 138.275986,129.014297 147.000000,135.000000  "/>
      <path id="27" fill="none" opacity="1.000000" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="3.000000" d=" M138.000000,114.500000   C137.976532,118.194839 138.302414,121.921432 137.000000,125.500000  "/>
      <path id="28" fill="none" opacity="1.000000" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="6.000000" d=" M130.000000,141.000000   C130.733810,143.453232 130.991089,146.041275 131.644089,148.461121   C132.448181,151.440918 131.431290,152.760941 129.000000,153.750000  "/>
</svg>
  </div>

  <div class="card-grid">
    <!-- Hier wird für jede Karte ein FlippedCard erstellt -->
    <div v-for="(card, index) in store.cards" :key="card.id">
      <FlippedCard @click="SelectCard(index)">
        <template #front>
          <h1></h1>
        </template>
        <template #back>
          <img :src="`./images/${card.id}.png`" />
        </template>
      </FlippedCard>
    </div>
  </div>



  <!-- Hier werden die Buttons für die Funktionen des Spiels erstellt -->
  <div class="button-container">
    <ButtonPress label="Vertausch" @click="SwapCards" />
    <ButtonPress label="Starte neu" @click="startOver" />
    <ButtonPress label="misch erneut" @click="shuffel" />
    <ButtonPress label="Beende Spiel" @click="checkIfCorrect" />
  </div>
</template>

<script>
import FlippedCard from '@/components/FlippedCard.vue'
import { store } from '../store'
import 'primeicons/primeicons.css'
import bubbleSortDescription from '../descriptions/algorithmDescriptions.json'
import errorMessages from '../descriptions/ErrorMessages.json'
export default {
  data() {
    return {
      selectedCards: [],
      descriptionToAlgorithm: {
        'Bubble Sort': bubbleSortDescription['Bubble Sort'],
        'Selection Sort': bubbleSortDescription['Selection Sort'],
        'Insertion Sort': bubbleSortDescription['Insertion Sort'],
        'Merge Sort': bubbleSortDescription['Merge Sort'],
        'Quick Sort': bubbleSortDescription['Quick Sort'],
      },
    }
  },
  components: {
    FlippedCard,
  },
  setup() {
    return { store }
  },
  methods: {
    // Tausche die Positionen der beiden Karten im Store wenn zwei Karten ausgewählt wurden
    SwapCards() {
      if (this.selectedCards.length === 2) {
        const [firstIndex, secondIndex] = this.selectedCards
        const temp = store.cards[firstIndex]
        store.cards[firstIndex] = store.cards[secondIndex]
        store.cards[secondIndex] = temp
      } else {
        alert(errorMessages['selectTwoCards'])
      }
    },
    // Methode um die Karte auszuwählen, heirbei wird die Karte aus dem Array der ausgewählten
    // Karten entfernt wenn sie schon ausgewählt wurde, ansonsten wird sie hinzugefügt
    SelectCard(index) {
      if (this.selectedCards.includes(index)) {
        this.selectedCards = this.selectedCards.filter((card) => card !== index)
      } else if (this.selectedCards.length < 2) {
        this.selectedCards.push(index)
        store.score++
      }
    },
    startOver() {
      if (this.selectedCards.length === 0) {
        store.cards = store.startingCards.slice()
        store.score = 0
      } else {
        alert(errorMessages['restartError'])
      }
    },
    shuffel() {
      if (this.selectedCards.length === 0) {
        store.cards = store.cards.sort(() => Math.random() - 0.5)
        store.startingCards = store.cards.slice()
        store.score = 0
      } else {
        alert(errorMessages['shuffleError'])
      }
    },
    //Kontrolliert ob die Karten grade gleich angeordent sind wie die korrekten Karten
    checkIfCorrect() {
      if (store.cards.every((card, index) => card.id === store.correctCards[index].id)) {
        this.$router.push('/finishPage')
      } else {
        alert(errorMessages['wrongOrder'])
      }
    },
    goToHomePage() {
      this.$router.push('/')
      this.selectedCards = []
    },
  },
}
</script>

<style>
/*Hier wird definiert wie die Karten angeordnet werden sollen*/
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  justify-items: center;
  font-family: Arial, sans-serif;
}
</style>

<style scoped>
/*Styling für die Buttons*/
.button-container {
  display: flex;
  justify-content: center;
  gap: 10px;
  font-family: Arial, sans-serif;
  margin-top: 20px;
}

.svgPrototyp {
  display: none;
}
</style>
