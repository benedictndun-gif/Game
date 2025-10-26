<template>
  <div class="canvas-puzzle" :style="{ backgroundImage: 'url(' + require('@/assets/Background.jpg') + ')' }">
    <!-- Tombol Back -->
    <button class="back-btn" @click="$router.push('/games')">⬅ Back</button>

    <div class="puzzle-layout">
      <!-- Canvas Puzzle -->
      <div class="puzzle-left">
        <canvas ref="canvas" width="800" height="600"
          @mousedown="startDrag"
          @mousemove="onDrag"
          @mouseup="stopDrag"></canvas>
        
        <div class="toolbar">
          <button class="action-btn restart" @click="restartPuzzle">⟳ Restart</button>
          <button class="action-btn next" @click="nextLevel">➡ Next Level</button>
        </div>
      </div>

      <!-- Gambar Patokan -->
      <div class="puzzle-right">
        <h3 class="preview-title">Level {{ level }}</h3>
        <img :src="previewImage" alt="Preview" class="preview-image" />
      </div>
    </div>

    <!-- Popup selesai semua level -->
    <div v-if="showComplete" class="complete-popup">
      <div class="popup-content">
        <h2>🎉 Selamat! 🎉</h2>
        <p>Kamu berhasil menyelesaikan semua puzzle! 🧩🔥</p>
        <button class="popup-btn" @click="$router.push('/games')">➡️ Lanjutkan</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CanvasPuzzle",
  data() {
    return {
      ctx: null,
      pieces: [],
      dragging: null,
      offsetX: 0,
      offsetY: 0,
      level: 1,
      showComplete: false,
      previews: {
        1: require("@/assets/Puzzle1.png"),
        2: require("@/assets/Puzzle2.jpeg"),
        3: require("@/assets/Puzzle3.jpeg"),
      }
    };
  },
  computed: {
    previewImage() {
      return this.previews[this.level];
    }
  },
  mounted() {
    this.ctx = this.$refs.canvas.getContext("2d");
    this.loadPuzzle();
    this.resizeCanvas();
    window.addEventListener("resize", this.resizeCanvas);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.resizeCanvas);
  },
  methods: {
    resizeCanvas() {
      const canvas = this.$refs.canvas;
      const containerWidth = window.innerWidth < 900 ? window.innerWidth * 0.9 : 800;
      const containerHeight = window.innerWidth < 900 ? window.innerHeight * 0.5 : 600;
      canvas.width = containerWidth;
      canvas.height = containerHeight;
      this.redraw();
    },

    loadPuzzle() {
      let sources = [];
      if (this.level === 1) {
        sources = [
          { id: 0, src: require("@/assets/Puzzle1_1.png"), target: {x:0,y:0} },
          { id: 1, src: require("@/assets/Puzzle1_2.png"), target: {x:200,y:0} },
          { id: 2, src: require("@/assets/Puzzle1_3.png"), target: {x:0,y:200} },
          { id: 3, src: require("@/assets/Puzzle1_4.png"), target: {x:200,y:200} }
        ];
      } else if (this.level === 2) {
        sources = [
          { id: 0, src: require("@/assets/Puzzle2_1.png"), target: {x:0,y:0} },
          { id: 1, src: require("@/assets/Puzzle2_2.png"), target: {x:200,y:0} },
          { id: 2, src: require("@/assets/Puzzle2_3.png"), target: {x:0,y:200} },
          { id: 3, src: require("@/assets/Puzzle2_4.png"), target: {x:200,y:200} }
        ];
      } else if (this.level === 3) {
        sources = [
          { id: 0, src: require("@/assets/Puzzle3_1.png"), target: {x:0,y:0} },
          { id: 1, src: require("@/assets/Puzzle3_2.png"), target: {x:266,y:0} },
          { id: 2, src: require("@/assets/Puzzle3_3.png"), target: {x:532,y:0} },
          { id: 3, src: require("@/assets/Puzzle3_4.png"), target: {x:0,y:300} },
          { id: 4, src: require("@/assets/Puzzle3_5.png"), target: {x:266,y:300} },
          { id: 5, src: require("@/assets/Puzzle3_6.png"), target: {x:532,y:300} }
        ];
      }

      this.pieces = [];
      sources.forEach(p => {
        let img = new Image();
        img.src = p.src;
        img.onload = () => {
          let scale = window.innerWidth < 900 ? 0.4 : 0.7;
          this.pieces.push({
            ...p,
            img,
            width: img.naturalWidth * scale,
            height: img.naturalHeight * scale,
            x: Math.random() * 200 + 50,
            y: Math.random() * 150 + 50,
            placed: false
          });
          this.redraw();
        };
      });
    },

    redraw() {
      this.ctx.clearRect(0, 0, this.$refs.canvas.width, this.$refs.canvas.height);
      for (let piece of this.pieces) {
        if (piece.img.complete) {
          this.ctx.drawImage(piece.img, piece.x, piece.y, piece.width, piece.height);
        }
      }
    },

    startDrag(e) {
      const { offsetX, offsetY } = e;
      for (let i = this.pieces.length - 1; i >= 0; i--) {
        let p = this.pieces[i];
        if (
          offsetX >= p.x && offsetX <= p.x + p.width &&
          offsetY >= p.y && offsetY <= p.y + p.height
        ) {
          this.dragging = p;
          this.offsetX = offsetX - p.x;
          this.offsetY = offsetY - p.y;
          break;
        }
      }
    },

    onDrag(e) {
      if (this.dragging) {
        const canvas = this.$refs.canvas;
        let newX = e.offsetX - this.offsetX;
        let newY = e.offsetY - this.offsetY;

        // 🔒 Batasi agar tidak keluar dari area canvas
        newX = Math.max(0, Math.min(canvas.width - this.dragging.width, newX));
        newY = Math.max(0, Math.min(canvas.height - this.dragging.height, newY));

        this.dragging.x = newX;
        this.dragging.y = newY;
        this.redraw();
      }
    },

    stopDrag() {
      if (this.dragging) {
        if (
          Math.abs(this.dragging.x - this.dragging.target.x) < 20 &&
          Math.abs(this.dragging.y - this.dragging.target.y) < 20
        ) {
          this.dragging.x = this.dragging.target.x;
          this.dragging.y = this.dragging.target.y;
          this.dragging.placed = true;
        }
        this.dragging = null;
        this.redraw();

        if (this.pieces.length && this.pieces.every(p => p.placed)) {
          if (this.level < 3) {
            alert(`🎉 Puzzle Level ${this.level} Selesai!`);
          } else {
            this.showComplete = true;
          }
        }
      }
    },

    restartPuzzle() {
      this.loadPuzzle();
    },

    nextLevel() {
      if (this.level < 3) {
        this.level++;
        this.loadPuzzle();
      } else {
        this.showComplete = true;
      }
    }
  }
};
</script>

