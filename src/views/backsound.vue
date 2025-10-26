<template>
  <div class="fixed top-4 right-4 z-50">
    <div class="bg-gray-900 bg-opacity-90 backdrop-blur-sm rounded-full p-3 shadow-lg border border-gray-700 hover:bg-opacity-100 transition-all duration-300">
      <button
        @click="togglePlay"
        class="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-110 active:scale-95"
      >
        <!-- Play Icon -->
        <svg
          v-if="!isPlaying"
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6 text-white ml-1"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M8 5v14l11-7z" />
        </svg>
        
        <!-- Pause Icon -->
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6 text-white"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
        </svg>
      </button>
      
      <!-- Volume Control (muncul saat hover) -->
      <div
        class="absolute top-full right-0 mt-2 bg-gray-900 bg-opacity-95 backdrop-blur-sm rounded-lg p-4 shadow-xl border border-gray-700 transition-all duration-300"
        :class="showVolume ? 'opacity-100 visible' : 'opacity-0 invisible'"
      >
        <div class="flex flex-col items-center space-y-2">
          <label class="text-white text-xs font-semibold">Volume</label>
          <input
            type="range"
            v-model="volume"
            @input="updateVolume"
            min="0"
            max="100"
            class="w-24 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
          />
          <span class="text-white text-xs">{{ volume }}%</span>
        </div>
      </div>
    </div>
    
    <!-- Audio Element -->
    <audio ref="audioPlayer" loop>
      <source src="/assets/sounds/background-music.mp3" type="audio/mpeg" />
      Your browser does not support the audio element.
    </audio>
  </div>
</template>

<script>
export default {
  name: 'BacksoundPlayer',
  data() {
    return {
      isPlaying: false,
      volume: 50,
      showVolume: false
    }
  },
  mounted() {
    this.updateVolume()
  },
  methods: {
    togglePlay() {
      const audio = this.$refs.audioPlayer
      
      if (this.isPlaying) {
        audio.pause()
      } else {
        audio.play()
      }
      
      this.isPlaying = !this.isPlaying
    },
    updateVolume() {
      const audio = this.$refs.audioPlayer
      audio.volume = this.volume / 100
    }
  }
}
</script>

<style scoped>
/* Custom scrollbar for volume slider */
input[type="range"]::-webkit-slider-thumb {
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: linear-gradient(to bottom right, #9333ea, #2563eb);
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

input[type="range"]::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: linear-gradient(to bottom right, #9333ea, #2563eb);
  cursor: pointer;
  border: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

/* Hover effect untuk menampilkan volume control */
.fixed:hover .absolute {
  opacity: 1 !important;
  visibility: visible !important;
}
</style>