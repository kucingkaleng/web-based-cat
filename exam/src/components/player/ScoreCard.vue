<template>
  <div>
    <div class="columns is-centered is-vcentered" style="height:100vh;">
      <div class="column is-3">
        <div class="card">
          <div class="card-content">
            <p class="subtitle has-text-centered mb-20">Score anda</p>
            <p class="title has-text-centered">
              {{ result.corrects.length*result.score_each }}
            </p>
          </div>
          <footer class="card-footer">
            <router-link to="/" class="card-footer-item">Kembali ke halaman awal</router-link>
          </footer>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      result: {}
    }
  },

  methods: {
    getScore: async function () {
      await this.axios.get(`/score/by/${this.$route.params.userId}/in/${this.$route.params.examId}`)
      .then(res => {
        this.result = res.data.result
      })
    }
  },

  async mounted() {
    await this.getScore()
  },
}
</script>