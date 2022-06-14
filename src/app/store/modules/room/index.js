
import axios from 'axios'

const state = {
    roomItems: [],
    roomChatItem: []
};
const mutations = {
    UPDATE_ROOM_ITEMS(state, payload) {
        state.roomItems = payload;
    },
    UPDATE_ROOM_CHATS(state, payload) {
        state.roomChatItem = payload;
    }
};
const actions = {
    getRoomItems({ commit }) {
        return axios.get("/api/room").then((response) => {
            commit("UPDATE_ROOM_ITEMS", response.data)
        });
    },
    addRoomItem({ commit }, roomItem) {
        return axios.post("/api/room", roomItem).then((response) => {
            commit("UPDATE_ROOM_ITEMS", response.data);
        });
    },
    removeRoomItem({ commit }, deleteItem) {
        return axios.post("/api/room/delete", deleteItem).then((response) => {
            commit("UPDATE_ROOM_ITEMS", response.data);
        });
    },
    updateRoomStart({ commit }, updateItem) {
        return axios.post("/api/roomStartUpdate", updateItem).then((response) => {
            commit("UPDATE_ROOM_ITEMS", response.data)
        });
    },
    // room chat
    getRoomChats({ commit }) {
        return axios.get("/api/roomChat").then((response) => {
            commit("UPDATE_ROOM_CHATS", response.data)
        });
    },
    addRoomChat({ commit }, chatItem) {
        return axios.post("/api/roomChat", chatItem).then((response) => {
            commit("UPDATE_ROOM_CHATS", response.data);
        });
    },
};
const getters = {
    roomItems: state => state.roomItems,
    roomItemFromId: state => (id) => {
        return state.roomItems.find(roomItem => roomItem.id === id)
    },
    chatsItem: state => state.roomChatItem
};

const roomModule = {
    state,
    mutations,
    actions,
    getters
}

export default roomModule;