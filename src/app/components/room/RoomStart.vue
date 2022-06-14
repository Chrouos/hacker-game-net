<template>
  <div style="width:100%;">
    <div class="columns">
      <div class="column" style="background-color: #BC3522;">
        <div
          style="color:black; margin:30px; opacity: 50%; user-select: none;"
          class="box"
        >
          <p>攻擊筆記</p>
          <p>1. protector: 防禦。（hp +100）</p>
          <p>
            2. beamCannon: 光束加農砲（hp -50），若對面下木馬會變對方的
          </p>
          <p>3. hack: 駭入別人的，要四秒（hp -25）</p>
          <p>4. horse: 木馬</p>
          <p>5. worm: 不怕木馬（hp-25）</p>
          <p>努力佔據更多的節點吧!!</p>
          <p>假如要用防禦守住第一個節點 ex. protector 1</p>
        </div>
        <div
          style="color:black; margin:30px; opacity: 40%; user-select: none; height: 40%;"
          class="box"
        >
          <div v-for="memo in player1Memo">
            {{ memo }}
          </div>
        </div>
        <div
          style="color:white; margin:30px; opacity: 40%; user-select: none; "
        >
          <span style="font-size:200px;"> {{ roomItem.player1Name }}</span>
        </div>

        <div name="player1Input" class="input--div" style="left:1%">
          <input
            class="input--input"
            v-if="redStart && inRed"
            v-on:keyup.enter="playerEnter(1)"
            v-model="player1Value"
          />
          <input
            class="input--input"
            v-if="!redStart || !inRed"
            style=" background-color: gray;"
            disabled="true"
            v-on:keyup.enter="playerEnter(2)"
            v-model="player2Value"
          />
        </div>
      </div>

      <div>
        <div class="middle--line">
          <div style="height:10vh"></div>
          <div>
            <div
              v-for="circle in this.roomItem.circle"
              style="text-align:center"
            >
              <span v-if="!circle.owner" class="circle--size">
                <i class="fa-regular fa-circle">&nbsp{{ circle.id }}</i>
              </span>
              <span v-if="circle.owner == 'red'" class="circle--size">
                <i class="fa-solid fa-circle" style="color: #BC3522;"
                  >&nbsp{{ circle.id }}</i
                >
              </span>
              <span v-if="circle.owner == 'blue'" class="circle--size">
                <i class="fa-solid fa-circle" style="color:#4D8EBF"
                  >&nbsp{{ circle.id }}</i
                >
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="column" style="background-color: #4D8EBF;">
        <div style="color:black; margin:30px; opacity: 50%; " class="box">
          <!-- user-select: none; -->

          <p>攻擊筆記</p>
          <p>1. protector: 防禦。（hp +100）</p>
          <p>
            2. beamCannon: 光束加農砲（hp -50），若對面下木馬會變對方的
          </p>
          <p>3. hack: 駭入別人的，要四秒（hp -25）</p>
          <p>4. horse: 木馬</p>
          <p>5. worm: 不怕木馬（hp-25）</p>
          <p>努力佔據更多的節點吧!!</p>
          <p>假如要用防禦守住第一個節點 ex. protector 1</p>
        </div>

        <div
          style="color:black; margin:30px; opacity: 40%; user-select: none; height: 40%;"
          class="box"
        >
          <div v-for="memo in player2Memo">
            {{ memo }}
          </div>
        </div>

        <div
          style="color:white; margin:30px; opacity: 40%; user-select: none; "
        >
          <span style="font-size:200px;"> {{ roomItem.player2Name }}</span>
        </div>

        <div name="player2Input" class="input--div" style="right:1%">
          <input
            v-if="blueStart && inBlue"
            class="input--input"
            v-on:keyup.enter="playerEnter(2)"
            v-model="player2Value"
          />
          <input
            class="input--input"
            v-if="!blueStart || !inBlue"
            style=" background-color: gray;"
            disabled="true"
            v-on:keyup.enter="playerEnter(2)"
            v-model="player2Value"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from "vuex";

  export default {
    name: "RoomStart",
    data() {
      return {
        player1Value: null,
        player2Value: null,
        roomItem: [],
        redStart: false,
        blueStart: false,
        player1Memo: [],
        player2Memo: [],
        prePlayer: "",
        inRed: false,
        inBlue: false,
      };
    },

    props: ["roomId"],
    created() {
      // 獲得玩家資訊
      this.$store.dispatch("getPlayerItems").then(() => {
        const token = localStorage.getItem("token");
        this.playerItem = this.$store.getters.playerItemFromToken(token);
      });

      this.$store.dispatch("getRoomItems").then(() => {
        this.roomItem = this.$store.getters.roomItemFromId(Number(this.roomId));
        // 判斷誰先手
        if (this.roomItem.nowPlayer == "red") {
          this.redStart = true;
          this.prePlayer = "red";
        } else if (this.roomItem.nowPlayer == "blue") {
          this.blueStart = true;
          this.prePlayer = "blue";
        }

        if (this.playerItem.id == this.roomItem.player1Id) {
          this.inRed = true;
        } else if (this.playerItem.id == this.roomItem.player2Id) {
          this.inBlue = true;
        }
        console.log(this.inRed, this.inBlue);

        this.start();
      });
    },
    computed: {},

    mounted() {},

    methods: {
      start() {
        let that = this;
        this.timer = setInterval(function() {
          that.$store.dispatch("getRoomItems").then(() => {
            that.roomItem = that.$store.getters.roomItemFromId(
              Number(that.roomId)
            );

            if (that.roomItem.nowPlayer != that.prePlayer) {
              that.judgeWinner();
              that.updatePlayer();
              console.log(
                "that.redStart, that.blueStart:",
                that.redStart,
                that.blueStart
              );
            }
          });
        }, 500);
      },
      end() {
        clearInterval(this.timer);
        this.timer = null; // 这里最好清除一下，回归默认值
      },

      playerEnter(player) {
        this.$store.dispatch("getRoomItems").then(() => {
          this.roomItem = this.$store.getters.roomItemFromId(
            Number(this.roomId)
          );
          this.end();

          let valueList;
          if (player == 1) {
            valueList = this.player1Value.split(/\s+/); // "\\s+" 是正則表示式，代表至少一個或多個空白。
            this.player1Memo.push(this.player1Value);
          } else if (player == 2) {
            valueList = this.player2Value.split(/\s+/); // "\\s+" 是正則表示式，代表至少一個或多個空白。
            this.player2Memo.push(this.player2Value);
          }

          // 防禦網: 直接幫節點增加100點血量
          if (valueList[0] == "protector") {
            this.roomItem.circle[valueList[1]].hp =
              this.roomItem.circle[valueList[1]].hp + 100;
          }
          // 光束加農砲: 每次-25 | if -> status狀態是 horse(代表有木馬程式了)
          else if (
            valueList[0] == "beamCannon" &&
            !this.roomItem.circle[valueList[1]].temper
          ) {
            if (!this.roomItem.circle[valueList[1]].temper && player == 1) {
              if (this.roomItem.circle[valueList[1]].status == "horse")
                this.roomItem.circle[valueList[1]].temper = "blue";
              else this.roomItem.circle[valueList[1]].temper = "red";
              this.roomItem.circle[valueList[1]].status = "beamCannon";
            }
            if (!this.roomItem.circle[valueList[1]].temper && player == 2) {
              if (this.roomItem.circle[valueList[1]].status == "horse")
                this.roomItem.circle[valueList[1]].temper = "red";
              else this.roomItem.circle[valueList[1]].temper = "blue";
              this.roomItem.circle[valueList[1]].status = "beamCannon";
            }
          }
          // 木馬(放入木馬後若別人用光束加農砲入入侵就會變成你的)
          else if (
            valueList[0] == "horse" &&
            !this.roomItem.circle[valueList[1]].owner
          ) {
            this.roomItem.circle[valueList[1]].status = "horse";
          }

          // 駭入別人的 (hp-25)
          else if (valueList[0] == "hack") {
            if (this.roomItem.circle[valueList[1]].owner == "red") {
              this.roomItem.circle[valueList[1]].status = "hack";
              this.roomItem.circle[valueList[1]].temper = "blue";
            } else if (this.roomItem.circle[valueList[1]].owner == "blue") {
              this.roomItem.circle[valueList[1]].status = "hack";
              this.roomItem.circle[valueList[1]].temper = "red";
            }
          }

          // 蠕蟲(不怕木馬)
          else if (
            valueList[0] == "worm" &&
            !this.roomItem.circle[valueList[1]].owner
          ) {
            if (player == 1) this.roomItem.circle[valueList[1]].temper = "red";
            else if (player == 2)
              this.roomItem.circle[valueList[1]].temper = "blue";
            this.roomItem.circle[valueList[1]].status = "worm";
          }

          if (player == 1) {
            this.player1Value = null;
            this.roomItem.nowPlayer = "blue";
            this.blueStart = true;
            this.redStart = false;
          } else if (player == 2) {
            this.player2Value = null;
            this.roomItem.nowPlayer = "red";
            this.redStart = true;
            this.blueStart = false;
          }
          console.log(this.roomItem);
          this.updateBattlefield();

          this.$store.dispatch("updateRoomStart", this.roomItem).then(() => {
            this.start();
          });
        });
      },

      judgeWinner() {
        var red = 0,
          blue = 0;
        for (var i = 0; i < 15; i++) {
          if (this.roomItem.circle[i].owner == "red") red = red + 1;
          else if (this.roomItem.circle[i].owner == "blue") blue = blue + 1;
        }
        // 若兩邊大於15
        if (red + blue >= 15) {
          this.playerItem.totalGame = this.playerItem.totalGame + 1;
          if (red > blue) {
            this.roomItem.winner = this.roomItem.player1Id;
            if (this.roomItem.player1Id == this.playerItem.id) {
              this.playerItem.winGame = this.playerItem.winGame + 1;
            }
            this.$store
              .dispatch("updatePlayerItem", this.playerItem)
              .then(() => {});

            const deleteItem = { id: this.roomId };
            this.$store.dispatch("removeRoomItem", deleteItem).then(() => {});

            this.$router.push({
              name: "RoomWinner",
              params: { winner: this.roomItem.player1Name },
            });
          } else if (blue > red) {
            this.roomItem.winner = this.roomItem.player2Id;
            if (this.roomItem.player2Id == this.playerItem.id) {
              this.playerItem.winGame = this.playerItem.winGame + 1;
            }

            this.$store
              .dispatch("updatePlayerItem", this.playerItem)
              .then(() => {});

            const deleteItem = { id: this.roomId };
            this.$store.dispatch("removeRoomItem", deleteItem).then(() => {});

            this.$router.push({
              name: "RoomWinner",
              params: { winner: this.roomItem.player2Name },
            });
          }
        }
      },

      updatePlayer() {
        if (this.roomItem.nowPlayer == "red") {
          this.prePlayer = "red";
          this.redStart = true;
          this.blueStart = false;
        } else if (this.roomItem.nowPlayer == "blue") {
          this.prePlayer = "blue";
          this.redStart = false;
          this.blueStart = true;
        }
      },

      updateBattlefield() {
        for (var i = 0; i < 15; i++) {
          if (this.roomItem.circle[i].status == "beamCannon") {
            this.roomItem.circle[i].hp = this.roomItem.circle[i].hp - 50;
          }

          if (this.roomItem.circle[i].status == "hack") {
            this.roomItem.circle[i].hp = this.roomItem.circle[i].hp - 25;
          }

          if (this.roomItem.circle[i].status == "worm") {
            this.roomItem.circle[i].hp = this.roomItem.circle[i].hp - 25;
          }

          if (this.roomItem.circle[i].hp <= 0) {
            this.roomItem.circle[i].owner = this.roomItem.circle[i].temper;
          }
        }
      },
    },

    beforeUnmount() {
      clearInterval(this.timer);
    },
  };
</script>

<style>
  .circle--size {
    font-size: 25px;
    margin-bottom: 15px;
  }

  .middle--line {
    height: 100vh;
    background-color: #f0e84f;
    width: 70px;
  }

  .input--div {
    position: absolute;
    bottom: 15px;
    width: 45%;
  }

  .input--input {
    width: 100%;
    border-style: none;
    background-color: black;
    height: 30px;
    color: floralwhite !important;
  }

  .background--div {
    background-color: #2e2e2e;
  }

  body::-webkit-scrollbar {
    display: none;
  }
</style>
