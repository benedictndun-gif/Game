<template>
  <div class="imagination-game">
    <!-- Tombol Back (pojok kiri atas) -->
    <button
      v-if="!isFinished"
      class="back-btn"
      @click="$router.push('/games')"
    >
      ⬅️ Kembali
    </button>

    <!-- Halaman Pertanyaan -->
    <div v-if="!isFinished" class="question-container">
      <h2>🌌 Planet Imajinasi</h2>

      <!-- Pertanyaan -->
      <p v-if="currentQuestion === 1">
        Jika kamu menjadi Astronot, kamu ingin berkunjung di planet apa?
      </p>
      <p v-else>
        Bagaimana rasanya tinggal di planet tersebut?
      </p>

      <!-- Voice Over -->
      <audio ref="voiceOver1" style="display: none;"></audio>
      <audio ref="voiceOver2" style="display: none;"></audio>

      <!-- Tombol Rekam -->
      <div class="record-box">
        <button @click="toggleRecording">
          🎤 {{ isRecording ? 'Stop Rekam' : 'Mulai Rekam' }}
        </button>
      </div>

      <!-- Hasil rekaman -->
      <div v-if="audioUrl[currentQuestion]" class="answer-box">
        <p>Jawabanmu:</p>
        <audio :src="audioUrl[currentQuestion]" controls></audio>
      </div>

      <!-- Tombol Navigasi -->
      <div class="nav-buttons">
        <button
          v-if="currentQuestion === 1"
          class="next-btn"
          @click="nextQuestion"
          :disabled="!audioUrl[1]"
        >
          ⏭️ Lanjut
        </button>

        <button
          v-else
          class="next-btn"
          @click="finishQuiz"
          :disabled="!audioUrl[2]"
        >
          🏁 Selesai
        </button>
      </div>
    </div>

    <!-- Halaman Selesai -->
    <div v-else class="finish-screen">
      <div class="stars"></div>
      <div class="planet-animation">🪐</div>
      <h2 class="fade-text">🎉 Keren Banget!</h2>
      <p class="fade-text">Kamu punya imajinasi luar biasa! 🌟</p>
      <p class="fade-text">
        Teruslah bermimpi dan jelajahi semesta dengan rasa ingin tahu yang besar.
      </p>
      <button class="back-btn fade-text" @click="$router.push('/games')">
        🔙 Kembali ke Game
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "PlanetImajinasi",
  data() {
    return {
      currentQuestion: 1,
      isRecording: false,
      mediaRecorder: null,
      audioChunks: [],
      audioUrl: { 1: null, 2: null },
      isFinished: false,
      playTimeout: null,
      voiceOverSrc: {
        1: require('@/assets/PlanetImajinasi1.mp3'),
        2: require('@/assets/PlanetImajinasi2.mp3')
      }
    };
  },
  watch: {
    currentQuestion(newVal) {
      this.playVoiceOver(newVal);
    },
  },
  mounted() {
    this.playVoiceOver(this.currentQuestion);
  },
  methods: {
    playVoiceOver(questionNumber) {
      if (this.$refs.voiceOver1) {
        this.$refs.voiceOver1.pause();
        this.$refs.voiceOver1.currentTime = 0;
      }
      if (this.$refs.voiceOver2) {
        this.$refs.voiceOver2.pause();
        this.$refs.voiceOver2.currentTime = 0;
      }

      if (this.playTimeout) clearTimeout(this.playTimeout);

      this.playTimeout = setTimeout(() => {
        if (questionNumber === 1 && this.$refs.voiceOver1) {
          this.$refs.voiceOver1.src = this.voiceOverSrc[1];
          this.$refs.voiceOver1.load();
          this.$refs.voiceOver1.play().catch(err => console.error(err));
        }
        if (questionNumber === 2 && this.$refs.voiceOver2) {
          this.$refs.voiceOver2.src = this.voiceOverSrc[2];
          this.$refs.voiceOver2.load();
          this.$refs.voiceOver2.play().catch(err => console.error(err));
        }
      }, 2000);
    },

    async toggleRecording() {
      if (!this.isRecording) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          this.mediaRecorder = new MediaRecorder(stream);
          this.audioChunks = [];

          this.mediaRecorder.ondataavailable = (e) => this.audioChunks.push(e.data);

          this.mediaRecorder.onstop = () => {
            const audioBlob = new Blob(this.audioChunks, { type: "audio/webm" });
            this.audioUrl[this.currentQuestion] = URL.createObjectURL(audioBlob);
          };

          this.mediaRecorder.start();
          this.isRecording = true;
        } catch {
          alert("Izin mikrofon dibutuhkan untuk merekam suara.");
        }
      } else {
        this.mediaRecorder.stop();
        this.isRecording = false;
      }
    },

    nextQuestion() {
      if (this.audioUrl[1]) this.currentQuestion = 2;
      else alert("Silakan rekam jawabanmu dulu sebelum lanjut!");
    },

    finishQuiz() {
      if (this.audioUrl[2]) {
        this.isFinished = true;
        this.playFinishEffect();
      } else alert("Silakan rekam jawabanmu dulu sebelum selesai!");
    },

    playFinishEffect() {
      const stars = document.querySelector(".stars");
      if (stars) {
        stars.classList.add("shooting");
        setTimeout(() => stars.classList.remove("shooting"), 3000);
      }
    },
  },
};
</script>

