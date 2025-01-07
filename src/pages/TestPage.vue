<script setup></script>

<template>
  <ButtonPress icon="pi pi-home" aria-label="Save" @click="goToHomePage" />
  <div class="header">
    <h1>TestPage</h1>
  </div>
</template>

<script>
export default {
  methods: {
    goToHomePage() {
      this.$router.push('/')
    },
  },
}
</script>

<style scoped>
.header {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
  font-family: Arial, sans-serif;
  font-size: 24px;
}
</style>
