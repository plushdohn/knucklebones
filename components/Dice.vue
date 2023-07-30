<script lang="ts" setup>
  import clsx from "clsx";

  defineProps<{
    value: number;
    animationClass?: "animate-pop-in-spinning" | "animate-pulse";
    colorClass?: string;
    addedClass?: string;
  }>();

  const MAP: Record<number, boolean[][]> = {
    1: [
      [false, false, false],
      [false, true, false],
      [false, false, false],
    ],
    2: [
      [true, false, false],
      [false, false, false],
      [false, false, true],
    ],
    3: [
      [true, false, false],
      [false, true, false],
      [false, false, true],
    ],
    4: [
      [true, false, true],
      [false, false, false],
      [true, false, true],
    ],
    5: [
      [true, false, true],
      [false, true, false],
      [true, false, true],
    ],
    6: [
      [true, false, true],
      [true, false, true],
      [true, false, true],
    ],
  };
</script>

<template>
  <client-only>
    <div
      class="p-2 gap-0.5 rounded grid grid-cols-3 grid-rows-3 justify-center items-center"
      :class="
        clsx(
          animationClass ? animationClass : '',
          colorClass ? colorClass : 'bg-yellow-200',
          addedClass
        )
      "
    >
      <template v-for="(row, rowIndex) in MAP[value]">
        <template
          v-for="(cell, cellIndex) in row"
          :key="`${rowIndex}-${cellIndex}`"
        >
          <div v-if="cell" class="w-2 h-2 bg-yellow-800 rounded-full" />
          <div v-else />
        </template>
      </template>
    </div>
  </client-only>
</template>

<style>
  @keyframes pop-in-spinning {
    0% {
      transform: scale(0.5) rotate(270deg);
    }

    100% {
      transform: scale(1) rotate(0deg);
    }
  }

  .animate-pop-in-spinning {
    animation: pop-in-spinning 0.5s ease-in-out;
  }
</style>