<style scoped>
.imagination-game {
  text-align: center;
  padding: 30px;
  color: #fff;
  background: linear-gradient(180deg, #0b0e2e, #1a1f4a);
  min-height: 100vh;
  font-family: 'Comic Neue', sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
}

/* Tombol Back pojok kiri atas */
.back-btn {
  position: fixed;
  top: 20px;
  left: 20px;
  background: #facc15;
  border: none;
  padding: 10px 20px;
  border-radius: 25px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
  z-index: 10;
}
.back-btn:hover {
  background: #eab308;
  transform: scale(1.1);
}

/* Judul */
h2 {
  font-size: 2rem;
  margin-bottom: 15px;
  text-shadow: 0 0 10px #38bdf8, 0 0 20px #1e3a8a;
}

p {
  font-size: 1.2rem;
  margin-bottom: 20px;
}

/* Tombol Rekam & Next */
.record-box button,
.next-btn {
  margin: 15px;
  padding: 15px 30px;
  font-size: 18px;
  border: none;
  border-radius: 50px;
  font-weight: bold;
  color: white;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
  background: linear-gradient(90deg, #2563eb, #1d4ed8);
  box-shadow: 0 4px 15px rgba(37, 99, 235, 0.5);
}
.record-box button:hover,
.next-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(37, 99, 235, 0.8);
}
.next-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Kotak jawaban rata tengah */
.answer-box {
  margin: 25px auto;
  padding: 20px;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 15px;
  width: 80%;
  max-width: 400px;
  backdrop-filter: blur(6px);
  animation: fadeIn 0.8s ease-in-out;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.answer-box p {
  font-size: 1.1rem;
  margin-bottom: 10px;
  font-weight: bold;
}

/* Halaman selesai */
.finish-screen {
  text-align: center;
  animation: fadeInUp 1s ease-out;
  max-width: 600px;
  padding: 20px;
}
.finish-screen h2 {
  font-size: 2.3rem;
  color: #facc15;
  margin-bottom: 10px;
  text-shadow: 0 0 10px #fbbf24;
}
.finish-screen p {
  font-size: 1.2rem;
  margin: 10px 0;
}

/* Animasi planet */
.planet-animation {
  font-size: 4rem;
  animation: spin 6s linear infinite;
  margin-bottom: 20px;
}

/* Bintang jatuh */
.stars {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
.stars.shooting::before {
  content: "✨";
  position: absolute;
  left: 50%;
  top: -10%;
  font-size: 2rem;
  animation: shootingStar 3s linear forwards;
}
@keyframes shootingStar {
  from { transform: translate(-50%, 0) rotate(0deg); opacity: 1; }
  to { transform: translate(200%, 200%) rotate(720deg); opacity: 0; }
}

/* Fade teks */
.fade-text {
  opacity: 0;
  animation: fadeIn 1s ease forwards;
}
.fade-text:nth-child(2) { animation-delay: 0.5s; }
.fade-text:nth-child(3) { animation-delay: 1s; }
.fade-text:nth-child(4) { animation-delay: 1.5s; }
.fade-text:nth-child(5) { animation-delay: 2s; }

/* Animasi dasar */
@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(50px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 🔹 RESPONSIF UNTUK MOBILE 🔹 */
@media (max-width: 768px) {
  .imagination-game {
    padding: 20px 10px;
  }

  h2 {
    font-size: 1.6rem;
  }

  p {
    font-size: 1rem;
  }

  .record-box button,
  .next-btn {
    font-size: 16px;
    padding: 12px 24px;
    margin: 10px;
  }

  .answer-box {
    width: 90%;
    padding: 15px;
  }

  audio {
    width: 100%;
  }

  .finish-screen h2 {
    font-size: 1.8rem;
  }

  .finish-screen p {
    font-size: 1rem;
  }

  .planet-animation {
    font-size: 3rem;
  }

  .back-btn {
    padding: 8px 16px;
    font-size: 14px;
    top: 10px;
    left: 10px;
  }
}
</style>
