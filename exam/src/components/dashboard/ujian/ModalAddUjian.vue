<template>
  <div class="modal-card" style="width: auto">
    <header class="modal-card-head">
      <p class="modal-card-title">{{ isEdit ? 'Edit Ujian' : 'Tambah Ujian'}}</p>
    </header>
    <section class="modal-card-body">
      <b-field label="Nama Ujian">
        <b-input type="text" v-model="form.title" placeholder="eg. Ujian Sekolah" required></b-input>
      </b-field>

      <b-field label="Durasi">
        <b-timepicker v-model="form.duration" placeholder="Click to select..." icon="clock" hour-format="24"></b-timepicker>
      </b-field>

      <b-field label="Tanggal">
        <b-datepicker v-model="form.date" :date-formatter="(date) => moment(date).format('YYYY-MM-DD')" placeholder="Click to select..." icon="calendar-today"></b-datepicker>
      </b-field>

      <b-field label="Jam">
        <b-timepicker v-model="form.time" placeholder="Click to select..." icon="clock" enable-seconds hour-format="24"></b-timepicker>
      </b-field>

      <b-field label="Token Ujian">
        <b-input type="text" v-model="form.token" placeholder="eg. US2019S2" required></b-input>
      </b-field>

      <b-field label="Group">
        <b-select placeholder="Select a group">
          <option
            v-for="option in groups"
            :value="option.id"
            :key="option.id">
            {{ option.group }}
          </option>
        </b-select>
      </b-field>

    </section>
    <footer class="modal-card-foot">
      <button class="button" type="button" @click="$parent.close()">Close</button>
      <button class="button is-primary" @click="createExam()">Save</button>
    </footer>
  </div>
</template>

<script>
export default {
  props: {
    isEdit: Boolean,
    examId: String
  },

  data() {
    return {
      form: {
        title: '',
        duration: new Date('1997-01-15 00:00:00'),
        date: new Date('1997-01-15 00:00:00'),
        time: new Date('1997-01-15 00:00:00'),
        token: '',
        group: null
      },
      groups: [
        {id: 1, group: 'Ujian Sekolah'}
      ],
      isLoading: false,
      isAddModalShow: false
    }
  },

  methods: {
    formatDate(date) {
      return this.moment(date).format('YYYY-MM-DD')
    },

    createExam: async function () {
      // mutation date or time format
      this.form.duration = this.moment(this.form.duration).format("HH:mm") // convert durasi ke hour and minute
      this.form.duration = this.moment.duration(this.form.duration).asMinutes() // convert durasi ke minutes
      this.form.date = this.moment(this.form.date).format('YYYY-MM-DD')
      this.form.time = this.moment(this.form.time).format("HH:mm")

      if (!this.isEdit) {
        this.axios.post('/exam', this.form)
        .then(() => {
          this.$parent.close()
          this.$root.$emit('refresh')
        })
        .catch(err => {
          this.isError = err.response.data.error
        })
      }
      else {
        this.axios.put(`/exam/${this.examId}`, this.form)
        .then(() => {
          this.$parent.close()
          this.$root.$emit('refresh')
        })
        .catch(err => {
          this.isError = err.response.data.error
        })
      }
    },

    getExam: async function () {
      await this.axios.get(`/exam/${this.examId}`)
      .then(res => {
        let exam = res.data.exam
        // mutations
        exam.date = new Date(exam.date)
        exam.time = new Date('1997-01-15 '+exam.time)
        exam.duration = this.minutesToHours(exam.duration)
        exam.duration = new Date('1997-01-15 '+exam.duration)
        
        this.form = exam
      })
    },

    minutesToHours: function (mins) {
      if (mins >= 24 * 60 || mins < 0) {
          throw new RangeError("Valid input should be greater than or equal to 0 and less than 1440.");
      }
      var h = mins / 60 | 0,
          m = mins % 60 | 0;
      return this.moment.utc().hours(h).minutes(m).format("HH:mm");
    }
  },

  async mounted() {
    if (this.isEdit) {
      await this.getExam()
    }
  },
}
</script>