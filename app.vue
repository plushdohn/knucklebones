<script setup lang="ts">
  import { useGameStore } from "~/stores/game";

  const store = useGameStore();

  onMounted(() => {
    setTimeout(() => {
      store.startGame();
    }, 3000);
  });

  useHead({
    title: "Knucklebones in Vue 3",
    meta: [
      {
        hid: "description",
        name: "description",
        content: "A game of Lamb vs Ratau",
      },
    ],
  });
</script>

<template>
  <div
    class="p-8 mx-auto relative max-w-xl w-full h-full overflow-y-auto flex flex-col justify-center items-center"
  >
    <div
      class="w-full flex justify-between items-center gap-4 lg:gap-12 h-full"
    >
      <div
        class="text-stone-200 flex flex-col gap-2 justify-center items-center transition-all shrink-0"
        :class="{
          grayscale: store.isCpuTurn,
          'scale-90': store.isCpuTurn,
        }"
      >
        <img src="~/assets/lamb.webp" alt="The Lamb" class="w-24" />
        <span class="text-xl lg:text-3xl font-black text-center font-serif"
          >Lamb</span
        >
        <span
          class="italic text-xl lg:text-3xl font-serif font-black text-yellow-200 mb-4"
          >{{ store.playerScore }} pts
        </span>
      </div>
      <SpinningDice v-if="store.dynamic.phase === 'ROLLING_PLAYER_DIE'" />
      <Dice
        v-else-if="store.dynamic.phase === 'PLACING_PLAYER_DIE'"
        :value="store.dynamic.playerDie"
      />
      <Board
        :columns="store.static.playerBoard"
        @place="store.placePlayerDie"
        :can-place="store.dynamic.phase === 'PLACING_PLAYER_DIE'"
      />
    </div>

    <div
      class="w-full flex justify-between items-center gap-4 lg:gap-12 h-full"
    >
      <Board :columns="store.static.cpuBoard" />
      <SpinningDice v-if="store.dynamic.phase === 'ROLLING_CPU_DIE'" />
      <Dice
        v-else-if="store.dynamic.phase === 'PLACING_CPU_DIE'"
        :value="store.dynamic.cpuDie"
      />
      <div
        class="flex flex-col items-center gap-2 text-white transition-all shrink-0"
        :class="{
          grayscale: store.isPlayerTurn,
          'scale-90': store.isPlayerTurn,
        }"
      >
        <img src="~/assets/ratau.webp" alt="Ratau" class="w-24" />
        <span class="text-xl lg:text-3xl font-black text-center font-serif"
          >Ratau</span
        >
        <span class="italic lg:text-3xl font-serif font-black text-red-600 mb-4"
          >{{ store.cpuScore }} pts</span
        >
      </div>
    </div>
    <Transition>
      <div
        v-if="store.dynamic.phase === 'GAME_STARTING'"
        class="p-8 fixed inset-0 flex justify-center text-center items-center text-4xl font-black text-white bg-stone-950/80 font-serif"
      >
        GAME IS STARTING...
      </div>
    </Transition>
    <Transition>
      <div
        v-if="store.dynamic.phase === 'GAME_OVER'"
        class="fixed inset-0 flex flex-col gap-8 justify-center items-center font-black text-white bg-stone-950/80 font-serif"
      >
        <span class="text-4xl">{{
          store.dynamic.winner === "CPU" ? "CPU wins" : "You win!"
        }}</span>
        <button
          class="bg-red-600 text-xl font-serif text-white p-4 px-16 hover:bg-red-700 transition-colors"
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
    background-color: #0c0a09;
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
