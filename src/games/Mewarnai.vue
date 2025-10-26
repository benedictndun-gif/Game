<template>
  <div class="mewarnai">
    <!-- Tombol Back -->
    <button class="back-btn" @click="$router.push('/games')">⬅ Back</button>

    <!-- Tombol Undo/Redo -->
    <div class="history-btns">
      <button class="history-btn" @click="undo" :disabled="historyIndex <= 0">↶ Undo</button>
      <button class="history-btn" @click="redo" :disabled="historyIndex >= history.length - 1">↷ Redo</button>
    </div>

    <!-- Area Kanvas - Layer ganda -->
    <div class="canvas">
      <!-- Canvas untuk background dan coretan -->
      <canvas ref="drawCanvas" width="1000" height="500"
        style="position: absolute;"></canvas>
      <!-- Canvas untuk objek yang bisa di-drag -->
      <canvas ref="objectCanvas" width="1000" height="500"
        style="position: absolute;"
        @mousedown="startAction"
        @mouseup="stopAction"
        @mousemove="moveAction"></canvas>
    </div>

    <!-- Toolbar kiri -->
    <div class="toolbar">
      <!-- Alat menggambar -->
      <button class="tool" :class="{active: currentTool === 'pencil'}" @click="setTool('pencil')">✏️</button>
      <button class="tool" :class="{active: currentTool === 'eraser'}" @click="setTool('eraser')">🧽</button>

      <!-- Warna -->
      <button v-for="color in colors" :key="color" :style="{background: color}"
        class="tool" @click="setColor(color)">
      </button>
      
      <!-- Ukuran Tool -->
      <div class="size-control">
        <label>{{ currentTool === 'pencil' ? '✏️' : '🧽' }}: {{ toolSize }}px</label>
        <input type="range" min="1" max="50" v-model.number="toolSize" />
      </div>
    </div>

    <!-- Palet benda langit di bawah -->
    <div class="palette">
      <img v-for="item in items" :key="item.name" :src="item.src"
        :alt="item.name" class="palette-item" @click="addItem(item)" />

      <!-- Tombol Save -->
      <button class="save-btn" @click="saveCanvas">💾 Save</button>
    </div>

    <!-- Panel kontrol untuk objek terpilih -->
    <div v-if="selectedObj" class="control-panel">
      <div class="hint">
        📏 Scroll/+- ukuran | 🔄 R rotasi 15° | 🗑️ Delete hapus | Ctrl+Z undo | Ctrl+Y redo
      </div>
      <div class="controls">
        <div class="control-item">
          <label>Rotasi: {{ selectedObj.rotation }}°</label>
          <input type="range" min="0" max="360" v-model.number="selectedObj.rotation" @input="redrawObjects" />
        </div>
        <button class="delete-btn" @click="deleteSelected">🗑️ Hapus</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "MewarnaiLangit",
  data() {
    return {
      colors: ["yellow", "red", "blue", "green", "white", "purple", "black"],
      items: [
        { name: "Bulan Bulat", src: require("@/assets/bulan_bulat.png") },
        { name: "Bulan Sabit", src: require("@/assets/bulan_sabit.png") },
        { name: "Bintang Kuning", src: require("@/assets/star_yellow.png") },
        { name: "Bintang Ungu", src: require("@/assets/star_purple.png") },
        { name: "Bintang Hijau", src: require("@/assets/star_green.png") },
        { name: "Bintang Pink", src: require("@/assets/star_pink.png") },
        { name: "Bintang Biru", src: require("@/assets/star_blue.png") },
        { name: "Awan Biru", src: require("@/assets/cloud_blue.png") },
        { name: "Awan Putih", src: require("@/assets/cloud_white.png") },
        { name: "Petir 1", src: require("@/assets/lightning1.png") },
        { name: "Petir 2", src: require("@/assets/lightning2.png") }
      ],
      currentColor: "black",
      currentTool: "pencil",
      toolSize: 5,
      drawing: false,
      drawCtx: null,
      objectCtx: null,
      objects: [],
      draggingObj: null,
      selectedObj: null,
      offsetX: 0,
      offsetY: 0,
      history: [],
      historyIndex: -1
    }
  },
  mounted() {
    this.drawCtx = this.$refs.drawCanvas.getContext("2d")
    this.objectCtx = this.$refs.objectCanvas.getContext("2d")
    this.drawCtx.lineCap = "round"

    // 🌟 Ganti background dengan warna putih polos
    this.drawCtx.fillStyle = "white"
    this.drawCtx.fillRect(0, 0, this.$refs.drawCanvas.width, this.$refs.drawCanvas.height)

    this.saveState() // simpan state awal

    // Event listeners
    this.$refs.objectCanvas.addEventListener('wheel', this.resizeObject)
    window.addEventListener('keydown', this.handleKeyPress)
  },
  beforeUnmount() {
    this.$refs.objectCanvas.removeEventListener('wheel', this.resizeObject)
    window.removeEventListener('keydown', this.handleKeyPress)
  },
  methods: {
    setColor(color) {
      this.currentColor = color
    },
    setTool(tool) {
      this.currentTool = tool
    },
    startAction(e) {
      const { offsetX, offsetY } = e
      
      for (let i = this.objects.length - 1; i >= 0; i--) {
        const obj = this.objects[i]
        if (
          offsetX >= obj.x &&
          offsetX <= obj.x + obj.size &&
          offsetY >= obj.y &&
          offsetY <= obj.y + obj.size
        ) {
          this.draggingObj = obj
          this.selectedObj = obj
          this.offsetX = offsetX - obj.x
          this.offsetY = offsetY - obj.y
          return
        }
      }
      
      this.selectedObj = null
      this.drawing = true
      this.drawCtx.beginPath()
      this.drawCtx.moveTo(offsetX, offsetY)
    },
    moveAction(e) {
      const { offsetX, offsetY } = e
      
      if (this.draggingObj) {
        this.draggingObj.x = offsetX - this.offsetX
        this.draggingObj.y = offsetY - this.offsetY
        this.redrawObjects()
      } else if (this.drawing) {
        if (this.currentTool === "eraser") {
          this.drawCtx.globalCompositeOperation = 'destination-out'
          this.drawCtx.lineWidth = this.toolSize
          this.drawCtx.lineTo(offsetX, offsetY)
          this.drawCtx.stroke()
        } else if (this.currentTool === "pencil") {
          this.drawCtx.globalCompositeOperation = 'source-over'
          this.drawCtx.strokeStyle = this.currentColor
          this.drawCtx.lineWidth = this.toolSize
          this.drawCtx.lineTo(offsetX, offsetY)
          this.drawCtx.stroke()
        }
      }
    },
    stopAction() {
      if (this.drawing) {
        this.drawCtx.globalCompositeOperation = 'source-over'
        this.saveState()
      }
      if (this.draggingObj) {
        this.saveState()
      }
      this.drawing = false
      this.draggingObj = null
      this.drawCtx.closePath()
    },
    addItem(item) {
      const newObj = {
        name: item.name,
        img: new Image(),
        x: Math.random() * 700,
        y: Math.random() * 300,
        size: 70,
        rotation: 0,
        src: item.src
      }
      newObj.img.src = item.src
      newObj.img.onload = () => {
        this.objects.push(newObj)
        this.redrawObjects()
        this.saveState()
      }
    },
    redrawObjects() {
      this.objectCtx.clearRect(0, 0, this.$refs.objectCanvas.width, this.$refs.objectCanvas.height)
      for (let obj of this.objects) {
        this.objectCtx.save()
        this.objectCtx.translate(obj.x + obj.size / 2, obj.y + obj.size / 2)
        this.objectCtx.rotate((obj.rotation * Math.PI) / 180)
        this.objectCtx.drawImage(obj.img, -obj.size / 2, -obj.size / 2, obj.size, obj.size)
        this.objectCtx.restore()
      }
    },
    saveCanvas() {
      const tempCanvas = document.createElement('canvas')
      tempCanvas.width = this.$refs.drawCanvas.width
      tempCanvas.height = this.$refs.drawCanvas.height
      const tempCtx = tempCanvas.getContext('2d')
      tempCtx.drawImage(this.$refs.drawCanvas, 0, 0)
      tempCtx.drawImage(this.$refs.objectCanvas, 0, 0)
      const link = document.createElement("a")
      link.download = "hasil_mewarnai.png"
      link.href = tempCanvas.toDataURL("image/png")
      link.click()
    },
    resizeObject(e) {
      e.preventDefault()
      if (this.selectedObj) {
        const delta = e.deltaY > 0 ? -5 : 5
        this.selectedObj.size = Math.max(30, Math.min(200, this.selectedObj.size + delta))
        this.redrawObjects()
        this.saveState()
      }
    },
    handleKeyPress(e) {
      if (e.ctrlKey && e.key === 'z') {
        e.preventDefault()
        this.undo()
      } else if (e.ctrlKey && e.key === 'y') {
        e.preventDefault()
        this.redo()
      }

      if (this.selectedObj) {
        if (e.key === '+' || e.key === '=') {
          e.preventDefault()
          this.selectedObj.size = Math.min(200, this.selectedObj.size + 5)
          this.redrawObjects()
          this.saveState()
        } else if (e.key === '-' || e.key === '_') {
          e.preventDefault()
          this.selectedObj.size = Math.max(30, this.selectedObj.size - 5)
          this.redrawObjects()
          this.saveState()
        } else if (e.key.toLowerCase() === 'r') {
          e.preventDefault()
          this.selectedObj.rotation = (this.selectedObj.rotation + 15) % 360
          this.redrawObjects()
          this.saveState()
        } else if (e.key === 'Delete' || e.key === 'Backspace') {
          e.preventDefault()
          this.deleteSelected()
        }
      }
    },
    deleteSelected() {
      if (this.selectedObj) {
        const index = this.objects.indexOf(this.selectedObj)
        if (index > -1) {
          this.objects.splice(index, 1)
          this.selectedObj = null
          this.redrawObjects()
          this.saveState()
        }
      }
    },
    saveState() {
      this.history = this.history.slice(0, this.historyIndex + 1)
      const drawCanvasData = this.$refs.drawCanvas.toDataURL()
      const objectsData = JSON.parse(JSON.stringify(this.objects))
      this.history.push({ drawCanvas: drawCanvasData, objects: objectsData })
      this.historyIndex++
      if (this.history.length > 50) {
        this.history.shift()
        this.historyIndex--
      }
    },
    undo() {
      if (this.historyIndex > 0) {
        this.historyIndex--
        this.restoreState()
      }
    },
    redo() {
      if (this.historyIndex < this.history.length - 1) {
        this.historyIndex++
        this.restoreState()
      }
    },
    restoreState() {
      const state = this.history[this.historyIndex]
      const img = new Image()
      img.src = state.drawCanvas
      img.onload = () => {
        this.drawCtx.clearRect(0, 0, this.$refs.drawCanvas.width, this.$refs.drawCanvas.height)
        this.drawCtx.drawImage(img, 0, 0)
      }
      this.objects = []
      for (let objData of state.objects) {
        const obj = { ...objData, img: new Image() }
        obj.img.src = objData.src
        this.objects.push(obj)
      }
      this.selectedObj = null
      this.redrawObjects()
    }
  }
}
</script>


