<template>
  <div>
    <header class="modal-card-head">
      <p class="modal-card-title">Import Peserta</p>
    </header>
    <section class="modal-card-body">
      <b-field>
        <b-upload v-model="dropFiles" drag-drop>
          <section class="section">
            <div class="content has-text-centered">
              <p>
                <b-icon icon="upload" size="is-large"></b-icon>
              </p>
              <p>Drop your files here or click to upload</p>
            </div>
          </section>
        </b-upload>
      </b-field>

      <div class="tags">
        <span v-if="dropFiles" class="tag is-primary" >
          {{ dropFiles.name }}
          <button class="delete is-small" type="button" @click="deleteDropFile()">
          </button>
        </span>
      </div>
    </section>
    <footer class="modal-card-foot">
      <button class="button" type="button" @click="$parent.close()">Close</button>
      <button class="button is-primary">Save</button>
    </footer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        title: '',
        date: new Date('07-13-2019'),
        time: ''
      },
      dropFiles: null,
      isLoading: false,
      isAddModalShow: false
    }
  },

  methods: {
    deleteDropFile() {
      this.dropFiles = null
    }
  }
}
</script>