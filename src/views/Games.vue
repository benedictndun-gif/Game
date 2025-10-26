<template>
  <div class="games">
    <div class="overlay">
      <h2>🎮 Pilih Mini Game</h2>
      <ul>
        <li><router-link to="/games/susun-planet" class="btn">🪐 Susun Planet</router-link></li>
        <li><router-link to="/games/pilih-planet" class="btn">🌍 Pilih Planet Favorit</router-link></li>
        <li><router-link to="/games/mewarnai" class="btn">🎨 Mewarnai Planet</router-link></li>
        <li><router-link to="/games/Mewarnaitatasurya" class="btn">🎨 Mewarnai Tata Surya</router-link></li>  
        <li><router-link to="/games/PlanetImajinasi" class="btn">🃏 Planet Imajinasi</router-link></li>
      </ul>
      <router-link to="/home" class="btn back">⬅️ Kembali</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "GamesPage"
}
</script>

<style scoped>
.games {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;

  /* 🔥 background */
  background: url("@/assets/Background.jpg") no-repeat center center fixed;
  background-size: cover;
}

.overlay {
  text-align: center;
  background: rgba(0,0,0,0.55);
  padding: 50px;
  border-radius: 15px;
  color: #fff;
  box-shadow: 0 8px 20px rgba(0,0,0,0.4);
}

ul {
  list-style: none;
  padding: 0;
  margin: 30px 0;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.btn {
  display: inline-block;
  padding: 12px 25px;
  background: linear-gradient(90deg, #1e3a8a, #2563eb);
  color: white;
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.3s;
  font-weight: bold;
}

.btn:hover {
  background: linear-gradient(90deg, #2563eb, #1e40af);
  transform: scale(1.05);
}

.back {
  margin-top: 20px;
  background: #6b7280; /* abu-abu untuk tombol kembali */
}
.back:hover {
  background: #4b5563;
}
</style>
