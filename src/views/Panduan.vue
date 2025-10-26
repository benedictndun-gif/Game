<template>
  <div class="panduan-container">
    <div class="panduan-card">
      <h2>📘 Panduan Bermain</h2>

      <!-- Bagian 1: Cara Bermain -->
      <div class="section">
        <h3>🪐 Cara Bermain</h3>
        <ul>
          <li>Klik <b>tombol Start</b> untuk memulai permainan.</li>
          <li>Pada menu utama, klik <b>ikon Panduan</b> untuk mengetahui cara memainkan permainan.</li>
          <li>Klik <b>ikon Video</b> untuk menonton video tentang sistem tata surya.</li>
          <li>Klik <b>ikon Materi</b> untuk mempelajari sistem tata surya.</li>
          <li>Klik <b>ikon Game</b> untuk memainkan berbagai permainan tentang tata surya.</li>
        </ul>
      </div>

      <!-- Bagian 2: Jenis Permainan -->
      <div class="section">
        <h3>🎮 Jenis Permainan</h3>
        <ul>
          <li>🧩 <b>Susun Planet</b> — Anak menyusun puzzle planet sesuai urutan tata surya.</li>
          <li>🌕 <b>Pilih Planet Favorit</b> — Anak memilih benda langit yang disukai.</li>
          <li>🎨 <b>Mewarnai Planet</b> — Anak mewarnai planet sesuai kreativitasnya.</li>
          <li>🌌 <b>Planet Imajinasi</b> — Anak berimajinasi dan menciptakan planet versinya sendiri.</li>
        </ul>
      </div>

      <!-- Bagian 3: Navigasi -->
      <div class="section">
        <h3>🔄 Navigasi</h3>
        <ul>
          <li>⬅️ Klik <b>ikon Back</b> untuk kembali ke halaman sebelumnya.</li>
          <li>➡️ Klik <b>ikon Next</b> untuk melanjutkan ke halaman berikutnya.</li>
        </ul>
      </div>
    </div>

    <!-- Tombol kembali -->
    <router-link to="/home" class="btn-back">⬅ Kembali</router-link>
  </div>
</template>

<script>
export default {
  name: "PanduanPage",
  mounted() {
    // Suppress ResizeObserver error di development
    const resizeObserverErr = window.console.error;
    window.console.error = (...args) => {
      if (args[0]?.includes?.('ResizeObserver')) {
        return;
      }
      resizeObserverErr(...args);
    };
  }
};
</script>

<style scoped>
/* Reset untuk menghindari overflow */
* {
  box-sizing: border-box;
}

/* 🌌 Background fullscreen */
.panduan-container {
  min-height: 100vh;
  min-height: -webkit-fill-available;
  width: 100%;
  background: url("@/assets/Background.jpg") center/cover no-repeat;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 20px 15px 80px;
  box-sizing: border-box;
  overflow-x: hidden;
  position: relative;
}

/* 🪐 Card utama */
.panduan-card {
  background: rgba(0, 0, 0, 0.65);
  padding: 35px 40px;
  border-radius: 20px;
  color: white;
  width: 100%;
  max-width: 600px;
  box-shadow: 0 0 25px rgba(255, 255, 255, 0.15);
  text-align: left;
  backdrop-filter: blur(5px);
  animation: fadeIn 1.2s ease;
  will-change: auto;
}

/* Animasi */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Judul utama */
h2 {
  text-align: center;
  margin-bottom: 25px;
  font-size: 2rem;
  color: #bfdbfe;
  text-shadow: 0 0 10px rgba(147, 197, 253, 0.7);
}

/* Bagian isi */
.section {
  margin-bottom: 25px;
}

h3 {
  margin-bottom: 10px;
  color: #93c5fd;
  border-bottom: 2px solid #60a5fa;
  display: inline-block;
  padding-bottom: 3px;
  font-size: 1.2rem;
}

ul {
  margin: 0;
  padding-left: 20px;
}

li {
  margin-bottom: 8px;
  line-height: 1.5;
  font-size: 1rem;
}

/* Tombol kembali */
.btn-back {
  background: linear-gradient(90deg, #2563eb, #3b82f6);
  color: white;
  padding: 12px 30px;
  border-radius: 10px;
  text-decoration: none;
  font-weight: bold;
  transition: all 0.3s ease;
  text-align: center;
  width: fit-content;
  box-shadow: 0 0 20px rgba(147, 197, 253, 0.3);
  margin-top: 25px;
  margin-bottom: 20px;
  display: inline-block;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}

/* Hover efek */
.btn-back:hover,
.btn-back:active {
  background: linear-gradient(90deg, #3b82f6, #60a5fa);
  transform: scale(1.05);
}

/* 📱 Responsif */
@media (max-width: 768px) {
  .panduan-container {
    padding: 15px 10px 60px;
    min-height: 100vh;
    min-height: -webkit-fill-available;
  }

  .panduan-card {
    padding: 25px 20px;
    border-radius: 15px;
    max-width: 100%;
    margin: 0 auto;
  }

  h2 { 
    font-size: 1.5rem; 
    margin-bottom: 20px;
  }
  
  h3 { 
    font-size: 1.05rem; 
  }
  
  li { 
    font-size: 0.9rem; 
  }

  /* Tombol kembali rapi di tengah bawah */
  .btn-back {
    position: relative;
    width: calc(100% - 40px);
    max-width: 300px;
    text-align: center;
    margin: 20px auto 0;
    padding: 14px 20px;
    border-radius: 12px;
    font-size: 1rem;
    box-shadow: 0 0 15px rgba(59, 130, 246, 0.4);
    display: block;
  }
}

/* Fix untuk iOS Safari */
@supports (-webkit-touch-callout: none) {
  .panduan-container {
    min-height: -webkit-fill-available;
  }
}
</style>