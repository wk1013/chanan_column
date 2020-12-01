import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import Element from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './assets/css/style.css';
import './assets/iconfont';

import Nothing from "@/components/dialog/nothing.vue";

Vue.use(Element);
Vue.use(Nothing);

Vue.component('nothing', Nothing);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  component: {
    Nothing,

  },
  render: h => h(App)
}).$mount("#app");
