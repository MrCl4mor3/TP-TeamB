<template>
  <div class="p-4">
    <Button label="Öffne Dialog" icon="pi pi-external-link" @click="openDialog" />

    <Dialog v-model:visible="visible" modal header="Dynamischer Dialog" :style="{ width: '400px' }">
      <p>Hier ist ein dynamischer Dialog mit PrimeVue.</p>
      <Button label="Schließen" icon="pi pi-times" @click="visible = false" class="p-button-text" />
    </Dialog>
  </div>
</template>

<script>
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';

export default {
  components: {
    Dialog,
    Button,
  },
  data() {
    return {
      visible: false,
    };
  },
  methods: {
    openDialog() {
      this.visible = true;
    },
  },
};
</script>

<style>
/* Optional: Stil für das Layout */
.p-4 {
  padding: 1rem;
}
</style>
