<template>
  <div class="floating-card flex">
    <v-container fill-height>
      <div>
        <v-autocomplete
          hide-details
          prepend-inner-icon="search"
          single-line
          solo
          no-data-text=""
          :no-filter="true"
          v-model="model"
          :search-input.sync="searchTerm"
          :items="searchResults"
          :loading="searchLoading"
          @change="selectItem"
          @keyup.enter="searchPosition"
        >
          <template v-slot:append>
            <v-btn
              icon
              class="pa-0 ma-0"
              @click="$root.$emit('locatePosition')"
            >
              <v-icon>my_location</v-icon>
            </v-btn>
          </template>
        </v-autocomplete>
      </div>
    </v-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      model: null,
      searchTerm: null,
      searchResults: [],
      searchLoading: false
    };
  },
  methods: {
    searchPosition() {
      this.searchLoading = true;
      this.$root.$emit('searchPosition', this.searchTerm);
    },
    searchData(results) {
      this.searchLoading = false;
      this.searchResults = results;
    },
    selectItem(item) {
      this.$root.$emit('setMapCoords', item.coords);
    }
  },
  mounted() {
    this.$root.$on('searchData', this.searchData);
  }
};
</script>

<style scoped>
.floating-card {
  position: absolute;
  z-index: 9999;
}
</style>
