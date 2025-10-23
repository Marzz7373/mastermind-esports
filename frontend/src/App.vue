<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup>
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: linear-gradient(135deg, #0f0f1e 0%, #1a1a2e 100%);
  color: #ffffff;
  min-height: 100vh;
}

#app {
  min-height: 100vh;
}
</style>
