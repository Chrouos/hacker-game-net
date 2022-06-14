<template>
  <div class="block  ">
    <div
      id="roomChat"
      class="box room--chat-height scroll--room-list box-chatList"
      ref="chatDiv"
    >
      <div v-for="chat in chats">
        <p>{{ chat.name }}: {{ chat.chat }}</p>
      </div>
    </div>
    <div class="input-box-div">
      <input
        v-model="chatValue"
        v-on:keyup.enter="enterChat"
        type="text"
        required="required"
      />
      <span>Enter Chat...</span>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from "vuex";

  export default {
    name: "RoomChat",
    data() {
      return {
        playerItem: [],
        chats: [],
        chatValue: "",
      };
    },

    created() {
      this.$store.dispatch("getPlayerItems").then(() => {
        const token = localStorage.getItem("token");
        this.playerItem = this.$store.getters.playerItemFromToken(token);
        this.updateScroll();
      });
    },

    mounted() {
      //定時任務(每秒執行)
      let that = this;
      this.timer = setInterval(function() {
        that.$store.dispatch("getRoomChats").then(() => {
          that.chats = that.$store.getters.chatsItem;
          if (that.$route.path == "/lobby") that.reload();
        });
      }, 500);
    },

    methods: {
      enterChat() {
        const chat = { name: this.playerItem.name, chat: this.chatValue };
        this.$store.dispatch("addRoomChat", chat).then(() => {
          this.updateScroll();
        });
        this.chatValue = "";
      },

      updateScroll() {
        var element = document.getElementById("roomChat");
        element.scrollTop = element.scrollHeight + 10;
      },

      reload() {
        this.$refs.chatDiv.scrollTop = this.$refs.chatDiv.scrollHeight;
      },
    },
  };
</script>

<style>
  .scroll--room-list {
    overflow: scroll;
  }

  .scroll--room-list::-webkit-scrollbar {
    display: none;
  }

  .room--chat-height {
    height: 450px;
    overflow: scroll;
  }

  .box-chatList {
    background: none;
    height: 450px;
    border-radius: 10px;
    color: white;
    border: 5px solid white;
    overflow: scroll;
    font-size: 20px;
    transition: 0.5s;
  }

  .box-chatList:hover {
    background: #21445c;
  }

  .input-box-div {
    position: relative;
    transition: 0.5s;
  }

  .input-box-div:hover {
    background: #21445c;
  }

  .input-box-div input {
    width: 100%;
    height: 40px;
    padding: 10px;
    border: 5px solid rgba(255, 255, 255, 0.25);
    background: none;
    border-radius: 5px;
    outline: none;
    color: #fff;
    font-size: 1em;
  }

  .input-box-div span {
    position: absolute;
    left: 0;
    padding: 10px;
    pointer-events: none;
    font-size: 1em;
    color: rgba(255, 255, 255, 0.25);
    text-transform: uppercase;
    transition: 0.5s;
  }

  .input-box-div input:valid ~ span,
  .input-box-div input:focus ~ span {
    color: #00dfc4;
    transform: translateX(10px) translateY(50px);
    font-size: 20px;
    padding: 0 10px;
    background: #152f41;
    border-left: 1px solid white;
    border-right: 1px solid white;
    letter-spacing: 5px;
  }
</style>
