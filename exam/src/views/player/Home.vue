<template>
  <div>
    <section class="section">
      <div class="container">
        <h1 class="title">Hi {{_.capitalize($store.state.user.data.nama)}}</h1>
        <h2 class="subtitle">
          Dashboard untuk <strong>Peserta</strong>
        </h2>
        <div class="columns">
          <div class="column is-two-fifths">
            <b-field label="Masukkan Token Ujian">
              <b-input v-model="token"></b-input>
            </b-field>
            <b-button type="is-primary">Submit</b-button>
          </div>
        </div>
        <div class="columns">
          <div v-for="result in results" :key="result._id" class="column is-4">
            <div class="card">
              <header class="card-header">
                <p class="card-header-title">
                  {{ result.exam.title }}
                </p>
                <a href="#" class="card-header-icon" aria-label="more options">
                  <span class="icon">
                    <i class="fas fa-angle-down" aria-hidden="true"></i>
                  </span>
                </a>
              </header>
              <div class="card-content">
                <div class="content">
                  {{ result.exam.datetime }}                  
                  <br>
                  {{ result.exam.datetime + ' === ' + now}}
                  <br>
                  <br>
                  <time :datetime="result.exam.date">{{ result.exam.time }} - {{ result.exam.date }}</time>
                </div>
              </div>
              <footer class="card-footer">
                <a href="#" class="card-footer-item">{{result.exam.alive}}</a>
                <a href="#" class="card-footer-item">Edit</a>
              </footer>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  data() {
    return {
      results: Array,
      token: '',
      now: this.moment().format('YYYY-MM-DD H:mm:ss')
    }
  },

  methods: {
    submitToken: async function () {

    },
    getExams: async function () {
      await this.axios.get(`/exams/in/${this.$store.state.user._id}`)
      .then(res => {
        this.results = res.data.results
        this.results.forEach(i => {
        })
      })
    }
  },

  created() {
    this.$store.state.isGlobalLoading = true    
  },

  mounted() {
    this.getExams()
    this.$store.state.isGlobalLoading = false
  },
}
</script>