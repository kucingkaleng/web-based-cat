<template>
  <div>
    <div class="main-content">
      <slot />
    </div>
    <b-loading is-full-page :active.sync="$store.state.isGlobalLoading"></b-loading>
  </div>
</template>

<script>
export default {
  components: {

  },
  data() {
    return {

    }
  },
}
</script>

<style lang="scss">

</style>
