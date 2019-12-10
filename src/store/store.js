import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    loading: null
  },
  mutations: {
    showLoading (state) {
      state.loading = Vue.prototype.$loading({text: '拼命加载中', background: 'rgba(0, 0, 0, 0)'});
    },
    hideLoading (state) {
      if(state.loading)
          state.loading.close();
    }
  }
})

export default store
