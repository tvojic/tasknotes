
<template>
  <div id="app" class="min-h-screen flex flex-col">
    <div class="jumbotron">
      <router-view />
    </div>
    <footer>
      <p>© 2025 Toni Vojić</p>
    </footer>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      isLoggedIn: false,
    };
  },
  created() {
    this.isLoggedIn = !!localStorage.getItem("user");


    if (this.isLoggedIn && this.$route.path !== "/") {
      this.$router.push("/");
    }
  },
  methods: {
    logout() {
      localStorage.removeItem("user");
      this.isLoggedIn = false;
      this.$router.push("/login");
    },
  },
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

footer {
  height: 40px;
  line-height: 40px;
  text-align: center;
  background: lightblue;
  color: black;
  position:fixed;
  bottom:0;
  width:100%;
}

.jumbotron {
  flex-grow: 1;
  background-color: #c4dbf2;
  color: black;
  padding: 3rem 2rem;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}
</style>