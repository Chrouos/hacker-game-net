import { createStore } from "vuex";
// 不需要加上 /index.js 是因為預設就會自動導入 index.js
import player from './modules/player';
import room from './modules/room'
import login from './modules/login';


export default createStore({
    modules: {
        player,
        room,
        login,
    }
});