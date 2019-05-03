import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import vueKanban from 'vue-kanban';

import 'bootstrap/dist/css/bootstrap.min.css';

Vue.config.productionTip = false;

Vue.use(vueKanban);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
