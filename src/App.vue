<template>
  <div class="w-full h-full bg-bg">
    <router-view></router-view>
  </div>
</template>

<script setup lang="ts">

</script>

<style>
@font-face {
  font-family: "cozzette-vector";
  src: local("cozzette-vector"), url("../assets/fonts/cozette-vector.ttf") format("truetype");
}

body {
  font-family: "cozzette-vector", sans-serif;
  margin: 0;
  padding: 0;
}
</style>
