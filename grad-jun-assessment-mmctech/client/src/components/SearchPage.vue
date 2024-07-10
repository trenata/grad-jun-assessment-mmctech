<template>
    <div>
      <ul>
        <li v-for="result in results" :key="result.length"> 
          {{ result }}
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  import { ref, onBeforeMount, watch } from 'vue';
  import { fetchSearchResults } from '@/services/api.js';
  
import { useRoute } from 'vue-router'
  
  export default {
    name: 'SearchPage',
    setup() {
      const route = useRoute()
        
      const results = ref();

      watch(
        () => route.query.input,
        async () => {
          results.value = await fetchSearchResults(route.query.input); 
        }
      )
  
      onBeforeMount(async () => {
        results.value = await fetchSearchResults(route.query.input); 
      });
  
      return {
        results,
      }
    }
  }
  </script>
  