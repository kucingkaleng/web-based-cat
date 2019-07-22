import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    status: '',
    token: localStorage.getItem('token') || '',
    user: {},
    isGlobalLoading: false
  },

  mutations: {
    auth_request(state) {
      state.status = 'loading'
    },
    auth_success(state) {
      state.status = 'success'
      state.token = localStorage.getItem('token')
      state.user = JSON.parse(localStorage.getItem('user'))
    },
    auth_error(state) {
      state.status = 'error'
    },
    logout(state) {
      state.status = ''
      state.token = ''
    }
  },

  actions: {
    login({commit}, user) {
      return new Promise((resolve,reject) => {
        commit('auth_request')
        axios.post('/auth/signin', user)
        .then(res => {
          const token = res.data.token
          const user = res.data.user
          localStorage.setItem('token','bearer '+token)
          localStorage.setItem('user', JSON.stringify(user))
          axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')
          commit('auth_success')
          resolve(res)
        })
        .catch(err => {
          commit('auth_error')
          localStorage.removeItem('token')
          reject(err)
        })
      })
    },

    logout({commit}){
      return new Promise(resolve => {
        commit('logout')
        localStorage.removeItem('token')
        delete axios.defaults.headers.common['Authorization']
        resolve()
      })
    }
  },

  getters: {
    isLoggedIn: async state => !!state.token,
    isAdmin: async state => state.user.role === 'admin',
    isPeserta: async state => state.user.role === 'peserta',
    authStatus: async state => state.status
  }
})
