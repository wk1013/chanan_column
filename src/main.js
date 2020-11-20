import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import Element from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './assets/css/style.css';
import './assets/iconfont';

import TopHtml from "@/components/top/Top.vue";
import FootHtml from "@/components/commonFooter/CommonFooter.vue"

Vue.use(Element);
Vue.use(TopHtml);
Vue.use(FootHtml);

Vue.component('top-html', TopHtml);
Vue.component('foot-html', FootHtml);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  component: {
    TopHtml,
    FootHtml
  },
  render: h => h(App)
}).$mount("#app");
