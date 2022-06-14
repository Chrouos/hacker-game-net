<template>
  <div id="players" class="box--playerList block">
    <div class="showPlayer">
      <table class="playerTable ">
        <tr>
          <td><span>ID</span></td>
          <td><span>LEVEL</span></td>
        </tr>
        <tr v-for="player in playerItems" :key="player.id">
          <td>
            <span>{{ player.name }}</span>
          </td>
          <td>
            <span>{{ player.level }}</span>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from "vuex";

  export default {
    name: "PlayerList",
    created() {
      this.$store.dispatch("getPlayerItems").then(() => {
        console.log("Total Player:", this.playerItems.length);
      });
    },
    computed: {
      ...mapGetters(["playerItems"]), // mix the getters into computed with object spread operator
    },
  };
</script>

<style>
  .box--playerList {
    background: none;
    height: 150px;
    border-radius: 10px;
    color: white;
    border: 5px solid white;
    overflow: scroll;
    transition: 0.5s;
  }

  .box--playerList:hover {
    background: #21445c;
  }

  .showPlayer span {
  }

  .playerTable {
    width: 100%;
  }

  .playerTable tr td {
    vertical-align: middle;
    text-align: center;
    font-size: 20px;
  }

  .box--playerList::-webkit-scrollbar {
    display: none;
  }
</style>

<!-- margin-left: auto;
    margin-right: auto; -->
