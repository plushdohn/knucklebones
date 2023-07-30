<script setup lang="ts">
  import { useGameStore } from "~/stores/game";

  const store = useGameStore();

  onMounted(() => {
    setTimeout(() => {
      store.startGame();
    }, 3000);
  });
</script>

<template>
  <div
    class="relative w-full h-full overflow-y-auto grid grid-cols-3 grid-rows-2 bg-stone-950 items-center justify-items-center"
  >
    <div class="flex justify-self-end items-center gap-12">
      <SpinningDice v-if="store.dynamic.phase === 'ROLLING_PLAYER_DIE'" />
      <Dice
        v-else-if="store.dynamic.phase === 'PLACING_PLAYER_DIE'"
        :value="store.dynamic.playerDie"
      />
      <div
        class="text-stone-200 flex flex-col gap-4 justify-center items-center h-[70%] self-start transition-all"
        :class="{
          grayscale: store.isCpuTurn,
          'scale-90': store.isCpuTurn,
        }"
      >
        <img src="~/assets/lamb.webp" alt="The Lamb" class="w-32" />
        <span class="text-xl md:text-3xl font-black text-center font-serif"
          >The Lamb</span
        >
        <span class="italic text-5xl font-serif font-black text-yellow-200">{{
          store.playerScore
        }}</span>
      </div>
    </div>
    <Board
      :columns="store.static.playerBoard"
      @place="store.placePlayerDie"
      :can-place="store.dynamic.phase === 'PLACING_PLAYER_DIE'"
      class="col-start-2 col-span-1 row-span-1"
    />

    <Board
      :columns="store.static.cpuBoard"
      class="col-start-2 col-span-1 row-span-1"
    />
    <div class="flex justify-self-start items-center gap-12">
      <div
        class="flex flex-col items-center gap-4 text-white transition-all"
        :class="{
          grayscale: store.isPlayerTurn,
          'scale-90': store.isPlayerTurn,
        }"
      >
        <img src="~/assets/ratau.webp" alt="Ratau" class="w-32" />
        <span class="text-xl md:text-3xl font-black text-center font-serif"
          >Ratau</span
        >
        <span class="italic text-5xl font-serif font-black text-red-600">{{
          store.cpuScore
        }}</span>
      </div>
      <SpinningDice v-if="store.dynamic.phase === 'ROLLING_CPU_DIE'" />
      <Dice
        v-else-if="store.dynamic.phase === 'PLACING_CPU_DIE'"
        :value="store.dynamic.cpuDie"
      />
    </div>
    <Transition>
      <div
        v-if="store.dynamic.phase === 'GAME_STARTING'"
        class="fixed inset-0 flex justify-center items-center text-4xl font-black text-white bg-stone-950/80 font-serif"
      >
        GAME IS STARTING...
      </div>
    </Transition>
    <Transition>
      <div
        v-if="store.dynamic.phase === 'GAME_OVER'"
        class="fixed inset-0 flex flex-col gap-8 justify-center items-center text-4xl font-black text-white bg-stone-950/80 font-serif"
      >
        <span class="text-6xl">{{
          store.dynamic.winner === "CPU" ? "CPU wins" : "You win!"
        }}</span>
        <button
          class="bg-red-600 font-serif text-white p-4 px-16 hover:bg-red-700 transition-colors"
          @click="store.startGame"
        >
          Play again
        </button>
      </div>
    </Transition>
  </div>
</template>

<style global>
  html,
  body,
  #__nuxt {
    height: 100%;
  }

  .v-enter-active,
  .v-leave-active {
    transition: opacity 1s ease;
  }

  .v-enter-from,
  .v-leave-to {
    opacity: 0;
  }
</style>
