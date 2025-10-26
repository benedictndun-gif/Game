<template>
  <div class="planet-container">
    <router-link to="/materi/jupiter" class="btn-back">BACK◂</router-link>
    <div class="planet-title">Saturnus</div>

    <div class="planet-content">
      <div class="planet-image">
        <img src="@/assets/Saturnus.png" alt="Saturnus" />
      </div>
      <div class="planet-desc">
        <p>
          Saturnus terkenal dengan cincin indah yang mengelilinginya, terdiri dari partikel es dan debu.
        </p>
      </div>
    </div>

    <!-- Tombol Next -->
    <router-link to="/materi/uranus" class="btn-next">▶</router-link>

    <!-- Voice Over -->
    <audio ref="voiceOver" :src="voiceSrc"></audio>
  </div>
</template>

<script>
export default {
  name: "SaturnusPage",
  data() {
    return {
      voiceSrc: require("@/assets/Saturnus.mp3"), // simpan file di src/assets/voice
    };
  },
  mounted() {
    // Autoplay dengan delay agar sinkron dengan tampilan
    setTimeout(() => {
      if (this.$refs.voiceOver) {
        this.$refs.voiceOver.play().catch(() => {
          console.warn("Autoplay dicegah browser, user perlu interaksi dulu.");
        });
      }
    }, 1000); // jeda 1 detik
  },
};
</script>

<style scoped>
@import "@/stylePlanet.css";
</style>