<style scoped>
.canvas-puzzle {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  position: relative;
  background-size: cover;
  background-position: center;
  min-height: 100vh;
}

.back-btn {
  position: absolute;
  top: 15px;
  left: 15px;
  background: linear-gradient(135deg, #f4a261, #e76f51);
  border: none;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  border-radius: 50px;
  padding: 8px 14px;
  color: white;
  transition: 0.3s;
}
.back-btn:hover {
  transform: translateX(-5px);
}

.puzzle-layout {
  display: flex;
  gap: 30px;
  margin-top: 70px;
  z-index: 2;
  justify-content: center;
}

.puzzle-left {
  display: flex;
  flex-direction: column;
  align-items: center;
}

canvas {
  border: 2px solid #333;
  border-radius: 12px;
  background: rgba(255,255,255,0.9);
  max-width: 100%;
  height: auto;
}

.toolbar {
  margin-top: 15px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
}

.action-btn {
  padding: 10px 20px;
  font-size: 14px;
  font-weight: bold;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  color: #fff;
  transition: all 0.3s ease;
}
.action-btn.restart {
  background: linear-gradient(135deg, #00c6ff, #0072ff);
}
.action-btn.next {
  background: linear-gradient(135deg, #f4a261, #e76f51);
}
.action-btn:hover {
  transform: scale(1.08);
}

.puzzle-right {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 220px;
  padding: 10px;
}

.preview-title {
  font-size: 16px;
  margin-bottom: 10px;
  color: #333;
}
.preview-image {
  width: 100%;
  border-radius: 8px;
}

/* Responsif */
@media (max-width: 900px) {
  .puzzle-layout {
    flex-direction: column;
    gap: 15px;
  }
  .puzzle-right {
    max-width: 80%;
  }
  canvas {
    width: 90vw !important;
    height: 50vh !important;
  }
}
</style>
