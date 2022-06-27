<template>
  <div class="flex flex-col">
    <div class="flex flex-row non-drag">
      <h1 class="text-center text-4xl border-4 border-red text-red bg-darkRed w-48 h-12">{{ flags }}</h1>
      <button class="w-48 text-4xl bg-cell border-4 border-t-borderLight border-l-borderLight border-b-borderDark border-r-borderDark h-12"
              @click="game.initGame(width, height, bombs)">Restart
      </button>
    </div>
    <div>
      <div class="flex" v-for="rows in grid">
        <div v-for="cell in rows">
          <Cell @click="game.clickCell(cell)" @click.right="game.markFlag(cell)" :cell="cell"></Cell>
        </div>
      </div>
    </div>
    <div class="w-96 h-12 text-center text-4xl bg-cell border-4 border-t-borderLight border-l-borderLight border-b-borderDark border-r-borderDark non-drag">
      <h1 v-if="gameOver.value">Game Over!</h1>
      <h1 v-if="win.value">You win!</h1>
    </div>
  </div>
</template>

<script setup lang="ts">
import Cell         from "../components/Cell.vue";
import { Game }     from "../utils/logic";
import { computed } from "vue";

const props = defineProps<{
  width: number,
  height: number,
  bombs: number,
}>();

const width  = computed(() => props.width);
const height = computed(() => props.height);
const bombs  = computed(() => props.bombs);

const game = new Game(width.value, height.value, bombs.value);

const grid = game.grid;

const win      = computed(() => game.win);
const gameOver = computed(() => game.gameOver);
const flags    = computed(() => game.flags);
</script>

<style scoped>

</style>
