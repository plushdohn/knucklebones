<script setup lang="ts">
  defineProps<{
    columns: (number | null)[][];
    canPlace?: boolean;
  }>();
</script>

<template>
  <div class="flex gap-2">
    <div
      v-for="(col, colIndex) in columns"
      class="flex flex-col gap-2 border-red-600"
      :class="{
        group: canPlace,
      }"
    >
      <div
        v-for="cell in col"
        class="w-12 h-12 lg:w-16 lg:h-16 border border-stone-800 text-stone-700 flex justify-center items-center text-xl font-black group-hover:border-red-600"
        @click="$emit('place', colIndex)"
      >
        <Dice
          v-if="cell !== null"
          :value="cell"
          animation-class="animate-pop-in-spinning"
        />
      </div>
    </div>
  </div>
</template>
