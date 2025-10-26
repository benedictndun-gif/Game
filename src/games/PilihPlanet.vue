<template>
  <div class="pilih-planet">
    <h2>🌍 Pilih Planet Favoritmu</h2>
    <p>Klik salah satu planet atau benda langit di bawah ini untuk mengetahui penjelasan singkatnya!</p>

    <!-- Grid planet -->
    <div class="planet-grid">
      <div 
        v-for="planet in planets" 
        :key="planet.name" 
        class="planet-card"
        @click="selectPlanet(planet)"
      >
        <img :src="planet.image" :alt="planet.name" />
        <h3>{{ planet.name }}</h3>
      </div>
    </div>

    <!-- Pop-up Penjelasan Planet -->
    <div v-if="selectedPlanet" class="planet-popup">
      <div class="popup-content">
        <button class="close-btn" @click="selectedPlanet = null">✖</button>
        <img :src="selectedPlanet.image" :alt="selectedPlanet.name" class="popup-image" />
        <h2>⭐ {{ selectedPlanet.name }}</h2>
        <p>{{ selectedPlanet.description }}</p>
      </div>
    </div>

    <!-- Tombol kembali -->
    <router-link to="/games" class="btn-back">⬅️ Kembali</router-link>
  </div>
</template>

<script>
export default {
  name: "PilihPlanetGame",
  data() {
    return {
      selectedPlanet: null,
      planets: [
        {
          name: "Merkurius",
          image: require("@/assets/Merkurius.png"),
          description: "Merkurius adalah planet terkecil di tata surya dan paling dekat dengan Matahari."
        },
        {
          name: "Venus",
          image: require("@/assets/Venus.png"),
          description: "Venus sering disebut bintang fajar atau senja, dan memiliki atmosfer yang sangat tebal."
        },
        {
          name: "Bumi",
          image: require("@/assets/Bumi.png"),
          description: "Bumi adalah satu-satunya planet yang diketahui memiliki kehidupan dan ditutupi oleh 70% air."
        },
        {
          name: "Mars",
          image: require("@/assets/Mars.png"),
          description: "Mars dikenal sebagai planet merah karena permukaannya kaya akan besi oksida."
        },
        {
          name: "Jupiter",
          image: require("@/assets/Jupiter.png"),
          description: "Jupiter adalah planet terbesar di tata surya, memiliki Bintik Merah Besar berupa badai raksasa."
        },
        {
          name: "Saturnus",
          image: require("@/assets/Saturnus.png"),
          description: "Saturnus terkenal dengan cincin indahnya yang tersusun dari partikel es dan debu."
        },
        {
          name: "Uranus",
          image: require("@/assets/Uranus.png"),
          description: "Uranus berputar miring hampir 90 derajat, sehingga rotasinya sangat unik."
        },
        {
          name: "Neptunus",
          image: require("@/assets/Neptunus.png"),
          description: "Neptunus memiliki angin tercepat di tata surya, mencapai 2.000 km/jam."
        },
        {
          name: "Matahari",
          image: require("@/assets/Matahari.png"),
          description: "Matahari adalah bintang pusat tata surya yang memberikan energi bagi kehidupan di Bumi."
        },
      ]
    }
  },
  methods: {
    selectPlanet(planet) {
      this.selectedPlanet = planet;
    }
  }
}
</script>

<style scoped>
/* ====== Layout Umum ====== */
.pilih-planet {
  text-align: center;
  padding: 30px 15px;
  color: white;
  background: url("@/assets/Background.jpg") no-repeat center center fixed;
  background-size: cover;
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
}

/* ====== Judul ====== */
.pilih-planet h2 {
  font-size: 2rem;
  margin-bottom: 10px;
}
.pilih-planet p {
  font-size: 1.1rem;
  margin-bottom: 20px;
}

/* ====== Grid Planet ====== */
.planet-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
  gap: 20px;
  justify-content: center;
  margin: 20px auto;
  max-width: 900px;
}

.planet-card {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 15px;
  cursor: pointer;
  transition: 0.3s ease;
}
.planet-card:hover {
  transform: scale(1.1);
  background: rgba(255, 255, 255, 0.2);
}
.planet-card img {
  width: 80px;
  height: 80px;
  object-fit: contain;
}
.planet-card h3 {
  margin-top: 10px;
  font-size: 1rem;
}

/* ====== Popup Deskripsi ====== */
.planet-popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(10, 10, 10, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
  backdrop-filter: blur(6px);
}

.popup-content {
  background: rgba(0, 0, 0, 0.9);
  border: 2px solid #888;
  border-radius: 15px;
  padding: 25px;
  max-width: 400px;
  text-align: center;
  color: white;
  position: relative;
  animation: popupScale 0.3s ease;
}
@keyframes popupScale {
  from { transform: scale(0.8); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

.popup-content h2 {
  margin-top: 10px;
  margin-bottom: 10px;
  font-size: 1.6rem;
}

.popup-content p {
  font-size: 1rem;
  line-height: 1.4;
}

.popup-image {
  width: 120px;
  height: 120px;
  object-fit: contain;
  margin-bottom: 10px;
}

.close-btn {
  position: absolute;
  top: 8px;
  right: 10px;
  background: transparent;
  border: none;
  color: white;
  font-size: 1.4rem;
  cursor: pointer;
  transition: 0.3s;
}
.close-btn:hover {
  color: #ff4444;
}

/* ====== Tombol Kembali ====== */
.btn-back {
  display: inline-block;
  margin-top: 30px;
  padding: 10px 20px;
  background: #6b7280;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: bold;
}
.btn-back:hover {
  background: #4b5563;
}

/* ====== Responsif untuk HP ====== */
@media (max-width: 768px) {
  .pilih-planet h2 {
    font-size: 1.6rem;
  }
  .pilih-planet p {
    font-size: 1rem;
  }
  .planet-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
  }
  .planet-card img {
    width: 70px;
    height: 70px;
  }
  .popup-content {
    max-width: 85%;
    padding: 20px;
  }
  .popup-content h2 {
    font-size: 1.4rem;
  }
  .popup-content p {
    font-size: 0.95rem;
  }
}
</style>
