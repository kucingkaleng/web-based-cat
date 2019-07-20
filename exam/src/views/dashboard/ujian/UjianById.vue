<template>
  <div>
    <section class="section">
      <div class="container">
        <h1 class="title">{{ data.title }}</h1>
        <h2 class="subtitle">
          Token : <strong>{{ data.token }}</strong>
        </h2>
        <nav class="breadcrumb has-bullet-separator" aria-label="breadcrumbs">
          <ul>
            <li><router-link to="/home">Home</router-link></li>
            <li><router-link to="/ujian">Ujian</router-link></li>
            <li class="is-active"><a href="#" aria-current="page">{{ data.title }}</a></li>
          </ul>
        </nav>

        <div class="buttons">
          <b-button type="is-primary" icon-left="plus" @click="showModalAdd">
            Tambah Rule
          </b-button>
        </div>
        
        <b-table :data="data.questions" bordered striped narrowed hoverable :loading="isLoading">
          <template slot-scope="props">
            <b-table-column field="title" label="Type">
              {{ (props.row.type) ? props.row.type : 'None' }}
            </b-table-column>

            <b-table-column field="duration" label="Kompetensi">
              {{ props.row.competency.competency }}
            </b-table-column>

            <b-table-column field="date" label="Level">
              {{ props.row.level.level }}
            </b-table-column>

            <b-table-column field="time" label="Jumlah Soal">
              {{ props.row.number }}
            </b-table-column>

            <b-table-column label="Action">
              <div class="buttons">
                <b-button type="is-info" size="is-small" icon-right="eye" title="View" tag="router-link" :to="`/ujian/${props.row._id}`" />
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
    async getExams() {
      this.$store.state.isGlobalLoading = true
      this.axios.get(`/exam/${this.$route.params.id}`)
      .then(result => {
        this.data = result.data.exam
        this.data.date = this.moment(this.data.date).format('YYYY-MM-DD')
        this.$store.state.isGlobalLoading = false
      })
    },
    showModalAdd() {
      this.isAddModalShow = true
    }
  },

  mounted() {
    this.getExams()
    this.$root.$on('refresh', () => {
      this.getExams()
    })
  },
}
</script>