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
            <b-button type="is-primary" @click="submitToken()">Submit</b-button>
          </div>
        </div>
        <div class="columns">
          <div v-for="result in results" :key="result._id" class="column is-4">
            <HomeCard :result="result" />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import HomeCard from '@/components/player/HomeCard'

export default {
  components: {
    HomeCard
  },

  data() {
    return {
      results: Array,
      token: '',
      now: this.moment().format('YYYY-MM-DD H:mm:ss'),
      isError: ''
    }
  },

  methods: {
    submitToken: async function () {
      if (!this.token) {
        return this.toast('is-bottom','is-danger',`Tidak boleh kosong!`)
      }
      // check token is exists?
      await this.axios.post('/exam/check/token', { token: this.token })
      .then( async res => {
        if (!res.data.status) {
          return this.toast('is-bottom','is-danger',res.data)
        }
        // get all questions from exam with existed token
        await this.axios.get(`/questions/${res.data._id}`)
        .then(async () => {
          await this.getExams()
        })
        .catch(err => {
          this.isError = err.response.data.error
          return this.toast('is-bottom','is-danger',this.isError)
        })
      })
      .catch(err => {
        return this.toast('is-bottom','is-danger',this.isError)
      })
    },

    getExams: async function () {
      await this.axios.get(`/exams/in/${this.$store.state.user._id}`)
      .then(res => {
        this.results = res.data.results
      })
    },

    toast: function (pos, typ, mes) {
      this.$toast.open({
        duration: 4000,
        message: mes,
        position: pos,
        type: typ
      })
    }
  },

  created() {
    this.$store.state.isGlobalLoading = true    
  },

  async mounted() {
    await this.getExams()
    this.$store.state.isGlobalLoading = false
  },
}
</script>