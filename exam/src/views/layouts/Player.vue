<template>
  <div>
    <NavbarPlayer :items="navbar" />
    <div class="main-content">
      <slot />
    </div>
    <b-loading is-full-page :active.sync="$store.state.isGlobalLoading"></b-loading>
  </div>
</template>

<script>
import NavbarPlayer from '@/components/NavbarPlayer'

export default {
  components: {
    NavbarPlayer
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
