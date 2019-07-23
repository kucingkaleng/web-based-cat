<template>
  <div>
    <section class="section">
      <div class="container">
        <h1 class="title">Bank Soal</h1>
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
        
        <b-table
          class="is-truncated"
          :data="data"
          :paginated="true"
          :per-page="5"
          bordered striped narrowed hoverable
          detailed custom-detail-row detail-key="_id" show-detail-icon
        :loading="isLoading">
        
          <template slot-scope="props">
            <b-table-column field="title"  label="Uraian" :title="props.row.title">
              {{ props.row.title }}
            </b-table-column>

            <b-table-column field="competency.competency" label="Kompetensi" sortable>
              {{ props.row.competency.competency }}
            </b-table-column>

            <b-table-column field="type" label="Type">
              {{ (props.row.type) ? props.row.type.type : 'None' }}
            </b-table-column>

            <b-table-column label="Action">
              <div class="buttons">
                <b-button type="is-info" size="is-small" icon-right="arrow-right" title="Detail" tag="router-link" :to="`/ujian/${props.row._id}`" />
                <b-button type="is-warning" size="is-small" icon-right="pencil" title="Edit" />
                <b-button type="is-danger" size="is-small" icon-right="delete" title="Delete" @click="confirmCustomDelete(props.row._id)" />
              </div>
            </b-table-column>
          </template>

          <template slot="detail" slot-scope="props">
            <tr v-for="item in props.row.choices" :key="item._id">
              <td></td>
              <td>{{ item.answer }}</td>
              <td class="has-text-centered">{{ item.correct == 1 ? 'Benar' : '' }}</td>
            </tr>
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
    </section>

    <b-modal :active.sync="isAddModalShow" has-modal-card :can-cancel="false">
      <ModalAddBank />
    </b-modal>
  </div>
</template>

<script>
import ModalAddBank from '@/components/dashboard/bank/ModalAddBank'

export default {
  components: {
    ModalAddBank
  },
  data() {
    return {
      data: [],
      form: {
        title: '',
        date: new Date('07-13-2019'),
        time: ''
      },
      isLoading: false,
      isAddModalShow: false
    }
  },

  methods: {
    async getBanks() {
      this.isLoading = true
      this.axios.get('/banks')
      .then(result => {
        this.data = result.data.banks
        this.isLoading = false
      })
    },

    deleteBank(id) {
      this.axios.delete(`/bank/${id}`)
      .then(() => {
        this.getBanks()
      })
    },

    confirmCustomDelete(id) {
      this.$dialog.confirm({
        title: 'Hapus soal',
        message: 'Are you sure you want to <b>delete</b> this account? This action cannot be undone.',
        confirmText: 'Hapus soal',
        type: 'is-danger',
        hasIcon: true,
        onConfirm: () => this.deleteBank(id)
      })
    },

    showModalAdd() {
      this.isAddModalShow = true
    }
  },

  created() {
    this.$store.state.isGlobalLoading = true    
  },

  mounted() {
    this.getBanks()
    this.$root.$on('refresh', () => {
      this.getBanks()
    })
    this.$store.state.isGlobalLoading = false
  },
}
</script>