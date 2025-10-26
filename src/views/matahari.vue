<template>
  <div class="planet-container">
    <!-- Tombol Back -->
    <router-link to="/materi" class="btn-back">BACK◂</router-link>

    <!-- Judul -->
    <div class="planet-title">Matahari</div>

    <div class="planet-content">
      <!-- Gambar Planet -->
      <div class="planet-image">
        <img src="@/assets/Matahari.png" alt="Matahari" />
      </div>

      <!-- Deskripsi -->
      <div class="planet-desc">
        <p>Matahari adalah Bintang dan pusat dari tata surya.</p>
      </div>
    </div>

    <!-- Tombol Next -->
    <router-link to="/materi/merkurius" class="btn-next">▶</router-link>

    <!-- Voice Over Audio (disembunyikan) -->
    <audio ref="voiceOver" style="display: none;"></audio>
  </div>
</template>

<script>
export default {
  name: "MatahariPage",
  data() {
    return {
      voiceOverSrc: require('@/assets/Matahari.mp3')
    };
  },
  mounted() {
    this.playVoiceOver();
  },
  beforeUnmount() {
    // Stop audio ketika leave page
    if (this.$refs.voiceOver) {
      this.$refs.voiceOver.pause();
      this.$refs.voiceOver.currentTime = 0;
    }
  },
  methods: {
    playVoiceOver() {
      // Kasih jeda 1 detik sebelum play
      setTimeout(() => {
        if (this.$refs.voiceOver) {
          this.$refs.voiceOver.src = this.voiceOverSrc;
          this.$refs.voiceOver.load();
          this.$refs.voiceOver.play().catch(err => {
            console.error('Error playing audio:', err);
          });
        }
      }, 1000);
    }
  }
};
</script>

<style scoped>
@import "@/stylePlanet.css";
</style>