<template>
  <nav class="navbar">
    <div class="navbar-brand">
      <a class="navbar-item" href="/">
        <!-- <img src="https://bulma.io/images/bulma-logo.png" alt="Bulma: a modern CSS framework based on Flexbox" width="112" height="28"> -->
        <h1 class="title has-text-primary">
          CAT
        </h1>
      </a>
      <div class="navbar-burger burger" data-target="NavbarMain">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>

    <div id="NavbarMain" class="navbar-menu">
      <div v-if="items" class="navbar-start">
        <router-link v-for="item in items" :key="item.label" :to="item.path" class="navbar-item">
          {{ item.label }}
        </router-link>
      </div>
      <div class="navbar-end pr10 pl10">
        <b-button type="is-danger" icon-right="power" @click="logout"></b-button>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  props: {
    items: Array
  },

  methods: {
    logout: function () {
      this.$store.dispatch('logout')
      .then(() => {
        this.$router.push('/')
      })
    }
  }
}
</script>