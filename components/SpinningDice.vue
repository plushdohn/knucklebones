<script setup lang="ts">
  const value = ref(3);

  onMounted(() => {
    setInterval(() => {
      value.value = Math.floor(Math.random() * 6) + 1;
    }, 100);
  });
</script>

<template>
  <Dice
    :value="value"
    color-class="bg-stone-300"
    added-class="animate-spin-pulse"
  />
</template>

<style>
  .animate-spin-pulse {
    animation: spin-pulse 1.5s linear infinite;
  }

  @keyframes spin-pulse {
    0% {
      transform: rotate(0deg);
      opacity: 1;
    }

    50% {
      transform: rotate(180deg);
      opacity: 0.5;
    }

    100% {
      transform: rotate(360deg);
      opacity: 1;
    }
  }
</style>
