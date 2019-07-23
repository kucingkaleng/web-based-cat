<template>
  <div>

    <div class="columns is-centered">
      <div class="column is-8">
        <section class="section">
          <div class="container">
            <QuestionCard :resultId="result._id" :questions="questions" :currentPage="questions.page" />
          </div>
        </section>
      </div>

      <div class="column">
        <section class="section">
          <div class="card is-light">
            <div class="card-content">
              <div class="level is-mobile">
                <div class="level-item has-text-centered">
                  <b-button type="is-primary" icon-right="arrow-left" size="is-large"
                  v-if="questions.page > 1" @click="switchPage(questions.page-1)"></b-button>
                </div>
                <div class="level-item has-text-centered">
                  <h1 class="title">{{ questions.page }}</h1>
                </div>
                <div class="level-item has-text-centered">
                  <b-button type="is-primary" icon-right="arrow-right" size="is-large"
                  v-if="questions.page < questions.total_pages" @click="switchPage(questions.page+1)"></b-button>                  
                </div>
              </div>
              
              <div class="level">
                <div class="level-right mt20">
                  <div class="level-item">
                    <b-field label="Waktu Tersisa">
                      <h2 class="title">
                        <countdown v-if="isTick" :time="duration" @end="durationEnd">
                          <template slot-scope="props">{{ props.hours }} : {{ props.minutes }} : {{ props.seconds }}</template>
                        </countdown>
                      </h2>
                    </b-field>
                  </div>
                </div>

                <div class="level-left mt20">
                  <div class="level-item has-text-centered">
                    <b-field label="Ke Halaman">
                      <b-select placeholder="Pilih Halaman" @input="jumpPage()" v-model="selectedPage">
                        <option v-for="i in questions.total_pages" :value="i" :key="i" :class="_.includes(answers,result.questions[i-1]) ? 'terisi' : ''">
                          {{ i }}
                        </option>
                      </b-select>
                    </b-field>
                  </div>
                </div>
              </div>

              <b-field>
                <b-button type="is-primary" class="mt30" style="width:100%;" @click="confirmEndExam()">
                  Akhiri Ujian
                </b-button>
              </b-field>
            </div>
          </div>
        </section>
      </div>
    </div>

    <b-modal :active.sync="isImageModalActive">
      <figure class="image">
        <img :src="media">
      </figure>
    </b-modal>
  </div>
</template>

<script>
import QuestionCard from '@/components/player/QuestionCard'

export default {
  components: {
    QuestionCard
  },

  data() {
    return {
      result: {
        exam: {}
      },
      answers: Array,
      questions: {},
      duration: '',
      isTick: false,
      selectedPage: ''
    }
  },

  methods: {
    getExam: function () {
      this.axios.get(`/play/${this.$route.params.examId}`)
      .then(res => {
        this.result = res.data.result
        this.answers = this._.map(this.result.answers, 'bank')
        this.duration = res.data.result.exam.remaining_time
        this.isTick = true
      })
    },

    getQuestion: async function (page, perPage) {
      await this.axios.get(`/questions/${this.$route.params.examId}/paginate`, {
        params: {
          page: page,
          per_page: perPage
        }
      })
      .then(res => {
        this.questions = res.data
      })
    },
    
    /** Pindah halaman selanjutnya atau sebelumnya */
    switchPage: async function (n) {
      await this.getExam()
      this.getQuestion(n,1)
    },

    /** pindah ke halaman tertentu */
    jumpPage: async function () {
      await this.getExam()
      this.getQuestion(this.selectedPage,1)
    },

    /** kondisi jika durasi habis atau end */
    durationEnd: async function () {
      await this.examEnded()
    },

    examEnded: async function () {
      await this.axios.put(`/play/${this.$route.params.examId}/declare/end`)
      .then(() => {
        this.$router.push('/')
        this.$toast.open('Anda Mengkhiri Ujian.')
      })
    },

    confirmEndExam() {
      let m
      if (this.result.questions.length == this.answers.length) {
        m = 'Waktu masih tersisa, apakah anda yakin untuk <b>Mengakhiri</b> Ujian? anda tidak akan bisa masuk kembali.'
      }
      else {
        m = 'Ada soal yang belum terisi dan waktu masih tersisa, apakah anda yakin untuk <b>Mengakhiri</b> Ujian? anda tidak akan bisa masuk kembali.'
      }
      this.$dialog.confirm({
        title: 'Akhiri Ujian',
        message: m,
        confirmText: 'Ya Saya Sakin',
        type: 'is-danger',
        hasIcon: true,
        onConfirm: async () => {
          await this.examEnded()
        }
      })
    }
  },

  created() {
    this.$store.state.isGlobalLoading = true    
  },

  async mounted() {
    await this.getExam()
    await this.getQuestion(1,1)

    /** event bus untuk pindah halaman setelah menjawab soal */
    this.$root.$on('nextPage', async (n) => {
      await this.getExam()
      /** jika halaman belum terakhir pindah ke halaman selanjutnya */
      if (this.questions.page < this.questions.total_pages) await this.getQuestion(n+1,1)
    })
    this.$store.state.isGlobalLoading = false
  },

}
</script>

<style lang="scss">
.card.is-light {
  background-color: hsl(0, 0%, 96%);
}

.max-height {
  height: 100vh;
}

.center {
  display: block;
  margin-left: auto;
  margin-right: auto;
}

.terisi {
  background: hsl(171, 100%, 41%);
  color: #ffffff !important;
}
</style>
