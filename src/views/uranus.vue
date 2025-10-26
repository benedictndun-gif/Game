<template>
  <div class="planet-container">
    <router-link to="/materi/saturnus" class="btn-back">BACK◂</router-link>
    <div class="planet-title">Uranus</div>

    <div class="planet-content">
      <div class="planet-image">
        <img src="@/assets/Uranus.png" alt="Uranus" />
      </div>
      <div class="planet-desc">
        <p>
          Uranus adalah planet yang berotasi miring hampir 90 derajat, sehingga tampak seperti berguling saat mengorbit Matahari.
        </p>
      </div>
    </div>

    <!-- Tombol Next -->
    <router-link to="/materi/neptunus" class="btn-next">▶</router-link>

    <!-- Voice Over -->
    <audio ref="voiceOver" :src="voiceSrc"></audio>
  </div>
</template>

<script>
export default {
  name: "UranusPage",
  data() {
    return {
      voiceSrc: require("@/assets/Uranus.mp3"), // simpan file di src/assets/voice
    };
  },
  mounted() {
    // autoplay dengan delay biar tidak langsung meledak
    setTimeout(() => {
      if (this.$refs.voiceOver) {
        this.$refs.voiceOver.play().catch(() => {
          console.warn("Autoplay dicegah browser, user perlu klik layar dulu.");
        });
      }
    }, 1000); // jeda 1 detik
  },
};
</script>

<style scoped>
@import "@/stylePlanet.css";
</style>
