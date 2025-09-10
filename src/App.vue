
<template>
  <div id="app">
    <nav>

    </nav>
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      isLoggedIn: false, // stanje login-a
    };
  },
  created() {
    // provjera da li je user već logiran (npr. preko localStorage)
    this.isLoggedIn = !!localStorage.getItem("user");

    // ako je logiran, preusmjeri ga na Home
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

nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>