<template>
  <div class="register">
    <!-- Planet dekorasi -->
    <img src="@/assets/Matahari.png" class="planet sun" alt="Sun" />
    <img src="@/assets/Saturnus.png" class="planet saturn" alt="Saturn" />
    <img src="@/assets/Bumi.png" class="planet earth" alt="Earth" />
    <img src="@/assets/Jupiter.png" class="planet jupiter" alt="Jupiter" />

    <!-- Form utama -->
    <div class="form-box">
      <h2>🚀 Siap Berpetualang di <br />Tata Surya?</h2>
      <p>Tulis namamu dulu ya, Astronot kecil! 👩‍🚀</p>

      <form @submit.prevent="registerUser" class="form-group">
        <input
          v-model="username"
          type="text"
          placeholder="Masukkan namamu..."
          required
        />
        <button type="submit" class="btn">Mulai Petualangan 🌌</button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: "RegisterPage",
  data() {
    return {
      username: ""
    };
  },
  methods: {
    registerUser() {
      if (this.username.trim() === "") {
        alert("Nama tidak boleh kosong!");
        return;
      }
      localStorage.setItem("username", this.username);
      this.$router.push("/home");
    }
  }
};
</script>

<style scoped>
/* 🌌 Background utama */
.register {
  position: relative;
  height: 100vh;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  background: url("@/assets/Background.jpg") no-repeat center center fixed;
  background-size: cover;
  font-family: "Poppins", sans-serif;
  color: white;
  padding: 20px;
  box-sizing: border-box;
}

/* 🪐 Planet dekoratif */
.planet {
  position: absolute;
  opacity: 0.9;
  animation: float 6s ease-in-out infinite;
  z-index: 1;
}

.sun {
  top: 8%;
  left: 8%;
  width: 130px;
  animation-delay: 0s;
}

.saturn {
  top: 15%;
  right: 12%;
  width: 110px;
  animation-delay: 2s;
}

.earth {
  bottom: 10%;
  right: 10%;
  width: 100px;
  animation-delay: 4s;
}

.jupiter {
  bottom: 5%;
  left: 10%;
  width: 150px;
  animation-delay: 3s;
}

/* Animasi melayang */
@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-12px);
  }
}

/* 🌟 Form utama */
.form-box {
  position: relative;
  z-index: 2;
  background: rgba(10, 20, 40, 0.8);
  padding: 50px 60px;
  border-radius: 20px;
  text-align: center;
  box-shadow: 0 0 40px rgba(100, 150, 255, 0.4);
  border: 1.5px solid rgba(147, 197, 253, 0.3);
  backdrop-filter: blur(5px);
  animation: fadeIn 1.5s ease forwards;
  max-width: 400px;
  width: 100%;
}

/* Animasi fade muncul */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Judul */
h2 {
  font-size: 1.9rem;
  margin-bottom: 10px;
  color: #93c5fd;
  text-shadow: 0 0 15px #2563eb;
}

/* Deskripsi */
p {
  margin-bottom: 25px;
  font-size: 1.1rem;
  opacity: 0.9;
}

/* 🌈 Input dan tombol */
.form-group {
  display: flex;
  flex-direction: column;
  gap: 15px;
  align-items: center;
}

input {
  width: 100%;
  max-width: 300px;
  padding: 12px 15px;
  border: none;
  border-radius: 10px;
  font-size: 1.05rem;
  text-align: center;
  background: rgba(255, 255, 255, 0.95);
  color: #1e3a8a;
  outline: none;
  transition: 0.3s;
}
input:focus {
  box-shadow: 0 0 15px #60a5fa;
  transform: scale(1.05);
}

.btn {
  width: 100%;
  max-width: 300px;
  padding: 12px;
  background: linear-gradient(90deg, #2563eb, #9333ea);
  border: none;
  border-radius: 10px;
  color: white;
  font-weight: bold;
  font-size: 1.1rem;
  cursor: pointer;
  transition: 0.3s;
  box-shadow: 0 0 20px rgba(147, 197, 253, 0.4);
}
.btn:hover {
  transform: scale(1.05);
  background: linear-gradient(90deg, #3b82f6, #a855f7);
  box-shadow: 0 0 35px rgba(147, 197, 253, 0.7);
}

/* 📱 Responsif */
@media (max-width: 1024px) {
  .sun { width: 110px; left: 6%; top: 6%; }
  .saturn { width: 90px; right: 8%; top: 12%; }
  .earth { width: 80px; bottom: 8%; right: 8%; }
  .jupiter { width: 120px; bottom: 6%; left: 8%; }
}

@media (max-width: 768px) {
  h2 {
    font-size: 1.6rem;
  }
  p {
    font-size: 1rem;
  }
  .form-box {
    padding: 40px 30px;
    max-width: 350px;
  }
  .planet {
    opacity: 0.7;
  }
  .sun { width: 90px; }
  .saturn { width: 80px; }
  .earth { width: 70px; }
  .jupiter { width: 100px; }
}

@media (max-width: 480px) {
  h2 {
    font-size: 1.4rem;
  }
  p {
    font-size: 0.95rem;
  }
  .form-box {
    padding: 30px 25px;
    border-radius: 15px;
  }
  input, .btn {
    max-width: 260px;
    font-size: 1rem;
    padding: 10px;
  }
  .sun, .saturn, .earth, .jupiter {
    width: 60px;
    opacity: 0.5;
  }
}
</style>
