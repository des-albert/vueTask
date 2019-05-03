import Vue from 'vue';
import Router from 'vue-router';
import axios from 'axios';
import VueAxios from 'vue-axios';

import KanbanComponent from '@/components/KanbanComponent.vue';
import LoginComponent from '@/components/LoginComponent.vue';
import AboutComponent from '@/views/About.vue';

Vue.use(Router);
Vue.use(VueAxios, axios);


export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      name: 'about',
      path: '/about',
      component: AboutComponent
    },
    {
      name: 'login',
      path: '/login',
      component: LoginComponent
    },
    {
      name: 'kanban',
      path: '/kanban',
      component: KanbanComponent
    }
  ]
});
