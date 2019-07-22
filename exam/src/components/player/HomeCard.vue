<template>
  <div class="card">
    <header class="card-header">
      <p class="card-header-title">
        {{ result.exam.title }}
      </p>
      <a href="#" class="card-header-icon" aria-label="more options">
        <span class="icon">
          <i class="fas fa-angle-down" aria-hidden="true"></i>
        </span>
      </a>
    </header>
    <div class="card-content">
      <div class="content">                 
        Dimulai Pada: {{ result.exam.start_at}}
        <br>
        Berakhir Pada: {{ result.exam.end_at}}
        <br>
        Durasi Ujian: {{ result.exam.duration+' Minute' }}
        <br>
        <time :datetime="result.exam.date">{{ result.exam.time }} - {{ result.exam.date }}</time>
      </div>
    </div>
    <footer class="card-footer">
      <div v-if="(result.exam.alive == 'Pending')" class="card-footer-item">
        <b-button type="is-warning">
          {{ result.exam.alive }}
        </b-button>
      </div>
      <div v-if="(result.exam.alive == 'Starting' && !result.has_end)" class="card-footer-item">
        <b-button type="is-primary" tag="router-link" :to="`/play/${result.exam._id}`">
          Mulai Ujian
        </b-button>
      </div>
      <div v-if="(result.exam.alive == 'Ended' || result.has_end)" class="card-footer-item">
        <span class="tag is-danger">
          Ujian Berakhir
        </span>
      </div>
      <div v-if="(result.exam.alive == 'Ended' || result.has_end)" class="card-footer-item">
        <b-button type="is-success" @click="$router.push(`/score/${result.user}/${result.exam._id}`)">
          {{ (result.exam.alive == 'Ended' || result.has_end) ? 'Lihat Score' : '' }}
        </b-button>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  props: {
    result: Object
  }
}
</script>