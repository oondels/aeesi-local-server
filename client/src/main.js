import { createApp, Vue } from "vue";
import App from "./App.vue";
import router from "./router";

import "@mdi/font/css/materialdesignicons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import "material-design-icons-iconfont/dist/material-design-icons.css";
import "material-icons/iconfont/material-icons.css";

import VueApexCharts from "vue3-apexcharts";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import "vuetify/styles";

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    iconfont: "md",
  },
});

const appInstance = createApp(App);

appInstance.use(router);
appInstance.use(vuetify);
appInstance.use(VueApexCharts);

appInstance.mount("#app");
