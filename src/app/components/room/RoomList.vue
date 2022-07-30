<template>
  <div
    id="roomList"
    v-if="!isInRoom && !isCreate"
    class="block scroll--room-list room-list-div"
  >
    <div class=" room--list-height ">
      <div v-for="room in roomItems" :key="room.id">
        <div style="margin:10px" class="roomItem-box">
          <a class="box roomItem-box" @click="intoTheRoom(room)">
            <td style="width:80vh">
              <p class="roomItem-box-title">{{ room.name }}</p>
              <p class="vs">
                {{ room.player1Name }} v.s {{ room.player2Name }}
              </p>
            </td>
          </a>
        </div>
      </div>
    </div>
  </div>
  <div class="password--box" v-if="isPassword">
    <input
      type="text"
      placeholder="password"
      v-model="enterPassword"
      v-on:keyup.enter="enterRoom"
    />
    <p v-if="errorPassword" style="color:red">密碼輸入錯誤</p>
    <a @click="cancel" style="color:white">back</a>
  </div>

  <div class="block" v-if="isInRoom && !isCreate">
    <RoomWait :roomId="this.room.id" :startRoomItem="this.room" />
  </div>
  <div class="block" v-if="isCreate">
    <RoomCreate />
  </div>

  <div class="block" v-if="!isInRoom && !isCreate">
    <a class="button create-a" @click="createRoom">
      <span>Create</span>
    </a>
  </div>
  <div class="block" v-if="isInRoom || isCreate">
    <a class="button create-a" @click="returnRoom">
      <span>返回</span>
    </a>
  </div>
</template>

<script>
  import { mapGetters } from "vuex";
  import RoomWait from "./RoomWait";
  import RoomCreate from "./RoomCreate";

  export default {
    name: "RoomList",
    data() {
      return {
        isInRoom: false,
        room: [],
        isPassword: false,
        enterPassword: "",
        errorPassword: false,
        isCreate: false,
      };
    },
    created() {
      // emitter.on("create-room", (event) => {
      // this.isCreate = false;
      // this.isInRoom = true;
      // this.room = event.roomItem;
      // console.log("event:", event);
      // });
      this.$store.dispatch("getRoomItems").then(() => {});
    },
    mounted() {
      // 定時任務(每秒執行);
      let that = this;
      this.timer = setInterval(function() {
        that.$store.dispatch("getRoomItems").then(() => {});
      }, 500);
    },

    computed: {
      ...mapGetters(["roomItems"]), // mix the getters into computed with object spread operator
    },
    methods: {
      intoTheRoom(room) {
        // console.log("intoTHEroom:", room);
        this.room = room;
        if (this.room.password) this.isPassword = true;
        else this.isInRoom = true;
      },
      createRoom() {
        this.room = [];
        this.isInRoom = false;
        this.isCreate = true;
      },
      returnRoom() {
        this.isCreate = false;
        this.isInRoom = false;
      },
      enterRoom() {
        if (this.room.password == this.enterPassword) {
          this.isInRoom = true;
          this.isPassword = false;
          this.errorPassword = false;
        } else {
          this.errorPassword = true;
        }
        this.enterPassword = "";
      },
      cancel() {
        this.isPassword = false;
      },
    },
    components: {
      RoomWait,
      RoomCreate,
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

  .room--list-height {
    height: 650px;
    padding: 20px;
  }

  .password--box {
    width: 500px;
    background: #5d6061;
    position: absolute;
    top: 5px;
    z-index: 99;
    left: 25vh;
    top: 25vh;
    opacity: 97%;
    border-radius: 25px;
    padding: 40px;
    color: white;
  }

  .password--box input {
    height: 60px;
    width: 100%;
    background: none;
    color: white;
    text-align: center;
    font-size: 45px;
  }

  .room-list-div {
    background: none;
    border: 5px solid white;
    box-shadow: 10px 10px 20px black;
    transition: 0.5s;
  }

  .room-list-div:hover {
    background: #21445c;
    border: 5px solid white;
    box-shadow: 10px 5px 5px black;
  }

  .create-a {
    color: white;
    background: none;
    height: 30px;
    width: 70px;
    border: 3px solid #4e5e69;
    transition: 0.5s;
    font-size: 15px;
  }

  .create-a:hover {
    color: white;
    background: #21445c;
    border: 3px solid #4e5e69;
    width: 150px;
  }

  .roomItem-box {
    font-size: 20px;
    height: 100px;
    box-shadow: 10px 5px black;
    background: #4d6a7d;
    color: #929292;
    transition: 0.5s;
    letter-spacing: 0.1;
  }
  .roomItem-box:hover {
    height: 150px;
    font-size: 30px;
    width: auto;
    color: white;
  }

  .roomItem-box .vs {
    font-size: 20px;
    transition: 0.5s;
  }
  .roomItem-box:hover .vs {
    font-size: 30px;
    letter-spacing: 0.25em;
  }

  .roomItem-box p {
    width: 100%;
    text-align: center;
  }

  .roomItem-box-title {
    color: white;
  }
</style>
