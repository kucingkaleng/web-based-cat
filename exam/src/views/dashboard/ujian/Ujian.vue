<template>
  <div>
    <section class="section">
      <div class="container">
        <h1 class="title">Ujian</h1>
        <h2 class="subtitle">
          A simple container to divide your page into <strong>sections</strong>, like the one you're currently reading
        </h2>

        <div class="buttons">
          <b-button type="is-primary" icon-left="plus" @click="showModalAdd">
            Tambah Baru
          </b-button>
        </div>

        <b-field>
          <b-input type="search" icon="magnify" placeholder="Search..."></b-input>
        </b-field>
        
        <b-table :data="data" bordered striped narrowed hoverable :loading="isLoading">
          <template slot-scope="props">
            <b-table-column field="title" label="Nama Ujian">
              {{ props.row.title }}
            </b-table-column>

            <b-table-column field="duration" label="Durasi">
              {{ props.row.duration+' Menit' }}
            </b-table-column>

            <b-table-column field="date" label="Tanggal">
              {{ props.row.date }}
            </b-table-column>

            <b-table-column field="time" label="Waktu">
              {{ props.row.time }}
            </b-table-column>

            <b-table-column label="Action">
              <div class="buttons">
                <b-button type="is-info" size="is-small" icon-right="arrow-right" title="Detail"
                tag="router-link" :to="`/ujian/${props.row._id}`" />
                
                <b-button type="is-warning" size="is-small" icon-right="pencil" title="Edit" @click="showModalEdit(props.row._id)" />

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

      <b-modal :active.sync="isAddModalShow" has-modal-card full-screen :can-cancel="false">
          <ModalAddUjian :isEdit="isEdit" :examId="editId" />
      </b-modal>
    </section>
  </div>
</template>

<script>
import ModalAddUjian from '@/components/dashboard/ujian/ModalAddUjian'

export default {
  components: {
    ModalAddUjian
  },
  data() {
    return {
      data: [],
      form: {
        title: '',
        duration: '',
        date: '',
        time: ''
      },
      isEdit: false,
      editId: '',
      isLoading: false,
      isAddModalShow: false
    }
  },

  methods: {
    async getExams() {
      this.$store.state.isGlobalLoading = true
      this.axios.get('/exams')
      .then(result => {
        this.data = result.data.exams
        this.data.forEach(i => i.date = this.moment(i.date).format('YYYY-MM-DD'))
        this.$store.state.isGlobalLoading = false
      })
    },
    showModalAdd() {
      this.isEdit = false
      this.isAddModalShow = true
    },
    showModalEdit(id) {
      this.isEdit = true
      this.editId = id
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