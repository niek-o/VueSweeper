<template>
  <input class="inputCell" type="number" v-model="width">
  <input class="inputCell" type="number" v-model="height">
  <input class="inputCell" type="number" v-model="bombs">
  <Game :width="width" :height="height" :bombs="bombs"/>
</template>

<script setup lang="ts">
import Game    from "../components/Game.vue";
import { ref } from "vue";

const width  = ref(8);
const height = ref(8);
const bombs  = ref(15);

</script>

<style scoped>
.inputCell {
  @apply w-48 text-4xl bg-cell border-4 border-t-borderLight border-l-borderLight border-b-borderDark border-r-borderDark h-12
}
</style>
