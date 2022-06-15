<template>
  <div class="flex" v-for="rows in grid">
    <div v-for="cell in rows">
      <Cell @click="dimCell(cell)"
            @click.right="markFlag(cell)"
            :cell="cell"></Cell>
    </div>
  </div>
</template>

<script setup lang="ts">
import Cell from "../components/Cell.vue"
import {reactive, Ref, ref} from "vue";
import {CellType} from "../utils/types";

const width = 8
const height = 8
const bombs = 10

const gameOver: Ref<boolean> = ref(false)

const grid: CellType[][] = reactive([])

function dimCell(cell: CellType) {
  if(gameOver.value) {
    return
  }

  if(cell.flag) {
    return
  }

  if(cell.bomb) {
    dimAllBombs()
    gameOver.value = true
  }

  cell.dimmed = true

  // Autoclear tiles
  if(cell.val === 0) {
    autoClear(cell)
  }
}

function dimAllBombs() {
  grid.forEach(row => {
    row.forEach(cell => {
      if(cell.bomb) cell.dimmed = true;
    })
  })
}

function autoClear(cell: CellType) {
  if(grid[cell.row][cell.col+1] && !grid[cell.row][cell.col+1].dimmed) dimCell(grid[cell.row][cell.col+1]) // right
  if(grid[cell.row][cell.col-1] && !grid[cell.row][cell.col-1].dimmed) dimCell(grid[cell.row][cell.col-1]) // left
  if (grid[cell.row-1] && !grid[cell.row-1][cell.col].dimmed) dimCell(grid[cell.row-1][cell.col]) // top
  if (grid[cell.row+1] && !grid[cell.row+1][cell.col].dimmed) dimCell(grid[cell.row+1][cell.col]) // bottom
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
        row: i,
        col: j,
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
        if (grid[i][j + 1]) grid[i][j + 1].val++ // right cell
        if (grid[i][j - 1]) grid[i][j - 1].val++ // left cell

        if (grid[i + 1]) { // check bottom row
          if (grid[i + 1][j + 1]) grid[i + 1][j + 1].val++ // bottom right cell
          if (grid[i + 1][j]) grid[i + 1][j].val++ // bottom cell
          if (grid[i + 1][j - 1]) grid[i + 1][j - 1].val++ // bottom left cell
        }

        if (grid[i - 1]) { // check top row
          if (grid[i - 1][j + 1]) grid[i - 1][j + 1].val++ // top right cell
          if (grid[i - 1][j]) grid[i - 1][j].val++ // top cell
          if (grid[i - 1][j - 1]) grid[i - 1][j - 1].val++ // top left cell
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
