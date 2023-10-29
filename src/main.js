import Vue from "vue";

import { ToastPlugin, ModalPlugin } from "bootstrap-vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

// Global Components
import "./global-components";

// 3rd party plugins
import "@/plugins/toastification";
import "@/plugins/portal-vue";
import "@/plugins/sweet-alerts";
import "@/plugins/tabler-icons";
import "@/plugins/loading-overlay";
import "@/plugins/smart-table";
import "@/plugins/v-select";
import "@/plugins/apex-charts";
import "@/plugins/json-viewer";
import "@/plugins/oh-vue-icons";

// Feather font icon
import "@/assets/fonts/feather/iconfont.css";

// import core styles
// import "@/assets/scss/core.scss";

// Flatpicker styles
import "flatpickr/dist/flatpickr.css";
import "@/assets/css/plugins/forms/pickers/form-flat-pickr.css";

// Vue Select custom styles
import "@/assets/css/vue-select.css";

// Dropzone custom styles
import "vue2-dropzone/dist/vue2Dropzone.min.css";
import "@/assets/css/plugins/forms/form-file-uploader.css";

// Form Wizard Custom Styles
import "@/assets/css/bs-stepper.css";
import "@/assets/css/form-wizard.css";

/*
 - Load CSS Style from assets -
 */
import "@/assets/vendors/css/vendors.min.css";
import "@/assets/vendors/css/waves/waves.min.css";
import "@/assets/css/bootstrap.css";
import "@/assets/css/bootstrap-extended.css";
import "@/assets/css/colors.css";
import "@/assets/css/components.css";
import "@/assets/css/themes/dark-layout.css";
import "@/assets/css/themes/bordered-layout.css";
import "@/assets/css/themes/semi-dark-layout.css";
import "@/assets/css/core/menu/menu-types/vertical-menu.css";
import "@/assets/css/core/menu/menu-types/vertical-overlay-menu.css";
import "@/assets/css/styles.css";

Vue.use(router);

// BSV Plugin Registration
Vue.use(ToastPlugin);
Vue.use(ModalPlugin);

Vue.config.productionTip = false;

store.dispatch("auth/getTokenFromCache").then(() => {
  new Vue({
    store,
    router,
    render: (h) => h(App),
  }).$mount("#app");
});