<style scoped>
.mewarnai {
  position: relative;
  background: #000;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  overflow-x: hidden;
}

/* Tombol Back */
.back-btn {
  position: absolute;
  top: 15px;
  left: 15px;
  padding: 8px 14px;
  background: orange;
  border: none;
  border-radius: 10px;
  font-weight: bold;
  cursor: pointer;
  font-size: 14px;
}

/* Tombol Undo/Redo */
.history-btns {
  position: absolute;
  top: 15px;
  right: 15px;
  display: flex;
  gap: 8px;
}

.history-btn {
  padding: 8px 12px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: bold;
  cursor: pointer;
  font-size: 14px;
  transition: opacity 0.3s;
}
.history-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.history-btn:not(:disabled):hover {
  background: #45a049;
}

/* Area Canvas */
.canvas {
  position: relative;
  margin-top: 60px;
  background: #111;
  border: 2px solid #444;
  border-radius: 8px;
  width: 1000px;
  height: 500px;
  max-width: 95vw;
  overflow: hidden;
}

/* Toolbar kiri (desktop) */
.toolbar {
  position: absolute;
  top: 100px;
  left: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 5;
}

.tool {
  width: 35px;
  height: 35px;
  border: none;
  cursor: pointer;
  border-radius: 50%;
  font-size: 18px;
  transition: all 0.3s;
}
.tool.active {
  border: 3px solid #FFD700;
  box-shadow: 0 0 10px #FFD700;
}

