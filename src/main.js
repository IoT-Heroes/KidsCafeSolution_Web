// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import VueRouter from "vue-router";
import App from "./App";

// router setup
import routes from "./routes/routes";

// MaterialDashboard plugin
import MaterialDashboard from "./material-dashboard";

import Chartist from "chartist";

import VueHighcharts from 'vue2-highcharts'
import Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more'
import solidgauge from "highcharts/modules/solid-gauge";


import axios from 'axios';
import 'expose-loader?$!expose-loader?jQuery!jquery'

// import THREE from 'vue-threejs'

// configure router
const router = new VueRouter({
  routes, // short for routes: routes
  linkExactActiveClass: "nav-item active"
});

HighchartsMore(Highcharts);
solidgauge(Highcharts);

Vue.use(VueHighcharts, {Highcharts});
Vue.use(VueRouter);
Vue.use(MaterialDashboard);
// Vue.use(THREE);
Vue.component('VueHighcharts', VueHighcharts);

Vue.prototype.$Chartist = Chartist;
Vue.prototype.$EventBus = new Vue();

Vue.prototype.$http = axios;

/* eslint-disable no-new */
new Vue({
  el: "#app",
  render: h => h(App),
  router,
  data: {
    Chartist: Chartist
  }
});
