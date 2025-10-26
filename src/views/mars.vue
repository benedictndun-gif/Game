<template>
  <div class="planet-container">
    <router-link to="/materi/bumi" class="btn-back">BACK◂</router-link>
    <div class="planet-title">Mars</div>

    <div class="planet-content">
      <div class="planet-image">
        <img src="@/assets/Mars.png" alt="Mars" />
      </div>
      <div class="planet-desc">
        <p>
          Mars disebut Planet Merah karena permukaannya banyak mengandung besi oksida.
        </p>
      </div>
    </div>

    <!-- Tombol Next -->
    <router-link to="/materi/jupiter" class="btn-next">▶</router-link>

    <!-- Voice Over -->
    <audio ref="voiceOver" :src="voiceSrc"></audio>
  </div>
</template>

<script>
export default {
  name: "MarsPage",
  data() {
    return {
      voiceSrc: require("@/assets/Mars.mp3"), // pastikan file ada di folder assets/voice
    };
  },
  mounted() {
    // auto play dengan sedikit delay supaya tidak bentrok dengan rendering
    setTimeout(() => {
      if (this.$refs.voiceOver) {
        this.$refs.voiceOver.play().catch(() => {
          console.log("Autoplay diblokir browser, user harus klik dulu.");
        });
      }
    }, 1000);
  },
};
</script>

<style scoped>
@import "@/stylePlanet.css";
</style>
