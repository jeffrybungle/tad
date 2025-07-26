<template>
  <div id="app">
    <Home
      :loggedIn="true"
      :username="'AtlantisFan42'"
      :userImage="'https://via.placeholder.com/40'"
    />
  </div>
</template>

<script>
import Home from './components/Home.vue'

export default {
  name: 'App',
  components: {
    Home
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
  margin-top: 20px;
}
</style>
