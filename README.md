# Description

This is a remake of the [Knucklebones](https://www.youtube.com/watch?v=y4PfvZiEs5E) minigame from [Cult of the Lamb](https://store.steampowered.com/app/1313140/Cult_of_the_Lamb/) in Vue 3 using Nuxt.

The core of the game is in `stores/game` under a single Pinia store. The idea was to experiment with "state variants", a sort of hand-made state machine that changes the shape of the state when the machine enters a new state.

None of the assets are owned by me and they are taken from Cult of the Lamb's wiki so refer to that for use outside of this demo.

The game has no real AI. All CPU choices are made at random (but taking into account invalid moves).

## Local setup

Clone the repo, run `pnpm i` and `pnpm dev` to start the app.
