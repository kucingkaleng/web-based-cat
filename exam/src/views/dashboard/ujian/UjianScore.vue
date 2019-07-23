<template>
  <div>
    <section class="section">
      <div class="container">
        <h1 class="title">Score {{ exam.title }}</h1>
        <h2 class="subtitle">
          Token : <strong>{{ exam.token }}</strong>
        </h2>
        <nav class="breadcrumb has-bullet-separator" aria-label="breadcrumbs">
          <ul>
            <li><router-link to="/home">Home</router-link></li>
            <li><router-link to="/ujian">Ujian</router-link></li>
            <li><router-link :to="`/ujian/${exam._id}`">{{ exam.title }}</router-link></li>
            <li class="is-active"><a href="#">Scores</a></li>
          </ul>
        </nav>

        <div class="buttons">
          <b-button v-if="data.alive == 'Pending'" type="is-primary" icon-left="plus" @click="showModalAdd">
            Tambah Rule
          </b-button>

          <b-button v-if="data.alive != 'Pending'" type="is-success" icon-left="file" @click="showModalAdd">
            Export
          </b-button>
        </div>
        
        <b-table :data="data" bordered striped narrowed hoverable :loading="isLoading">
          <template slot-scope="props">

            <b-table-column field="user.nomor_induk" label="Nomor Induk" sortable>
              {{ props.row.user.nomor_induk }}
            </b-table-column>

            <b-table-column field="user.data.nama" label="Nama Peserta" sortable>
              {{ props.row.user.data.nama }}
            </b-table-column>

            <b-table-column label="Score">
              {{ props.row.corrects.length * props.row.score_each }}
            </b-table-column>

            <b-table-column v-if="data.alive == 'Pending'" label="Action">
              <div class="buttons">
                <b-button type="is-warning" size="is-small" icon-right="pencil" title="Edit" />
                <b-button type="is-danger" size="is-small" icon-right="delete" title="Delete" />
              </div>
            </b-table-column>
          </template>

            <template slot="empty">
              <section class="section">
                <div class="content has-text-grey has-text-centered">
                  <p>
                    <b-icon
                      icon="emoticon-sad"
                      size="is-large">
                    </b-icon>
                  </p>
                  <p>Nothing here.</p>
                </div>
              </section>
            </template>
        </b-table>
      </div>

      <b-modal :active.sync="isAddModalShow" has-modal-card :can-cancel="false">
          <ModalAddRules />
      </b-modal>
    </section>
  </div>
</template>

<script>
import ModalAddRules from '@/components/dashboard/ujian/ModalAddRules'

export default {
  components: {
    ModalAddRules
  },
  data() {
    return {
      data: {},
      exam: Object,
      form: {
        title: '',
        duration: '',
        date: '',
        time: ''
      },
      isLoading: false,
      isAddModalShow: false
    }
  },

  methods: {
    async getScores() {
      this.$store.state.isGlobalLoading = true
      this.axios.get(`/score/in/${this.$route.params.id}`)
      .then(result => {
        this.data = result.data.results
        this.$store.state.isGlobalLoading = false
      })
    },

    async getExams() {
      this.$store.state.isGlobalLoading = true
      this.axios.get(`/exam/${this.$route.params.id}`)
      .then(result => {
        this.exam = result.data.exam
        this.exam.date = this.moment(this.exam.date).format('YYYY-MM-DD')
        this.$store.state.isGlobalLoading = false
      })
    },

    showModalAdd() {
      this.isAddModalShow = true
    }
  },

  mounted() {
    this.getExams()
    this.getScores()
    this.$root.$on('refresh', () => {
      this.getExams()
    })
  },
}
</script>