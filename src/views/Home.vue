<template>
  <div class="flex" v-for="rows in grid">
    <div v-for="cell in rows">
      <Cell @click="dimCell(cell)"
            @click.right="markFlag(cell)"
            :cell="cell"><h1>{{ cell }}</h1></Cell>
    </div>
  </div>
</template>

<script setup lang="ts">
import Cell from "../components/Cell.vue"
import {reactive} from "vue";
import {CellType} from "../utils/types";

const width = 8
const height = 8
const bombs = 10

const grid: CellType[][] = reactive([])

function dimCell(cell: CellType) {
  cell.dimmed = true
}

function markFlag(cell: CellType) {
  cell.flag = !cell.flag
}

function generateGrid() {
  for (let i = 0; i < height; i++) {
    const row: CellType[] = [];

    for (let j = 0; j < width; j++) {
      row.push({
        bomb: false,
        val: 0,
        flag: false,
        dimmed: false,
      });
    }
    grid.push(row);
  }
}

function generateBombs() {
  if (!grid) return

  for (let i = 0; i < bombs; i++) {
    let c: number
    let r: number
    do {
      c = getRandomNumber(0, 7)
      r = getRandomNumber(0, 7)
    }
    while (grid[r][c].bomb)
    {
      grid[r][c].bomb = true
    }
  }
}

function generateNumbers() {
  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      if (grid[i][j].bomb) {
        // right cell
        if (grid[i][j + 1]) grid[i][j + 1].val++

        // left cell
        if (grid[i][j - 1]) grid[i][j - 1].val++

        // check bottom row
        if (grid[i + 1]) {
          // bottom right cell
          if (grid[i + 1][j + 1]) grid[i + 1][j + 1].val++

          // bottom cell
          if (grid[i + 1][j]) grid[i + 1][j].val++

          // bottom left cell
          if (grid[i + 1][j - 1]) grid[i + 1][j - 1].val++
        }

        // check top row
        if (grid[i - 1]) {
          // top right cell
          if (grid[i - 1][j + 1]) grid[i - 1][j + 1].val++

          // top cell
          if (grid[i - 1][j]) grid[i - 1][j].val++

          // top left cell
          if (grid[i - 1][j - 1]) grid[i - 1][j - 1].val++
        }
      }
    }
  }
}

function getRandomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (1 + max - min) + min)
}

generateGrid()
generateBombs()
generateNumbers()
</script>

<style scoped>

</style>
