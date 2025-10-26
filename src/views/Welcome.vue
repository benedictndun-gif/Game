<template>
  <div class="welcome">
    <!-- Logo utama -->
    <div class="logo-container">
      <img src="@/assets/icongaiss.png" alt="Logo GAISS" class="logo" />
    </div>

    <!-- Subtitle pakai gambar -->
    <div class="subtitle-container">
      <img src="@/assets/GIKSS.png" alt="GIKSS" class="subtitle-img" />
    </div>

    <!-- Tombol Start -->
    <router-link to="/register" class="btn">▶ Mulai</router-link>
  </div>
</template>

<script>
export default {
  name: "WelcomePage",
};
</script>

<style scoped>
/* ======== AREA UTAMA ======== */
.welcome {
  text-align: center;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: url("@/assets/Background.jpg") no-repeat center center fixed;
  background-size: cover;
  overflow: hidden;
  padding: 20px;
}

/* ======== LOGO UTAMA ======== */
.logo-container {
  display: flex;
  justify-content: center;
  align-items: center;
}
.logo {
  width: 450px;
  max-width: 90vw;
  height: auto;
  animation: float 3s ease-in-out infinite;
  margin-top: -150px;
}

/* ======== SUBTITLE GAMBAR ======== */
.subtitle-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
}
.subtitle-img {
  width: 550px;
  max-width: 95vw;
  height: auto;
  animation: float 3s ease-in-out infinite;
  margin-top: -50px;
}

/* ======== TOMBOL MULAI ======== */
.btn {
  padding: 14px 40px;
  background: linear-gradient(90deg, #887d02, #dfbe00);
  color: white;
  font-size: 20px;
  font-weight: bold;
  border-radius: 50px;
  text-decoration: none;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.4);
  transition: all 0.3s ease;
  margin-top: 60px;
}
.btn:hover {
  transform: scale(1.08);
}

/* ======== ANIMASI MELAYANG ======== */
@keyframes float {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-12px);
  }
  100% {
    transform: translateY(0);
  }
}

/* ======== RESPONSIVE STYLE ======== */

/* 🌙 Tablet (≤992px) */
@media (max-width: 992px) {
  .logo {
    width: 350px;
    margin-top: -120px;
  }

  .subtitle-img {
    width: 420px;
    margin-top: -40px;
  }

  .btn {
    padding: 12px 32px;
    font-size: 18px;
    margin-top: 40px;
  }
}

/* 📱 Mobile (≤768px) */
@media (max-width: 768px) {
  .welcome {
    background-attachment: scroll;
    padding: 30px 10px;
  }

  .logo {
    width: 280px;
    margin-top: -80px;
  }

  .subtitle-img {
    width: 320px;
    margin-top: -30px;
  }

  .btn {
    font-size: 16px;
    padding: 10px 28px;
    margin-top: 35px;
  }
}

/* 📱 Small Phones (≤480px) */
@media (max-width: 480px) {
  .logo {
    width: 220px;
    margin-top: -60px;
  }

  .subtitle-img {
    width: 240px;
    margin-top: -20px;
  }

  .btn {
    font-size: 15px;
    padding: 9px 24px;
    margin-top: 30px;
  }
}

/* 📱 Extra Small (≤360px, contoh: iPhone SE) */
@media (max-width: 360px) {
  .logo {
    width: 180px;
    margin-top: -40px;
  }

  .subtitle-img {
    width: 200px;
    margin-top: -10px;
  }

  .btn {
    font-size: 14px;
    padding: 8px 20px;
  }
}
</style>
