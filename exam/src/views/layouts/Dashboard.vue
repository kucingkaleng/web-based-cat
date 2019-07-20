<template>
  <div>
    <Menu />
    <div class="main">
      <div class="topnav">
        <Navbar />
      </div>
      <div class="main-content">
        <slot />
      </div>
    </div>
    <b-loading is-full-page :active.sync="$store.state.isGlobalLoading"></b-loading>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar'
import Menu from '@/components/Menu'

export default {
  components: {
    Menu,
    Navbar
  }
}
</script>

<style lang="scss">

</style>
