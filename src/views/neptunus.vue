<template>
  <div class="planet-container">
    <router-link to="/materi/uranus" class="btn-back">BACK◂</router-link>
    <div class="planet-title">Neptunus</div>

    <div class="planet-content">
      <div class="planet-image">
        <img src="@/assets/Neptunus.png" alt="Neptunus" />
      </div>
      <div class="planet-desc">
        <p>
          Neptunus adalah planet terjauh dari Matahari dan memiliki angin tercepat di tata surya.
        </p>
      </div>
    </div>

    <!-- Tombol kembali ke materi utama -->
    <router-link to="/materi" class="btn-next">🏠</router-link>

    <!-- Voice Over -->
    <audio ref="voiceOver" :src="voiceSrc"></audio>
  </div>
</template>

<script>
export default {
  name: "NeptunusPage",
  data() {
    return {
      voiceSrc: require("@/assets/Neptunus.mp3"), // letakkan file di src/assets/voice
    };
  },
  mounted() {
    // Autoplay dengan sedikit delay
    setTimeout(() => {
      if (this.$refs.voiceOver) {
        this.$refs.voiceOver.play().catch(() => {
          console.warn("Autoplay dicegah browser, user harus interaksi dulu.");
        });
      }
    }, 1000); // jeda 1 detik
  },
};
</script>

<style scoped>
@import "@/stylePlanet.css";
</style>
