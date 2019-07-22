<template>
  <div class="modal-card" style="width: 700px;">
    <header class="modal-card-head">
      <p class="modal-card-title">Tambah Soal</p>
    </header>
    <section class="modal-card-body">

      <div class="columns">
        <div class="column is-12">
          <b-field label="Uraian">
            <wysiwyg v-model="form.title" />
          </b-field>
        </div>
      </div>

      <b-button size="is-small" type="is-primary">Tambah Pilihan</b-button>

      <div class="columns">
        <div class="column is-12">
          <b-field label="Tipe Soal">
            <b-select v-model="form.type" placeholder="Select a type">
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
            <b-select v-model="form.competency" placeholder="Select a competency">
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
            <b-select v-model="form.level" placeholder="Select a level">
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

    </section>
    <footer class="modal-card-foot">
      <button class="button" type="button" @click="$parent.close()">Close</button>
      <button class="button is-primary" @click="insertSoal()">Save</button>
    </footer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        uraian: '',
        type: null,
        level: null,
        competency: null,
      },
      types: [],
      competencies: [],
      levels: [],
      isLoading: false,
      isAddModalShow: false
    }
  },

  methods: {
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

    insertSoal: async function () {
      this.axios.post(`/bank`, this.form)
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