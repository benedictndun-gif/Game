<template>
  <div class="planet-container">
    <!-- Tombol Back -->
    <router-link to="/materi/merkurius" class="btn-back">BACK◂</router-link>

    <!-- Judul -->
    <div class="planet-title">Venus</div>

    <div class="planet-content">
      <!-- Gambar Planet -->
      <div class="planet-image">
        <img src="@/assets/Venus.png" alt="Venus" />
      </div>

      <!-- Deskripsi -->
      <div class="planet-desc">
        <p>Venus adalah planet terpanas dengan atmosfer tebal penuh karbon dioksida.</p>
      </div>
    </div>

    <!-- Tombol Next -->
    <router-link to="/materi/bumi" class="btn-next">▶</router-link>

    <!-- Voice Over Audio (disembunyikan) -->
    <audio ref="voiceOver" style="display: none;"></audio>
  </div>
</template>

<script>
export default {
  name: "VenusPage",
  data() {
    return {
      voiceOverSrc: require('@/assets/Venus.mp3')
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