.size-control {
  margin-top: 10px;
  padding: 10px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  width: 120px;
}
.size-control label {
  display: block;
  font-size: 11px;
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
  text-align: center;
}
.size-control input[type="range"] {
  width: 100%;
  cursor: pointer;
}

/* Palette (bawah) */
.palette {
  display: flex;
  gap: 12px;
  margin-top: 20px;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
}
.palette-item {
  width: 60px;
  height: 60px;
  cursor: pointer;
  transition: transform 0.2s;
}
.palette-item:hover {
  transform: scale(1.1);
}
.save-btn {
  margin-left: 15px;
  padding: 12px 18px;
  border: none;
  border-radius: 12px;
  background: green;
  color: #fff;
  font-size: 16px;
  cursor: pointer;
}

/* Panel kontrol objek */
.control-panel {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(255, 255, 255, 0.95);
  padding: 15px 25px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  min-width: 350px;
  max-width: 90vw;
}
.hint {
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
  text-align: center;
  font-size: 13px;
}
.controls {
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: space-between;
}
.control-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.control-item label {
  font-size: 12px;
  font-weight: bold;
  color: #555;
}
.control-item input[type="range"] {
  width: 100%;
  cursor: pointer;
}
.delete-btn {
  padding: 10px 16px;
  background: #f44336;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  white-space: nowrap;
}
.delete-btn:hover {
  background: #da190b;
}

