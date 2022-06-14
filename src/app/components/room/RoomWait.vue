<template>
  <div id="roomWaitPlayer">
    <div class="box roomWait--height">
      <div
        name="title"
        style="height:60px; text-align:center"
        class="title-div"
      >
        <span style="font-size:25px;">{{ this.roomItem.name }}</span>
      </div>
      <div class="columns">
        <div class="column playerItem--div">
          <a class="box" style="height:100%;" @click="inTheRedRoom">
            <span style="font-size:100px; color: red">
              {{ this.roomItem.player1Name }}</span
            >
          </a>
        </div>
        <div class="column" style="height:500px">
          <a class="box" style="height:100%;" @click="inTheBlueRoom">
            <span style="font-size:100px; color: blue">
              {{ this.roomItem.player2Name }}</span
            >
          </a>
        </div>
      </div>
      <div name="start" style="text-align: center; height:25px">
        <!-- <router-link :to="{ path: '/register', query: { plan: 'private' } }">
          >開始</router-link
        > -->
        <a class="button" @click="startRoom">開始</a>
        <a class="button" @click="deleteRoom">刪除房間</a>
      </div>
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
    props: ["roomId", "startRoomItem"],

    created() {
      this.roomItem = this.startRoomItem;
      // 獲得玩家資訊
      this.$store.dispatch("getPlayerItems").then(() => {
        const token = localStorage.getItem("token");
        this.playerItem = this.$store.getters.playerItemFromToken(token);
      });
      console.log("this.roomId", this.roomId);
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

        console.log("newRoom", newRoom);
        this.$store.dispatch("addRoomItem", newRoom).then(() => {
          // this.$router.push("/");
        });
      },
      deleteRoom() {
        const deleteItem = { id: this.roomId };
        this.$store.dispatch("removeRoomItem", deleteItem).then(() => {
          this.$parent.isCreate = false;
          this.$parent.isInRoom = false;
        });
      },
      startRoom() {
        this.$router.push("/roomStart/" + this.roomItem.id, {
          name: this.roomItem.id,
        });
      },

      inTheRedRoom() {
        if (
          this.roomItem.player1Id == null &&
          this.roomItem.player2Id != this.playerItem.id
        ) {
          this.roomItem.player1Id = this.playerItem.id;
          this.roomItem.player1Name = this.playerItem.name;
        } else if (this.roomItem.player1Id == this.playerItem.id) {
          this.roomItem.player1Id = null;
          this.roomItem.player1Name = null;
        }
        console.log(this.roomItem);
        this.$store.dispatch("updateRoomStart", this.roomItem).then(() => {});
      },

      inTheBlueRoom() {
        if (
          this.roomItem.player2Id == null &&
          this.roomItem.player1Id != this.playerItem.id
        ) {
          this.roomItem.player2Id = this.playerItem.id;
          this.roomItem.player2Name = this.playerItem.name;
        } else if (this.roomItem.player2Id == this.playerItem.id) {
          this.roomItem.player2Id = null;
          this.roomItem.player2Name = null;
        }
        console.log(this.roomItem);
        this.$store.dispatch("updateRoomStart", this.roomItem).then(() => {});
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
</style>
