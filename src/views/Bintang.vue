<template>
  <div class="planet-container">
    <!-- Tombol Back -->
    <router-link to="/materi/neptunus" class="btn-back">BACK◂</router-link>

    <!-- Judul -->
    <div class="planet-title">Bintang</div>

    <div class="planet-content">
      <!-- Gambar Planet -->
      <div class="planet-image">
        <img src="@/assets/Bintang.png" alt="Bintang" />
      </div>

      <!-- Deskripsi -->
      <div class="planet-desc">
        <p>Bintang adalah benda langit yang memancarkan cahayanya sendiri. Matahari adalah bintang yang paling dekat dengan Bumi. Di malam hari, kita bisa melihat ribuan bintang lain yang sangat jauh.</p>
      </div>
    </div>

    <!-- Tombol Next -->
    <router-link to="/materi" class="btn-next">🏠</router-link>

    <!-- Voice Over Audio (disembunyikan) -->
    <audio ref="voiceOver" style="display: none;"></audio>
  </div>
</template>

<script>
export default {
  name: "BintangPage",
  data() {
    return {
      voiceOverSrc: require('@/assets/Bintang.mp3')
    };
  },
  mounted() {
    this.playVoiceOver();
  },
  beforeUnmount() {
    if (this.$refs.voiceOver) {
      this.$refs.voiceOver.pause();
      this.$refs.voiceOver.currentTime = 0;
    }
  },
  methods: {
    playVoiceOver() {
      setTimeout(() => {
        if (this.$refs.voiceOver) {
          this.$refs.voiceOver.src = this.voiceOverSrc;
          this.$refs.voiceOver.play().catch(err => console.error('Error playing audio:', err));
        }
      }, 1000);
    }
  }
};
</script>

<style scoped>
@import "@/stylePlanet.css";
</style>
