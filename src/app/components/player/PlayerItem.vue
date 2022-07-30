<template>
  <div v-if="$route.path == '/playerItem'">
    <a
      href="/"
      class="is-pulled-left navigation-buttons a--logout"
      style="--clr:#1B4A66"
      ><span>return</span>
    </a>
  </div>
  <div id="players" class="playerItem">
    <div>
      <form class="playerInfo">
        <div name="title" style="justify-content: center; align-items: center;">
          <p style="font-size:60px">角色資訊</p>
        </div>
        <div name="information" class="information">
          <p>遊戲ID</p>
          <input type="text" placeholder="遊戲ID" v-model="id" />
          <p>自我介紹</p>
          <textarea
            type="textarea"
            placeholder="自我介紹"
            v-model="introduce"
          />
          <p>勝利場次: {{ playerItem.winGame }}</p>
          <a class="updateBtn" @click="update"><span>UPDATE</span></a>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from "vuex";

  export default {
    name: "PlayerList",
    data() {
      return { playerItem: [], id: "", introduce: "" };
    },
    created() {
      this.$store.dispatch("getPlayerItems").then(() => {
        const token = localStorage.getItem("token");
        this.playerItem = this.$store.getters.playerItemFromToken(token);
        // console.log(this.playerItem);
        this.id = this.playerItem.name;
        this.introduce = this.playerItem.introduce;
      });
    },
    computed: {
      ...mapGetters(["token"]),
    },

    methods: {
      update() {
        const updateItem = {
          id: this.playerItem.id,
          name: this.id,
          introduce: this.introduce,
          level: this.playerItem.level,
          winGame: this.playerItem.winGame,
          account: this.playerItem.account,
          password: this.playerItem.password,
          token: this.playerItem.token,
        };
        // console.log("updateItem", updateItem);
        this.$store.dispatch("updatePlayerItem", updateItem).then(() => {});
      },
    },
  };
</script>

<style>
  .playerItem {
    background: #4b82b3;
    width: 600px;
    height: 550px;
    justify-content: center;
    align-items: center;
    border-radius: 10px;
    padding: 40px;
    box-shadow: 10px 10px 20px black;
    font-size: 35px;
    color: white;
    text-shadow: black 0.1em 0.1em 0.2em;
  }
  .playerInfo p {
    display: block;
    text-align: center;
  }

  .playerInfo input {
    height: 50px;
    width: 100%;
    display: block;
    margin-bottom: 20px;
    text-align: center;
    background: none;
    padding: 13px;
    font-size: 30px;
    color: white;
    border-radius: 22px;
    outline: none;
    border: 2px solid #f0f8ff;
  }
  .playerInfo textarea {
    width: 100%;
    display: block;
    height: 50px;
    margin-bottom: 20px;
    text-align: center;
    background: none;
    font-size: 20px;
    color: white;
    border-radius: 22px;
    outline: none;
    border: 2px solid #f0f8ff;
  }

  .information input[type="submit"] {
    margin: 20px auto;
    width: 150px;
    height: 80px;
    border: 5px solid #fff699;
  }

  .updateBtn {
    background: none;
    height: 60px;
    width: 130px;
    border-radius: 20px;
    margin: 20px auto;
    display: block;
    font-size: 20px;
    border: 5px solid white;
    color: white;
    letter-spacing: 0.1;
    transition: 0.5s;
    padding: 5px auto;
    box-shadow: 10px 10px 20px black;
    align-items: center;
    text-align: center;
    padding: 10px;
  }

  .updateBtn:hover {
    letter-spacing: 0.25em;
    width: 150px;
    background: white;
    color: #4b82b3;
    font-weight: bold;
    text-shadow: none;
  }

  .updateBtn:before {
    position: absolute;
    inset: 2px;
    background: #1a242a;
  }
</style>
