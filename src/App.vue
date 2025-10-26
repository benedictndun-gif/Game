<template>
  <div id="app">
    <!-- Audio Element - tersembunyi, autoplay -->
    <audio 
      ref="audioElement" 
      loop
      autoplay
      preload="auto"
    >
      <source src="/background-music.mp3" type="audio/mpeg" />
    </audio>
    
    <router-view /> 
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const audioElement = ref(null)

// Expose audio element ke window agar bisa diakses dari komponen lain
onMounted(() => {
  if (audioElement.value) {
    // Set volume default 50%
    audioElement.value.volume = 0.5
    
    // Simpan reference audio ke window
    window.backgroundAudio = audioElement.value
    
    // Coba play jika browser block autoplay
    const playPromise = audioElement.value.play()
    
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          console.log('🎵 Audio playing automatically')
        })
        .catch(() => {
          console.log('⚠️ Autoplay blocked. Audio will start on first user interaction.')
          
          // Play saat user click pertama kali
          const startAudio = () => {
            if (audioElement.value) {
              audioElement.value.play()
                .then(() => console.log('🎵 Audio started'))
                .catch((e) => console.error('Play failed:', e))
            }
          }
          
          document.addEventListener('click', startAudio, { once: true })
        })
    }
  }
})
</script>

<style>
body {
  margin: 0;
  font-family: Arial, sans-serif;
  background-color: #0b0c1d;
  color: white;
}

#app {
  position: relative;
  min-height: 100vh;
}
</style>