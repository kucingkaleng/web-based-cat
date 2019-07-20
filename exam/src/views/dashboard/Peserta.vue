<template>
  <div>
    <section class="section">
      <div class="container">
        <h1 class="title">Peserta</h1>
        <h2 class="subtitle">
          A simple container to divide your page into <strong>sections</strong>, like the one you're currently reading
        </h2>

        <div class="buttons">
          <b-button type="is-primary" icon-left="plus" @click="showModalAdd">
            Tambah Baru
          </b-button>

          <b-button type="is-primary" icon-left="cloud-upload-outline" @click="showModalImport">
            Import
          </b-button>
        </div>
        
        <b-table :data="data" bordered striped narrowed hoverable checkable default-sort="role" :loading="isLoading">
          <template slot-scope="props">
            <b-table-column field="nomor_induk" label="Nomor Induk">
              {{ props.row.nomor_induk }}
            </b-table-column>

            <b-table-column field="data.nama" label="Nama" sortable>
              {{ props.row.data.nama }}
            </b-table-column>

            <b-table-column field="profile.profile_name" label="Profile" sortable>
              {{ (props.row.profile) ? props.row.profile.profile_name : 'None' }}
            </b-table-column>

            <b-table-column field="role" label="Role" sortable>
              {{ props.row.role }}
            </b-table-column>

            <b-table-column label="Action">
              <div class="buttons">
                <b-button type="is-info" size="is-small" icon-right="eye" title="View" />
                <b-button type="is-warning" size="is-small" icon-right="pencil" title="Edit" />
                <b-button type="is-danger" size="is-small" icon-right="delete" title="Delete" @click="confirmCustomDelete(props.row._id)" />
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
    </section>

    <b-modal :active.sync="isAddModalShow" has-modal-card :can-cancel="false">
      <div class="modal-card" style="min-width: 450px;max-width:100%;">
        <ModalAddPeserta />
      </div>
    </b-modal>

    <b-modal :active.sync="isImportModalShow" has-modal-card :can-cancel="false">
      <div class="modal-card" style="width: auto">
        <ModalImportUser />
      </div>
    </b-modal>
  </div>
</template>

<script>
import ModalImportUser from '@/components/dashboard/user/ModalImportUser'
import ModalAddPeserta from '@/components/dashboard/user/ModalAddPeserta'

export default {
  components: {
    ModalImportUser,
    ModalAddPeserta
  },

  data() {
    return {
      data: [],
      isAddModalShow: false,
      isImportModalShow: false,
      isLoading: false
    }
  },

  methods: {
    getUsers() {
      this.$store.state.isGlobalLoading = true
      this.axios.get('/users')
      .then(result => {
        this.data = result.data.users
        this.$store.state.isGlobalLoading = false
      })
    },

    deleteUser(id) {
      this.axios.delete(`/user/${id}`)
      .then(() => {
        this.getUsers()
      })
    },

    confirmCustomDelete(id) {
      this.$dialog.confirm({
        title: 'Deleting account',
        message: 'Are you sure you want to <b>delete</b> this account? This action cannot be undone.',
        confirmText: 'Delete Account',
        type: 'is-danger',
        hasIcon: true,
        onConfirm: () => this.deleteUser(id)
      })
    },

    showModalAdd() {
      this.isAddModalShow = true
    },
    showModalImport() {
      this.isImportModalShow = true
    }
  },

  mounted() {
    this.getUsers()
    this.$root.$on('refresh', () => {
      this.getUsers()
    })
  }
}
</script>