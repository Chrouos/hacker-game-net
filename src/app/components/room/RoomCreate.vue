<template>
  <div id="roomWaitCreate" v-if="!this.roomId" class="room-wait-create">
    <div class="field">
      <label class="label">房間名稱</label>
      <div class="control">
        <input
          class="input"
          type="text"
          placeholder="請輸入房間名稱..."
          v-model="roomTitle"
        />
      </div>
    </div>

    <div class="field">
      <div class="block">
        <label class="label">Password</label>
        <div class="control">
          <input
            class="input"
            type="password"
            placeholder="********"
            v-model="roomPassword"
          />
        </div>
      </div>
    </div>

    <div class="create-btn-div">
      <a class="create-room-a" @click="createRoom">建立</a>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from "vuex";

  export default {
    name: "RoomWait",
    data() {
      return {
        roomTitle: "Come to play!!",
        roomPassword: "",
        roomItem: [],
      };
    },
    props: ["roomId"],

    created() {
      // 獲得玩家資訊
      this.$store.dispatch("getPlayerItems").then(() => {
        const token = localStorage.getItem("token");
        this.playerItem = this.$store.getters.playerItemFromToken(token);
      });
    },

    mounted() {
      // 定時任務(每秒執行);
      let that = this;
      this.timer = setInterval(function() {
        that.$store.dispatch("getRoomItems").then(() => {
          that.roomItem = that.$store.getters.roomItemFromId(
            Number(that.roomId)
          );
        });
      }, 500);
    },

    computed: {
      ...mapGetters(["roomItems"]), // mix the getters into computed with object spread operator
    },
    methods: {
      createRoom() {
        var lastId = 0;
        if (!this.roomItems[this.roomItems.length - 1]) lastId = 1;
        else lastId = this.roomItems[this.roomItems.length - 1].id + 1;

        var newRoom = {
          id: lastId,
          name: this.roomTitle,
          createrId: this.playerItem.id,
          player1Id: this.playerItem.id,
          player1Name: this.playerItem.name,
          player2Id: null,
          player2Name: null,
          start: false,
          password: this.roomPassword,
        };

        // console.log("newRoom", newRoom);
        this.$store.dispatch("addRoomItem", newRoom).then(() => {
          // const emitter = mitt();
          // emitter.emit("intoTheRoom", newRoom);
          this.$parent.isCreate = false;
          this.$parent.room = newRoom;
          this.$parent.isInRoom = true;
        });
      },
    },
  };
</script>

<style>
  .window--center {
    position: absolute;
    top: 50%;
    left: 50%;
  }

  .div--center {
    text-align: center !important;
  }

  .roomWait--height {
    height: 650px;
  }

  .playerItem--div {
    height: 500px;
    text-align: center;
  }

  .room-wait-create {
    background: none;
    border: 5px solid white;
    padding: 10px;
    border-radius: 5px;
  }

  .room-wait-create label {
    color: white;
    text-align: center;
    font-size: 50px;
  }

  .room-wait-create input {
    color: white;
    text-align: center;
    height: 50px;
    font-size: 30px;
    background: none;
    outline: none;
    border-radius: 5px;
    border: 2px solid rgba(255, 255, 255, 0.25);
  }

  .create-btn-div {
    background: none;
    font-size: 25px;
    padding: 10px;
    margin: 10px;
    text-align: center;
    align-items: center;
  }

  .create-room-a {
    color: rgba(255, 255, 255, 0.25);
    border: 1px solid rgba(255, 255, 255, 0.25);
    font-size: 25px;
    padding: 10px 20px;
    transition: 0.5s;
  }

  .create-room-a:hover {
    color: white;
    border: 3px solid white;
    letter-spacing: 0.5;
    font-size: 30px;
    padding: 10px 30px;
  }
</style>
