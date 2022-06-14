<template>
  <div class="winner">
    <p>恭喜你 {{ winner }}!!!!</p>
    <p></p>
    <p>{{ waw }}...</p>
  </div>
</template>

<script>
  import { mapGetters } from "vuex";

  export default {
    name: "RoomStart",
    data() {
      return {
        waw: 5,
      };
    },

    props: {
      winner: {
        type: String,
      },
    },

    computed: {},

    created() {
      console.log("this.winner", this.winner);
      this.timer();
    },

    methods: {
      timer() {
        let my = this;
        this.time = setInterval(() => {
          my.waw = my.waw - 1;
          if (my.waw == 0) {
            this.$router.push("/lobby");
          }
        }, 1000);
      },
      setTime() {
        this.timer();
      },
      stopTime() {
        if (this.time) {
          clearInterval(this.time);
        }
      },
    },
  };
</script>

<style>
  .winner {
    text-align: center;
    color: white;
    font-size: 150px;
  }
</style>
