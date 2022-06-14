import { createRouter, createWebHistory } from 'vue-router';
import PlayerList from '../components/player/PlayerList.vue';
import PlayerItem from '../components/player/PlayerItem.vue';
import RoomList from '../components/room/RoomList.vue'
import RoomWait from '../components/room/RoomWait.vue'
import RoomStart from '../components/room/RoomStart.vue'
import RoomLobby from '../components/room/RoomLobby.vue'
import NotFound from '../components/NotFound.vue';
import LoginBox from '../components/login/LoginBox.vue';
import RoomWinner from '../components/room/RoomWinner.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/player",
      component: PlayerList
    },
    {
      path: "/playerItem",
      component: PlayerItem
    },
    {
      path: "/RoomWinner",
      name: 'RoomWinner',
      component: RoomWinner,
      props: (route) => route.params
    },
    {
      path: "/roomList",
      component: RoomList
    },
    {
      path: "/roomWait",
      component: RoomWait
    },
    {
      path: "/lobby",
      component: RoomLobby
    },
    {
      path: "/",
      redirect: "/login",
    },
    {
      path: '/roomStart/:roomId',
      component: RoomStart,
      props: true,
    },
    {
      path: '/roomWait/:roomId',
      component: RoomWait,
      props: true,
    },
    {
      path: '/:pathMatch(.*)*',
      component: NotFound
    },
    {
      path: '/login',
      component: LoginBox,
      beforeEnter: (to, from, next) => {
        const token = localStorage.getItem("token");
        if (token)
          next('/lobby');
        else
          next();
      }
    },

  ],
});

// 限制: 若沒有login也沒有token一定要先login
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");
  if (!token && to.path !== '/login')
    next('/login');
  else
    next();
});



export default router;