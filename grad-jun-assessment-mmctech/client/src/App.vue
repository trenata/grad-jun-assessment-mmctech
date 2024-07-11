<template>
  <div>
    <search-component></search-component>
    <router-view></router-view>
  </div>
</template>

<script>
import SearchComponent from '@/components/SearchComponent.vue';

export default {
  name: 'App',
  components: {
    SearchComponent,
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 30px; 
}

body {
  background-color: #6d9773;
}
</style>
