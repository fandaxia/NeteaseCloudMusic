/**
 * Created by dashi on 2017/11/3.
 */

import Vue from 'vue'
import Vuex from 'vuex'
import state from './state'
import * as actions from './actions'
import * as getters from './getters'
import mutations from './mutations'


Vue.use(Vuex)


export default new Vuex.Store({
  state,
  actions,
  getters,
  mutations
})
