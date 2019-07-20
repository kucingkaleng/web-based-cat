<template>
  <div class="modal-card" style="width: auto">
    <header class="modal-card-head">
      <p class="modal-card-title">Tambah Aturan Soal</p>
    </header>
    <section class="modal-card-body">
      <div class="columns">
        <div class="column is-12">
          <b-field label="Tipe Soal">
            <b-select placeholder="Select a type">
              <option
                v-for="option in types"
                :value="option._id"
                :key="option._id">
                {{ option.type }}
              </option>
            </b-select>
          </b-field>
        </div>
      </div>
  
      <div class="columns">
        <div class="column is-6">
          <b-field label="Skema Kompetensi">
            <b-select placeholder="Select a competency">
              <option
                v-for="option in competencies"
                :value="option._id"
                :key="option._id">
                {{ option.competency }}
              </option>
            </b-select>
          </b-field>
        </div>
  
        <div class="column is-6">
          <b-field label="Level Kesulitan">
            <b-select placeholder="Select a level">
              <option
                v-for="option in levels"
                :value="option._id"
                :key="option._id">
                {{ option.level }}
              </option>
            </b-select>
          </b-field>
        </div>
      </div>

      <div class="columns">
        <div class="column is-12">
          <b-field label="Jumlah Soal">
            <b-input type="text" v-model="form.token" required></b-input>
          </b-field>
        </div>
      </div>

    </section>
    <footer class="modal-card-foot">
      <button class="button" type="button" @click="$parent.close()">Close</button>
      <button class="button is-primary" @click="updateExam()">Save</button>
    </footer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        type: null,
        level: null,
        competency: null,
        number: null
      },
      types: [],
      competencies: [],
      levels: [],
      isEdit: false,
      isLoading: false,
      isAddModalShow: false
    }
  },

  methods: {
    formatDate(date) {
      return this.moment(date).format('YYYY-MM-DD')
    },

    getTypes: async function () {
      this.axios.get('/types')
      .then(res => {
        this.types = res.data.types
      })
    },
    getLevels: async function () {
      this.axios.get('/levels')
      .then(res => {
        this.levels = res.data.levels
      })
    },
    getCompetencies: async function () {
      this.axios.get('/competencies')
      .then(res => {
        this.competencies = res.data.competencies
      })
    },

    updateExam: async function () {
      this.axios.put(`/exam/${this.$route.params.id}`, this.form)
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
    this.getTypes()
    this.getLevels()
    this.getCompetencies()
  }
}
</script>