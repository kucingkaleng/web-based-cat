<template>
  <div>
    <Navbar :items="navbar" />
    <div class="main-content">
      <slot />
    </div>
    <b-loading is-full-page :active.sync="$store.state.isGlobalLoading"></b-loading>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar'

export default {
  components: {
    Navbar
  },
  data() {
    return {
      navbar: [
        { label: 'Home', icon: '', path: '/home'}
      ]
    }
  },
}
</script>

<style lang="scss">

</style>
