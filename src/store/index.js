import Vue from 'vue'
import Vuex from 'vuex'
import getters from "./getters";
import mutations from "./mutations";
import actions from "./actions";
import example from "./modules/example";

Vue.use(Vuex)

let state = {

}

const store = new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
  modules: {
    example
  }
})

export default store
