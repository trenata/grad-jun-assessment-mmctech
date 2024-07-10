<template>
    <div>
      <h1>Artist Details</h1>
      {{ artistId }}
    </div>
  </template>
    
  <script> 
  
  export default {
    name: 'ArtistDetailsPage',
    props: {
      artistId: {
        type: String,
        required: true
      },
    },
  };
  </script>