/* ===================== 📱 RESPONSIVE UNTUK MOBILE ===================== */
@media (max-width: 768px) {
  .mewarnai {
    padding: 10px;
  }

  .canvas {
    width: 90vw;
    height: auto;
    aspect-ratio: 2 / 1;
    margin-top: 80px;
  }

  .toolbar {
    position: static;
    flex-direction: row;
    justify-content: center;
    gap: 8px;
    margin-top: 10px;
    background: rgba(255,255,255,0.1);
    padding: 10px;
    border-radius: 10px;
    width: 100%;
    flex-wrap: wrap;
  }

  .tool {
    width: 40px;
    height: 40px;
    font-size: 20px;
  }

  .size-control {
    width: 100px;
    padding: 8px;
    font-size: 12px;
  }

  .palette {
    flex-wrap: wrap;
    gap: 8px;
  }

  .palette-item {
    width: 45px;
    height: 45px;
  }

  .save-btn {
    font-size: 14px;
    padding: 10px 16px;
  }

  .control-panel {
    position: fixed;
    bottom: 10px;
    width: 95vw;
    min-width: unset;
    padding: 10px 15px;
  }

  .hint {
    font-size: 11px;
  }

  .history-btns {
    top: 10px;
    right: 10px;
  }

  .back-btn {
    top: 10px;
    left: 10px;
    font-size: 12px;
    padding: 6px 10px;
  }
}
</style>
