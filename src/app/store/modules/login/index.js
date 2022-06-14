import axios from "axios";

const state = {
  token: null,
  loading: false
};

const mutations = {
  SET_TOKEN(state, token) {
    state.token = token;
  },
  LOGIN_PENDING(state) {
    state.loading = true;
  },
  LOGIN_SUCCESS(state) {
    state.loading = false;
  }
};

const actions = {
  login({ commit }, loginItem) {
    commit('LOGIN_PENDING'); // login pending
    return axios.post("/api/login", loginItem).then((response) => {
      localStorage.setItem("token", response.data.token);
      commit("SET_TOKEN", response.data.token);
      commit('LOGIN_SUCCESS'); // login success
    });
  },
  logout({ commit }) {
    return new Promise((resolve) => {  // promise 為了確保 logout才做動作
      localStorage.removeItem("token");
      commit('SET_TOKEN', null);
      resolve();
    });
  }

};

const getters = {
  token: (state) => state.token,
  loading: state => state.loading
};

const loginModule = {
  state,
  mutations,
  actions,
  getters,
};

export default loginModule;