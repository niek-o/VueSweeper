<template>
  <div
      class="flex w-12 h-12 text-3xl font-bold place-items-center justify-center inline-block"
      :class="dimmed || fakeDimmed ? 'cellDimmed' : 'cellLit'">
    <h1 v-if="!bomb && dimmed && val > 0" class="number non-drag">{{ val }}</h1>
    <img alt="bomb" v-if="bomb && dimmed" class="h-8 w-auto non-drag" src="/img/bomb.png">
    <img alt="flag" v-if="flag && !dimmed" class="h-8 w-auto non-drag" src="/img/flag.png">
  </div>
</template>

<script setup lang="ts">
import {getColor} from "../utils/getColor";
import {computed} from "vue";
import {CellType} from "../utils/types";

const props = defineProps<{
  cell: CellType,
}>()

const val = computed(() => props.cell.val)
const bomb = computed(() => props.cell.bomb)
const dimmed = computed(() => props.cell.dimmed)
const flag = computed(() => props.cell.flag)
const fakeDimmed = computed(() => props.cell.fakeDimmed)

const numberColor = computed(() => getColor(`--${val.value}`))

</script>

<style scoped>
.number {
  color: v-bind(numberColor)
}

.cellLit {
  @apply bg-cell border-cellBorder border-r-borderDark border-b-borderDark border-t-borderLight border-l-borderLight
}

.cellDimmed {
  @apply bg-cell border-4 border-t-borderDark border-l-borderDark border-r-0 border-b-0
}

</style>
