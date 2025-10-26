<template>
  <div class="planet-container">
    <router-link to="/materi/mars" class="btn-back">BACK◂</router-link>
    <div class="planet-title">Jupiter</div>

    <div class="planet-content">
      <div class="planet-image">
        <img src="@/assets/Jupiter.png" alt="Jupiter" />
      </div>
      <div class="planet-desc">
        <p>
          Jupiter adalah planet terbesar di tata surya dan memiliki Bintik Merah Besar berupa badai raksasa.
        </p>
      </div>
    </div>

    <!-- Tombol Next -->
    <router-link to="/materi/saturnus" class="btn-next">▶</router-link>

    <!-- Voice Over -->
    <audio ref="voiceOver" :src="voiceSrc"></audio>
  </div>
</template>

<script>
export default {
  name: "JupiterPage",
  data() {
    return {
      voiceSrc: require("@/assets/Jupiter.mp3"), // letakkan file di src/assets/voice
    };
  },
  mounted() {
    // coba autoplay dengan delay 1 detik
    setTimeout(() => {
      if (this.$refs.voiceOver) {
        this.$refs.voiceOver.play().catch(() => {
          console.warn("Autoplay dicegah browser, user perlu klik dulu.");
        });
      }
    }, 1000);
  },
};
</script>

<style scoped>
@import "@/stylePlanet.css";
</style>
