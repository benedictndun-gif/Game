<template>
  <div class="home">
    <!-- Volume Control - hanya di Home -->
    <div class="volume-control">
      <button @click="toggleMute" class="volume-btn">
        <!-- Unmuted Icon -->
        <svg v-if="!isMuted" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
        </svg>
        
        <!-- Muted Icon -->
        <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
          <line x1="23" y1="9" x2="17" y2="15"></line>
          <line x1="17" y1="9" x2="23" y2="15"></line>
        </svg>
      </button>
      
      <!-- Volume Slider (muncul saat hover) -->
      <div class="volume-slider">
        <input 
          type="range" 
          v-model="volume" 
          @input="updateVolume"
          min="0" 
          max="100" 
          class="slider"
        />
        <span class="volume-text">{{ volume }}%</span>
      </div>
    </div>

    <!-- Tombol Back -->
    <button class="back-btn" @click="$router.push('/')">BACK◂</button>

    <!-- Judul Utama -->
    <transition name="fade">
      <div class="title">
        <h1>Ayo Mengenal</h1>
        <h2>Tata Surya</h2>
      </div>
    </transition>

    <!-- Planet dan Objek Tata Surya -->
    <div class="space-scene">
      <div class="planet-group">
        <img src="@/assets/Matahari.png" alt="Matahari" class="planet sun" />
        <img src="@/assets/Merkurius.png" alt="Merkurius" class="planet mercury" />
        <img src="@/assets/Venus.png" alt="Venus" class="planet venus" />
        <img src="@/assets/Bumi.png" alt="Bumi" class="planet earth" />
        <img src="@/assets/Mars.png" alt="Mars" class="planet mars" />
        <img src="@/assets/Jupiter.png" alt="Jupiter" class="planet jupiter" />
        <img src="@/assets/Saturnus.png" alt="Saturnus" class="planet saturn" />
        <img src="@/assets/Uranus.png" alt="Uranus" class="planet uranus" />
        <img src="@/assets/Neptunus.png" alt="Neptunus" class="planet neptune" />
      </div>
    </div>

    <!-- Tombol Navigasi -->
    <transition name="slide-up">
      <div class="menu">
        <router-link to="/panduan" class="btn">Panduan</router-link>
        <router-link to="/materi" class="btn">Materi</router-link>
        <router-link to="/video" class="btn">Video</router-link>
        <router-link to="/games" class="btn">Game</router-link>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: "HomePage",
  data() {
    return {
      volume: 50,
      isMuted: false,
      previousVolume: 50
    }
  },
  mounted() {
    // Sinkronkan volume dengan audio yang ada
    if (window.backgroundAudio) {
      this.volume = Math.round(window.backgroundAudio.volume * 100)
    }
  },
  methods: {
    updateVolume() {
      if (window.backgroundAudio) {
        window.backgroundAudio.volume = this.volume / 100
        this.isMuted = this.volume === 0
      }
    },
    toggleMute() {
      if (this.isMuted) {
        // Unmute
        this.volume = this.previousVolume || 50
        this.isMuted = false
      } else {
        // Mute
        this.previousVolume = this.volume
        this.volume = 0
        this.isMuted = true
      }
      this.updateVolume()
    }
  }
};
</script>

