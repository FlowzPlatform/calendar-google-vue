import Vue from 'vue'
/* eslint-disable*/
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    startDate: '',
    endDate: '',
    arrAllEvents: [],
    token: '',
    eventTitle: '',
    eventOps: '',
    eId: '',
    updateTitle: '',
    refreshToken: '',
    updateStartDt: '',
    updateEndDt: ''
  },
  mutations: {
    startDate: state => state.startDate,
    endDate: state => state.endDate,
    token: state => state.token,
    eventTitle: state => state.eventTitle,
    eventOps: state => state.eventOps,
    eId: state => state.eId,
    updateTitle: state => state.updateTitle,
    refreshToken: state => state.refreshToken,
    updateStartDt: state => state.updateStartDt,
    updateEndDt: state => state.updateEndDt,
    ADD_EVENT(state, objEvent){
      state.arrAllEvents.push(objEvent)
      //state.arrAllEvents = []
    }
  },
  actions: {
    addEvent({commit}, objEvent){
      commit('ADD_EVENT', objEvent)
    }
  },
  plugins: [createPersistedState()]
})
