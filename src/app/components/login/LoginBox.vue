<template>
  <a
    v-if="!isRigi"
    @click="goRegister"
    :class="[{ 'is-loading': loading }, 'button is-warning  is-light']"
    class=" toggle-button-rigister a--register"
  >
    <span>Register</span>
  </a>
  <a
    v-if="isRigi"
    @click="goRegister"
    :class="[{ 'is-loading': loading }, 'button is-warning  is-light']"
    class=" toggle-button-rigister a--register"
  >
    <span>Back</span>
  </a>
  <div id="login" class="box has-text-centered login-box " v-if="!isRigi">
    <div style="width:50%; horizontal-align:middle; height:80%">
      <h2 class="title block" style="color:white; height:20px; font-size:30px">
        Login
      </h2>
      <div class="field container-input" style="">
        <label class="label label--input" style="color:white; margin-top: 1em;"
          >Account</label
        >
        <div class="control">
          <input class="input" placeholder="0000" v-model="login_account" />
        </div>

        <label class="label" style="color:white; margin-top: 1em;"
          >Password</label
        >
        <div class="control">
          <input
            class="input"
            v-model="login_password"
            type="password"
            placeholder="********"
          />
        </div>
      </div>
    </div>

    <button
      v-if="!isRigi"
      @click="login"
      :class="[{ 'is-loading': loading }, 'button is-primary']"
      class="toggle-button"
    >
      Login
    </button>

    <button
      v-if="isRigi"
      @click="login"
      :class="[{ 'is-loading': loading }, 'button is-primary']"
      class="toggle-button"
    >
      Rigister
    </button>
  </div>

  <div id="rigister" class="box has-text-centered login-box " v-if="isRigi">
    <div
      style="width:50%; horizontal-align:middle; height:80%"
      class="scroll--login-register"
    >
      <h2 class="title block" style="color:white; height:20px; font-size:30px">
        Rigister
      </h2>
      <div class="field container-input" style="">
        <label class="label label--input" style="color:white; margin-top: 1em;"
          >Account</label
        >
        <div class="control">
          <input class="input" placeholder="0000" v-model="login_account" />
        </div>

        <label class="label" style="color:white; margin-top: 1em;"
          >Password</label
        >
        <div class="control">
          <input
            class="input"
            v-model="login_password"
            type="password"
            placeholder="********"
          />
        </div>
        <label class="label" style="color:white; margin-top: 1em;">Name</label>
        <div class="control">
          <input class="input" v-model="login_name" placeholder="test" />
        </div>
        <label class="label" style="color:white; margin-top: 1em;"
          >Introduce</label
        >
        <div class="control">
          <textarea
            class="input"
            v-model="login_introduce"
            placeholder="test"
            style="height:20%"
          />
        </div>
      </div>
    </div>
    <button
      v-if="!isRigi"
      @click="login"
      :class="[{ 'is-loading': loading }, 'button is-primary']"
      class="toggle-button"
    >
      Login
    </button>
    <button
      v-if="isRigi"
      @click="register"
      :class="[{ 'is-loading': loading }, 'button is-primary']"
      class="toggle-button"
    >
      Rigister
    </button>
  </div>
  <!-- vue 會根據這個值loading來決定要不要用這個class -->
  <div></div>
</template>

<script>
  import { mapGetters } from "vuex";

  export default {
    name: "LoginBox",
    data() {
      return {
        login_password: "",
        login_account: "",
        isRigi: false,
        login_name: "",
        login_introduce: "",
      };
    },
    computed: {
      ...mapGetters(["loading"]),
    },
    methods: {
      login() {
        const loginItem = {
          account: this.login_account,
          password: this.login_password,
        };
        console.log(loginItem);
        this.$store.dispatch("login", loginItem).then(() => {
          this.$router.push({ path: "/lobby" });
        });
      },

      goRegister() {
        this.isRigi = !this.isRigi;
      },
      register() {
        const loginItem = {
          account: this.login_account,
          password: this.login_password,
          introduce: this.login_introduce,
          name: this.login_name,
        };
        this.isRigi = !this.isRigi;
        this.$store.dispatch("addPlayerItem", loginItem).then(() => {});
      },
    },
  };
</script>

<style scoped>
  .box {
    padding: 30px;
  }

  .login-box {
    position: relative;
    width: 50%;
    height: 70%;
    background: #293338;
    border-radius: 25px;
    transition: 0.5s;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .toggle-button {
    position: absolute;
    bottom: -20px;
    min-width: 60px;
    height: 60px;
    width: 30%;
    background: #0bcf9c;
    border-radius: 10px;
    font-size: 25px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .toggle-button-rigister {
    margin: 10px;
    position: absolute;
    top: 0;
    left: 0px;
    font-size: 25px;
    justify-content: center;
    align-items: center;
    z-index: 5px;
  }

  .container-input {
    color: white;
  }

  .label--input {
    margin-top: -10px;
  }

  .scroll--login-register {
    overflow: scroll;
  }

  .scroll--login-register::-webkit-scrollbar {
    display: none;
  }

  .a--register {
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

  .a--register:hover {
    background: var(--clr);
    color: white;
    letter-spacing: 0.25em;
  }

  .a--register:before {
    content: "";
    position: absolute;
    inset: 2px;
    background: #1a242a;
  }
  .a--register span {
    position: relative;
    z-index: 1;
    color: white;
  }
</style>
