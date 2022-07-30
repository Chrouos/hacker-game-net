<template>
  <div v-if="$route.path == '/lobby'">
    <a
      @click="logout"
      class="is-pulled-left navigation-buttons a--logout"
      style="--clr:#1B4A66"
      ><span>Logout</span>
    </a>
    <a
      href="\playerItem"
      class="is-pulled-left navigation-buttons a--member"
      style="--clr:#96E6E3;"
      ><span>
        <i class="fa-solid fa-user" style="color:white"></i>
        {{ playerItem.name }}</span
      >
    </a>
  </div>
  <!-- <div class="container">
    <div class="columns">
      <div class="column is-one-third">
        <div>
          <PlayerList />
        </div>
      </div>
      <div class="column">
        <div>
          <RoomList />
        </div>
      </div>
    </div>
  </div> -->
  <router-view />
</template>

<script>
  import PlayerList from "./components/player/PlayerList";
  import RoomList from "./components/room/RoomList";
  import RoomStart from "./components/room/RoomStart";
  import { mapGetters } from "vuex";

  export default {
    name: "App",
    components: {
      PlayerList,
      RoomList,
      RoomStart,
    },

    computed: {
      ...mapGetters(["token"]),
    },
    data() {
      return { playerItem: [] };
    },
    created() {
      const token = localStorage.getItem("token");
      if (token) {
        this.updateInitialState(token);
        this.$store.dispatch("getPlayerItems").then(() => {
          this.playerItem = this.$store.getters.playerItemFromToken(token);
          // console.log(this.playerItem);
        });
      }
    },
    methods: {
      logout() {
        this.$store
          .dispatch("logout")
          .then(() => {
            this.$router.push("/login");
          })
          .catch((error) => {
            console.log(error);
          });
      },
      updateInitialState(token) {
        this.$store.dispatch("getPlayerItems", token);
        this.$store.dispatch("getRoomItems", token);
      },
    },
    watch: {
      // 若token發生變化就會查看
      token() {
        if (this.token) {
          this.updateInitialState(this.token);
        }
      },
    },
  };
</script>

<style>
  html,
  body {
    height: 100%;
    background: #f2f6fa;
  }

  #app {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .container {
    width: 100%;
  }

  .column--align-center {
    margin: 0 auto;
  }

  .navigation-buttons {
    position: absolute;
    top: 5px;
    z-index: 99;
  }

  .navigation-buttons .button {
    margin: 0 2px;
  }

  .navigation-buttons .button .fa {
    padding-right: 5px;
  }

  .a--logout {
    background: #fff;
    color: #000;
    text-decoration: none;
    text-transform: uppercase;
    letter-spacing: 0.1;
    font-weight: 400;
    padding: 10px 30px;
    transition: 0.5s;
    left: 10px;
  }

  .a--logout:hover {
    background: var(--clr);
    color: white;
    letter-spacing: 0.25em;
  }

  .a--logout:before {
    content: "";
    position: absolute;
    inset: 2px;
    background: #1a242a;
  }
  .a--logout span {
    position: relative;
    z-index: 1;
    color: white;
  }

  .a--member {
    background: #fff;
    color: #000;
    text-decoration: none;
    text-transform: uppercase;
    letter-spacing: 0.1;
    font-weight: 400;
    padding: 10px 30px;
    transition: 0.5s;
    left: 170px;
  }

  .a--member:hover {
    background: var(--clr);
    color: white;
    letter-spacing: 0.25em;
  }

  .a--member:before {
    content: "";
    position: absolute;
    inset: 2px;
    background: #1a242a;
  }
  .a--member span {
    position: relative;
    z-index: 1;
    color: white;
  }
</style>

<!-- https://www.webdesigns.com.tw/css_align-center.asp 筆記 -->
