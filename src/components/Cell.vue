<template>
  <div
      @click.right="markFlag"
      class="flex w-12 h-12 text-3xl font-bold place-items-center justify-center inline-block"
      :class="hidden ? 'cellDimmed' : 'cellLit'">
    <h1 v-if="!bomb && hidden && val > 0" class="number non-drag">{{ val }}</h1>
    <img alt="bomb" v-if="bomb && hidden" class="h-8 w-auto non-drag" src="/img/bomb.png">
    <img alt="flag" v-if="flagState && !hidden" class="h-8 w-auto non-drag" src="/img/flag.png">
  </div>
</template>

<script setup lang="ts">
import {getColor} from "../utils/getColor";
import {computed, ref} from "vue";
import {CellType} from "../utils/types";

const props = defineProps<{
  // cellNumber: number,
  // bomb: boolean,
  // flag: boolean,
  cell: CellType,
}>()

const {val, bomb, dimmed, flag} = props.cell

const hidden = ref(dimmed)
const flagState = ref(flag)

const numberColor = computed(() => getColor(`--${val}`))

// function dimButton() {
//   if (!flagState.value) hidden.value = true
// }

function markFlag() {
  flagState.value = !flagState.value
}
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
