<template>
  <div class="container">
    <div class="columns">
      <div class="column is-one-third">
        <div>
          <PlayerList />
          <RoomChat />
        </div>
      </div>
      <div class="column">
        <div>
          <RoomList />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import PlayerList from "../player/PlayerList";
  import RoomList from "./RoomList";
  import RoomStart from "./RoomStart";
  import RoomChat from "./RoomChat";

  export default {
    name: "RoomLobby",
    components: {
      PlayerList,
      RoomList,
      RoomStart,
      RoomChat,
    },
  };
</script>

<style>
  html,
  body {
    background: #f2f6fa;
  }

  #app {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  @media screen and (min-width: 769px) {
    html,
    body {
      height: 100%;
    }
  }
</style>

<!-- https://www.webdesigns.com.tw/css_align-center.asp 筆記 -->
