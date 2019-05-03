import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    userName: '',
    logged_in: false
  },
  mutations: {
    change(state, value) {
      state.userName = value;
    },
    logged_in(state, value) {
      state.logged_in = value;
    }
  },
  getters: {
    user: state => state.userName,
    logstate: state => state.logged_in
  },
  actions: {}
});
