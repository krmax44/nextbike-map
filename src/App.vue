<template>
  <v-app>
    <SearchBar />
    <v-content>
      <MapView />
    </v-content>
  </v-app>
</template>

<script>
import SearchBar from './components/SearchBar';
import MapView from './components/MapView';

export default {
  name: 'App',
  components: {
    MapView,
    SearchBar
  }
};
</script>
