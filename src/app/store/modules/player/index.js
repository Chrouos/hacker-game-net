
import axios from 'axios'

const state = {
    playerItems: []
};
const mutations = {
    UPDATE_PLAYER_ITEMS(state, payload) {
        state.playerItems = payload;
    }
};
const actions = {
    getPlayerItems({ commit }) {
        return axios.get("/api/players").then((response) => {
            commit('UPDATE_PLAYER_ITEMS', response.data)
        });
    },
    addPlayerItem({ commit }, userItem) {
        return axios.post("/api/loginInsert", userItem).then((response) => {
            commit("UPDATE_PLAYER_ITEMS", response.data);
        });
    },
    updatePlayerItem({ commit }, playerItem) {
        console.log("index:", playerItem);
        return axios.post("/api/playersUpdate", playerItem).then((response) => {
            commit("UPDATE_PLAYER_ITEMS", response.data);
        });
    },
};
const getters = {
    playerItems: state => state.playerItems,
    playerItemFromToken: state => (token) => {
        return state.playerItems.find(playerItem => playerItem.token === token)
    }
};

const playerModule = {
    state,
    mutations,
    actions,
    getters
}

export default playerModule;