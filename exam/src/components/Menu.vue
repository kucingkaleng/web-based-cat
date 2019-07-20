<template>
  <div>
    <div class="sidenav">
      <b-menu>
        <b-menu-list label="Menu">
          <b-menu-item icon="gauge" label="Dashboard" tag="router-link" to="/dashboard"></b-menu-item>

          <b-menu-item icon="account" label="Users" :class="{'router-link-active': subIsActive('/peserta')}" tag="router-link" to="/peserta"></b-menu-item>

          <b-menu-item icon="door" label="Ujian" :class="{'router-link-active': subIsActive('/ujian')}" tag="router-link" to="/ujian"></b-menu-item>

          <b-menu-item icon="server-security" label="Bank Soal" :class="{'router-link-active': subIsActive('/bank')}" tag="router-link" to="/bank"></b-menu-item>
        </b-menu-list>

        <b-menu-list label="Actions">
          <b-menu-item icon="power" label="Logout" @click="logout"></b-menu-item>
        </b-menu-list>
      </b-menu>
    </div>
  </div>
</template>

<script>
export default {
  components: {

  },
  methods: {
    logout: function () {
      this.$store.dispatch('logout')
      .then(() => {
        this.$router.push('/')
      })
    },
    
    subIsActive(input) {
      const paths = Array.isArray(input) ? input : [input]
      return paths.some(path => {
        return this.$route.path.indexOf(path) === 0 // current path starts with this path string
      })
    }
  },
}
</script>

<style lang="scss">
.sidenav {
  height: 100%;
  width: 250px;
  position: fixed;
  z-index: 1;
  top: 0;
  left: 0;
  overflow-x: hidden;
  background: whitesmoke;
}

.menu {
  height:100%;
  padding: 10px 16px 10px 16px;
}

.menu-list a.router-link-active {
  background-color: #04C4A7;
  color: #ffffff;
  -webkit-box-shadow: 0 1px 3px rgba(0,0,0,.12), 0 1px 2px rgba(0,0,0,.24);
  box-shadow: 0 1px 3px rgba(0,0,0,.12), 0 1px 2px rgba(0,0,0,.24);
}

.menu-list a.router-link-active:hover {
  background-color: #04C4A7;
  color: #ffffff;
  -webkit-box-shadow: 0 1px 3px rgba(0,0,0,.12), 0 1px 2px rgba(0,0,0,.24);
  box-shadow: 0 1px 3px rgba(0,0,0,.12), 0 1px 2px rgba(0,0,0,.24);
}

.menu-list a.is-active {
  background-color: rgba(0, 0, 0, 0.0);
  color: #363636;
}

.menu-list a:hover {
    background-color: rgba(0, 0, 0, 0.0);
    color: #363636;
}

nav.navbar {
  width: 100%;
  z-index: 30;
  background-color: #FFFFFF;
}

.main {
  position: relative;
  margin-left: 250px;
}

.main-content {
  // padding-top: 25px;
}
</style>
