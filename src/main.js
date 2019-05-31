import Vue from 'vue';
import './plugins/vuetify';
import App from './App.vue';
import {
  LMap,
  LTileLayer,
  LMarker,
  LControlZoom,
  LControlAttribution,
  LTooltip,
  LIcon,
  LCircle,
  LCircleMarker
} from 'vue2-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'roboto-fontface/css/roboto/roboto-fontface.css';
import 'material-design-icons-iconfont/dist/material-design-icons.css';
import './registerServiceWorker';

Vue.component('l-map', LMap);
Vue.component('l-tile-layer', LTileLayer);
Vue.component('l-marker', LMarker);
Vue.component('l-tooltip', LTooltip);
Vue.component('l-icon', LIcon);
Vue.component('l-circle', LCircle);
Vue.component('l-circle-marker', LCircleMarker);
Vue.component('l-control-zoom', LControlZoom);
Vue.component('l-control-attribution', LControlAttribution);

delete Icon.Default.prototype._getIconUrl;

Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

Vue.config.productionTip = false;

new Vue({
  render: h => h(App)
}).$mount('#app');
