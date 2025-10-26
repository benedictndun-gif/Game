<template>
  <div class="materi">
    <h2>📚 Daftar Planet</h2>
    <ul>
      <li v-for="planet in planets" :key="planet">
        <router-link :to="`/materi/${planet.toLowerCase()}`">{{ planet }}</router-link>
      </li>
    </ul>
    <router-link to="/home" class="btn">⬅️ Kembali</router-link>
  </div>
</template>

<script>
export default {
  name: "MateriPage",
  data() {
    return {
      planets: ["Matahari","Merkurius","Venus","Bumi","Mars","Jupiter","Saturnus","Uranus","Neptunus"]
    }
  }
}
</script>

<style scoped>
ul { list-style: none; padding: 0; }
li { margin: 8px 0; }
a { color: #2563eb; text-decoration: none; font-weight: bold; }
</style>

<style scoped>
.materi {
  background: url("@/assets/Background.jpg") no-repeat center center fixed;
  background-size: cover;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 40px 20px;
  color: #fff;
  text-align: center;
}

.materi h2 {
  font-size: 2rem;
  margin-bottom: 30px;
  text-shadow: 0 2px 8px rgba(0,0,0,0.7);
  color: #ffd700;
}

ul {
  list-style: none;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 15px;
  max-width: 700px;
  width: 100%;
}

li {
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  transition: all 0.3s ease;
  backdrop-filter: blur(6px);
}

li:hover {
  transform: translateY(-6px) scale(1.05);
  border-color: #ffd700;
  background: rgba(255, 215, 0, 0.15);
}

a {
  display: block;
  padding: 15px;
  font-size: 1.1rem;
  font-weight: bold;
  color: #fff;
  text-decoration: none;
  text-shadow: 0 1px 4px rgba(0,0,0,0.7);
}

a:hover {
  color: #ffd700;
}

.btn {
  margin-top: 40px;
  padding: 10px 20px;
  background: #2563eb;
  color: #fff;
  font-weight: bold;
  border-radius: 8px;
  text-decoration: none;
  box-shadow: 0 4px 10px rgba(0,0,0,0.5);
  transition: background 0.3s ease, transform 0.2s ease;
}

.btn:hover {
  background: #1d4ed8;
  transform: translateY(-2px);
}
</style>