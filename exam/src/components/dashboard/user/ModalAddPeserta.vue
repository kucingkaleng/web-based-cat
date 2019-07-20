<template>
  <div>
    <header class="modal-card-head">
      <p class="modal-card-title">Tambah Peserta</p>
    </header>
    <section class="modal-card-body">
      <b-field label="Nomor Induk" :message="(isError) ? isError : ''">
        <b-input type="text" v-model="form.nomor_induk" placeholder="eg. 1514268759665" required></b-input>
      </b-field>

      <b-field label="Nama Peserta">
        <b-input type="text" v-model="form.data.nama" placeholder="eg. Ratih" required></b-input>
      </b-field>

      <b-field label="User Admin">
        <b-switch v-model="form.role" true-value="admin" false-value="peserta">
          {{ _.capitalize(form.role) }}
        </b-switch>
      </b-field>

      <b-field label="Profile">
        <b-select placeholder="Select a profile" v-model="form.profile">
          <option v-for="option in profiles" :value="option._id" :key="option._id" required>
            {{ option.profile_name }}
          </option>
        </b-select>
      </b-field>

    </section>
    <footer class="modal-card-foot">
      <button class="button" type="button" @click="$parent.close()">Close</button>
      <button class="button is-primary" @click="createUser">Save</button>
    </footer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        nomor_induk: '',
        data: {
          nama: ''
        },
        role: 'peserta',
        profile: null
      },
      profiles: [],
      isError: false,
      isEdit: false,
      isLoading: false
    }
  },

  methods: {
    getProfiles: async function () {
      this.axios.get('/profiles')
      .then(res => {
        this.profiles = res.data.profiles
      })
    },
    createUser: async function () {
      if (this.form.profile == null) {
        return alert('hahahaha')
      }

      this.axios.post('/auth/signup', this.form)
      .then(() => {
        this.$parent.close()
        this.$root.$emit('refresh')
      })
      .catch(err => {
        this.isError = err.response.data.error
      })
    }
  },

  mounted() {
    this.getProfiles()
  },
}
</script>