<template>
  <div class="modal-card" style="width: 700px;">
    <header class="modal-card-head">
      <p class="modal-card-title">Tambah Soal</p>
    </header>
    <section class="modal-card-body">

      <b-field label="Uraian">
        <wysiwyg v-model="form.uraian" />
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
      <button class="button is-primary">Save</button>
    </footer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        uraian: '',
      },
      groups: [ 
        {id: 1, group: 'Ujian Sekolah'}
      ],
      isLoading: false,
      isAddModalShow: false
    }
  },
}
</script>