<style scoped>
.home {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: url("@/assets/Background.jpg") no-repeat center center fixed;
  background-size: cover;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Volume Control */
.volume-control {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  display: flex;
  align-items: center;
  gap: 10px;
}

.volume-btn {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: rgba(250, 204, 21, 0.9);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.volume-btn:hover {
  background: rgba(250, 204, 21, 1);
  transform: scale(1.1);
}

.volume-btn svg {
  color: #000;
}

.volume-slider {
  position: absolute;
  right: 60px;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(11, 12, 29, 0.95);
  padding: 15px 20px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  border: 2px solid rgba(250, 204, 21, 0.3);
}

.volume-control:hover .volume-slider {
  opacity: 1;
  visibility: visible;
}

.slider {
  width: 120px;
  height: 6px;
  border-radius: 5px;
  background: #444;
  outline: none;
  -webkit-appearance: none;
  cursor: pointer;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #facc15;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  transition: all 0.2s ease;
}

.slider::-webkit-slider-thumb:hover {
  background: #fde047;
  transform: scale(1.2);
}

.slider::-moz-range-thumb {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #facc15;
  cursor: pointer;
  border: none;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
}

.volume-text {
  color: #facc15;
  font-size: 14px;
  font-weight: bold;
  text-align: center;
}

/* Tombol Back */
.back-btn {
  position: absolute;
  top: 20px;
  left: 20px;
  background: #facc15;
  border: none;
  border-radius: 25px;
  padding: 10px 20px;
  font-weight: bold;
  cursor: pointer;
  transition: 0.3s;
  z-index: 10;
}
.back-btn:hover {
  background: #eab308;
  transform: scale(1.05);
}

/* Judul */
.title {
  text-align: center;
  color: white;
  margin-top: 60px;
  text-shadow: 0 0 10px #fff, 0 0 20px #38bdf8;
}
.title h1 {
  font-size: 2.8rem;
  font-weight: bold;
  margin: 0;
}
.title h2 {
  font-size: 3.2rem;
  margin: 0;
  border-bottom: 3px solid #facc15;
  display: inline-block;
  padding-bottom: 5px;
}

/* Area Planet */
.space-scene {
  position: relative;
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.planet-group {
  position: relative;
  width: 500px;
  height: 500px;
  animation: rotate 40s linear infinite;
}

.planet {
  position: absolute;
  animation: float 4s ease-in-out infinite;
}

.sun {
  top: 55%;
  left: 35%;
  width: 150px;
  transform: translate(-50%, -50%);
  z-index: 3;
}

.mercury { top: 38%; left: 68%; width: 55px; }
.venus { top: 25%; left: 30%; width: 70px; }
.earth { top: 18%; left: 55%; width: 75px; }
.mars { top: 65%; left: 25%; width: 65px; }
.jupiter { top: 70%; left: 65%; width: 95px; }
.saturn { top: 50%; left: 75%; width: 110px; }
.uranus { top: 35%; left: 15%; width: 80px; }
.neptune { top: 40%; left: 50%; width: 85px; }

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Menu bawah */
.menu {
  position: absolute;
  bottom: 40px;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 40px;
}

.btn {
  background: #facc15;
  color: #000;
  font-weight: bold;
  border-radius: 12px;
  padding: 12px 35px;
  text-decoration: none;
  font-size: 18px;
  transition: all 0.3s ease;
  box-shadow: 4px 6px 0 #b45309;
}
.btn:hover {
  background: #fde047;
  transform: translateY(-3px);
  box-shadow: 4px 8px 0 #b45309;
}

/* Animasi Transisi */
.fade-enter-active, .fade-leave-active {
  transition: opacity 1s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active {
  transition: all 1s ease;
}
.slide-up-enter-from {
  opacity: 0;
  transform: translateY(50px);
}

/* 🌙 RESPONSIVE TABLET */
@media (max-width: 992px) {
  .planet-group {
    width: 400px;
    height: 400px;
  }

  .sun { width: 120px; }
  .planet { width: 60%; }
}

/* 🌙 RESPONSIVE MOBILE */
@media (max-width: 768px) {
  .home {
    background-attachment: scroll;
    justify-content: flex-start;
    padding-top: 30px;
  }

  .volume-control {
    top: 10px;
    right: 10px;
  }
  
  .volume-btn {
    width: 45px;
    height: 45px;
  }
  
  .volume-slider {
    right: 55px;
    padding: 12px 15px;
  }
  
  .slider {
    width: 100px;
  }

  .back-btn {
    top: 10px;
    left: 10px;
    padding: 6px 14px;
    font-size: 0.8rem;
  }

  .title {
    margin-top: 20px;
  }
  .title h1 {
    font-size: 1.6rem;
  }
  .title h2 {
    font-size: 1.8rem;
  }

  .planet-group {
    width: 260px;
    height: 260px;
    animation: none;
    top: -5%;
  }

  .sun {
    width: 60px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  /* Orbit adaptif untuk HP */
  .planet {
    animation: none;
  }
  .mercury { width: 15px; top: 50%; left: 50%; transform-origin: -40px center; animation: orbit-mercury 10s linear infinite; }
  .venus { width: 18px; top: 50%; left: 50%; transform-origin: -60px center; animation: orbit-venus 14s linear infinite; }
  .earth { width: 20px; top: 50%; left: 50%; transform-origin: -80px center; animation: orbit-earth 18s linear infinite; }
  .mars { width: 18px; top: 50%; left: 50%; transform-origin: -100px center; animation: orbit-mars 22s linear infinite; }
  .jupiter { width: 28px; top: 50%; left: 50%; transform-origin: -120px center; animation: orbit-jupiter 28s linear infinite; }
  .saturn { width: 32px; top: 50%; left: 50%; transform-origin: -145px center; animation: orbit-saturn 34s linear infinite; }
  .uranus { width: 26px; top: 50%; left: 50%; transform-origin: -165px center; animation: orbit-uranus 40s linear infinite; }
  .neptune { width: 26px; top: 50%; left: 50%; transform-origin: -185px center; animation: orbit-neptune 46s linear infinite; }

  /* Orbit Animations */
  @keyframes orbit-mercury { from { transform: rotate(0deg) translateX(40px); } to { transform: rotate(360deg) translateX(40px); } }
  @keyframes orbit-venus { from { transform: rotate(0deg) translateX(60px); } to { transform: rotate(360deg) translateX(60px); } }
  @keyframes orbit-earth { from { transform: rotate(0deg) translateX(80px); } to { transform: rotate(360deg) translateX(80px); } }
  @keyframes orbit-mars { from { transform: rotate(0deg) translateX(100px); } to { transform: rotate(360deg) translateX(100px); } }
  @keyframes orbit-jupiter { from { transform: rotate(0deg) translateX(120px); } to { transform: rotate(360deg) translateX(120px); } }
  @keyframes orbit-saturn { from { transform: rotate(0deg) translateX(145px); } to { transform: rotate(360deg) translateX(145px); } }
  @keyframes orbit-uranus { from { transform: rotate(0deg) translateX(165px); } to { transform: rotate(360deg) translateX(165px); } }
  @keyframes orbit-neptune { from { transform: rotate(0deg) translateX(185px); } to { transform: rotate(360deg) translateX(185px); } }

  /* Menu di bawah */
  .menu {
    position: absolute;
    bottom: 10px;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: center;
  }

  .btn {
    padding: 8px 20px;
    font-size: 0.9rem;
    border-radius: 10px;
    box-shadow: 2px 4px 0 #b45309;
  }
}

/* 🌙 RESPONSIVE EXTRA SMALL */
@media (max-width: 420px) {
  .title h1 { font-size: 1.4rem; }
  .title h2 { font-size: 1.6rem; }
  .planet-group { width: 220px; height: 220px; }
  .btn { font-size: 0.85rem; padding: 7px 16px; }
}
</style>