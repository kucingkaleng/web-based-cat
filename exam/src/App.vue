<template>
  <div id="app">
    <component :is="layout">
      <keep-alive>
        <router-view :key="$route.fullPath"/>
      </keep-alive>
    </component>
  </div>
</template>

<script>
const default_layout = "landing"

export default {
  computed: {
    layout() {
      return (this.$route.meta.layout || default_layout) + '-layout'
    }
  },
  created() {
    if (localStorage.getItem('user') || localStorage.getItem('user') != 'undefined') {
      this.$store.state.user = JSON.parse(localStorage.getItem('user'))
    }
  },
}
</script>

<style lang="scss">

</style>
