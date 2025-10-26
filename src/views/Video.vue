<template>
  <div class="video-page">
    <h2>📺 Video Tata Surya</h2>
    <video controls width="80%" class="video-player">
      <source src="@/assets/Videos/tata_surya.mp4" type="video/mp4" />
      Browser Anda tidak mendukung pemutar video.
    </video>
    <router-link to="/home" class="btn">⬅️ Kembali</router-link>
  </div>
</template>

<script>
export default {
  name: "VideoPage"
}
</script>

<style scoped>
.video-page { text-align: center; padding: 20px; }
.video-player { border-radius: 12px; margin-top: 20px; }
.btn { display: inline-block; margin-top: 20px; padding: 10px 20px; background: #1e3a8a; color: white; border-radius: 8px; text-decoration: none; }
</style>
