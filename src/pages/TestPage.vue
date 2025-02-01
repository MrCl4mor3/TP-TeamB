<template>
  <div class = "test-page">
    <Toast/>
    <ButtonPress @click="showToast">Zeige Toast</ButtonPress>
  </div>
</template>

<style>
.test-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
</style>

<script setup>
import { useToast } from "primevue/usetoast";
import Toast from "primevue/toast";

const toast = useToast();

const showToast = () => {
  console.log('Toast wurde angezeigt');
  toast.add({ severity: 'success', summary: 'Erfolg', detail: 'Toast wurde angezeigt' });
}

</script>
