<template>
  <div v-if="questions.data">
    {{declaireChosen}}
    <div v-for="(q, index) in questions.data" :key="index" class="card is-light is-primary">
      <div class="qcard card-content">
        <div v-if="q.media" class="media-section">
          <figure class="image">
            <img :src="q.media" class="center media-img" alt="" @click="isImageModalActive = true">
          </figure>
          <p class="has-text-centered has-text-weight-bold">Clik gambar untuk memperjelas</p>
        </div>

        <p class="is-size-6 title has-text-justified mt20">
          {{ q.title }}
        </p>

        <div v-if="q.correct_count < 2" class="choices-section">
          <b-field v-for="(choice, index) in q.choices" :key="choice._id">
            <b-radio v-model="chosen" :native-value="choice._id"
            type="is-primary" class="mb20"
            @input="sendChoice(q._id)">
              <strong>{{ alphabeth(index)+'.' }}</strong> {{ choice.answer }}
            </b-radio>
          </b-field>
        </div>

        <div v-else class="choices-section">
          <b-field v-for="(choice, index) in q.choices" :key="choice._id">
            <b-checkbox v-model="chosen_multi" :native-value="choice._id" class="mb20" @input="sendChoice(q._id)">
              <strong>{{ alphabeth(index)+'.' }}</strong> {{ choice.answer }}
            </b-checkbox>
          </b-field>
        </div>
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
export default {
  props: {
    questions: Object,
    resultId: String,
    currentPage: Number
  },
  data() {
    return {
      chosen: '',
      chosen_multi: [],
      loading: false,
      media: 'https://picsum.photos/id/460/400/200',
      isImageModalActive: false
    }
  },

  computed: {
    declaireChosen: function () {
      if (this.questions.data[0].correct_count < 2) {
        this.chosen = this.questions.data[0].chosen
      }
      else {
        if (this.questions.data[0].chosen) this.chosen_multi = this.questions.data[0].chosen
      }
      return
    }
  },

  methods: {
    alphabeth: (n) => {
      return String.fromCharCode('a'.charCodeAt() + n)
    },

    sendChoice: async function (bank) {
      if (this.questions.data[0].correct_count < 2) {
        this.$store.state.isGlobalLoading = true
        await this.axios.put(`/questions/send/choosen/into/${this.resultId}`,{
          bank: bank,
          chosen: this.chosen
        })
        .then( async () => {
          /**
           * send bus to parent and change page
           */
          this.$root.$emit('nextPage',this.currentPage)
          this.$store.state.isGlobalLoading = false
        })
      }
      else {
        await this.axios.put(`/questions/send/choosen/into/${this.resultId}`,{
          bank: bank,
          chosen: this.chosen_multi
        })
      }
    }
  },

  mounted() {
    
  },
}
</script>

<style lang="scss">
.qcard.card-content {
  height: auto;
}

.media-section {
  width: 400px;
}

.media-img {
  cursor: pointer;
  max-height:300px;
}

</style>