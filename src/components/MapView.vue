<template>
  <v-container class="container pa-0 ma-0" fill-height>
    <l-map
      style="height: 100%; width: 100%"
      :zoom="zoom"
      :center="center"
      :options="{ zoomControl: false }"
      @update:zoom="zoomUpdated"
      @update:center="centerUpdated"
      ref="map"
    >
      <l-tile-layer :url="url" />
      <l-control-zoom position="bottomleft" />
      <l-control-attribution
        position="bottomright"
        :prefix="`${availableBikes} available bikes`"
      />

      <l-circle
        :lat-lng="position.coords"
        :radius="position.radius"
        v-if="position.coords"
      />

      <l-marker
        :lat-lng="place.coords"
        v-for="place in places"
        :key="place.uid"
        @click="openInMaps(place)"
      >
        <l-tooltip>{{
          place.shed ? `${place.bikes.length} bikes in shed` : place.name
        }}</l-tooltip>
        <l-icon>
          <v-avatar :color="place.shed ? 'red' : 'blue'">
            <v-icon>{{ place.shed ? 'home' : 'directions_bike' }}</v-icon>
          </v-avatar>
        </l-icon>
      </l-marker>
    </l-map>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      url: 'https://{s}.tile.osm.org/{z}/{x}/{y}.png',
      zoom: 15,
      center: [48.99691673184553, 8.398318290710451],
      places: [],
      position: {},
      availableBikes: 0
    };
  },
  methods: {
    zoomUpdated(zoom) {
      this.zoom = zoom;
    },
    centerUpdated(center) {
      this.center = center;
    },
    openInMaps(bike) {
      window.location.href = `geo:${bike.coords[0]},${bike.coords[1]}`;
    },
    locatePosition() {
      if (this.position.coords) {
        this.center = this.position.coords;
        this.zoom = 20;
      }
    },
    async searchPosition(q) {
      const url = new URL('https://photon.komoot.de/api');
      url.search = new URLSearchParams({
        q,
        lat: this.center[0],
        lon: this.center[1]
      });
      const req = await fetch(url);
      const data = await req.json();
      const results = data.features.map(feature => ({
        text: feature.properties.name,
        value: { coords: feature.geometry.coordinates.reverse() }
      }));

      this.$root.$emit('searchData', results);
    },
    setMapCoords(coords) {
      this.zoom = 20;
      this.center = coords;
    }
  },
  async mounted() {
    try {
      const req = await fetch(
        'https://api.nextbike.net/maps/nextbike-live.json?city=21'
      );
      const data = await req.json();

      for (const country of data.countries) {
        for (const city of country.cities) {
          for (let place of city.places) {
            let shed = false;
            let name = place.name;
            let bikes;
            if (!place.bike) {
              bikes = place.bike_list.filter(
                bike => bike.active && bike.state === 'ok'
              );

              if (bikes.length === 0) {
                continue;
              } else if (bikes.length > 1) {
                shed = true;
                name = bikes[0].name;
              }

              this.availableBikes += bikes.length;
            }
            if (place.bike) {
              shed = false;
              bikes = 0;

              this.availableBikes++;
            }

            this.places.push({
              coords: [place.lat, place.lng],
              uid: place.uid,
              shed,
              bikes,
              name
            });
          }
        }
      }

      navigator.geolocation.getCurrentPosition(e => {
        this.position = {
          radius: e.coords.accuracy / 2,
          coords
        };
      });
    } catch (e) {
      alert(e.toString());
    }
    this.$root.$on('locatePosition', this.locatePosition);
    this.$root.$on('searchPosition', this.searchPosition);
    this.$root.$on('setMapCoords', this.setMapCoords);
  }
};
</script>

<style scoped>
.container {
  min-width: 100%;
  min-height: 100%;
}
</style>
