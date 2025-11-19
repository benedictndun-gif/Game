<template>
  <div class="Mewarnaitatasurya">
    <!-- Left Toolbar -->
    <div class="left-toolbar">
      <div class="tool-group">
        <button class="tool-btn" :class="{ active: currentTool === 'pencil' }" @click="setTool('pencil')" title="Pensil">✏️</button>
        <button class="tool-btn" :class="{ active: currentTool === 'eraser' }" @click="setTool('eraser')" title="Penghapus">🧼</button>
      </div>
      <div class="color-palette">
        <button
            v-for="color in colors"
            :key="color"
            class="color-btn"
            :style="{ backgroundColor: color }"
            :class="{ active: currentColor === color && currentTool !== 'eraser' }"
            @click="setColor(color)"
        ></button>
      </div>
      <div class="size-control">
        <label>Ukuran</label>
        <input type="range" min="1" max="50" v-model.number="toolSize" />
        <span>{{ toolSize }}</span>
      </div>
    </div>

    <!-- Main Content (Canvas) -->
    <div class="main-content">
      <div class="header">
        <button @click="$router.back()" class="back-btn">Kembali</button>
        <div class="history-btns">
          <button @click="undo" :disabled="historyIndex <= 0" class="history-btn">Undo</button>
          <button @click="redo" :disabled="historyIndex >= history.length - 1" class="history-btn">Redo</button>
        </div>
      </div>
      <div class="canvas-container">
        <div class="canvas">
          <canvas
            ref="drawCanvas"
            :width="canvasWidth"
            :height="canvasHeight"
            style="position: absolute; top: 0; left: 0; z-index: 0"
          ></canvas>
          <canvas
            ref="objectCanvas"
            :width="canvasWidth"
            :height="canvasHeight"
            style="position: relative; z-index: 1; cursor: crosshair"
            @mousedown="startAction"
            @mousemove="moveAction"
            @mouseup="stopAction"
            @mouseleave="stopAction"
          ></canvas>
        </div>
      </div>
    </div>

    <!-- Right Palette -->
    <div class="right-palette">
      <h3>Objek Langit</h3>
      <div class="palette-items">
        <img
          v-for="item in items"
          :key="item.name"
          :src="item.src"
          :alt="item.name"
          class="palette-item"
          @click="addItem(item)"
          draggable="false"
          :title="item.name"
        />
      </div>
      <button @click="saveCanvas" class="save-btn">Simpan Gambar</button>
    </div>

     <!-- Object Controls (optional, shown when an object is selected) -->
     <div v-if="selectedObj" class="control-panel">
       <div class="controls">
         <div class="control-item">
           <label>Rotasi: {{ selectedObj.rotation }}°</label>
           <input type="range" min="0" max="360" v-model.number="selectedObj.rotation" @input="redrawObjects" @change="saveState" />
         </div>
         <div class="control-item">
           <label>Ukuran: {{ selectedObj.size }}</label>
           <input type="range" min="20" max="200" v-model.number="selectedObj.size" @input="redrawObjects" @change="saveState" />
         </div>
         <button @click="deleteSelectedObject" class="delete-btn">🗑️</button>
       </div>
     </div>
  </div>
</template>

<script>
export default {
  name: "MewarnaiTataSurya",
  data() {
    return {
      colors: ["yellow", "red", "blue", "green", "purple", "black", "white", "orange"],
      items: [
        { name: "Bulan", src: require("@/assets/Bulan.png") },
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
      historyIndex: -1,
      canvasWidth: 1000,
      canvasHeight: 500,

      // ➕ Tambahan untuk zoom & panning
      scale: 1,
      lastScale: 1,
      panX: 0,
      panY: 0,
      lastPanX: 0,
      lastPanY: 0,
      pinchStartDist: null,
      pinchStartScale: 1,
      isPinching: false,
      backgroundImage: null,
    };
  },
  mounted() {
    this.setCanvasSize();
    window.addEventListener("resize", this.setCanvasSize);

    this.drawCtx = this.$refs.drawCanvas.getContext("2d");
    this.objectCtx = this.$refs.objectCanvas.getContext("2d");
    this.drawCtx.lineCap = "round";

    // Load and draw the background image
    this.backgroundImage = new Image();
    this.backgroundImage.src = require("@/assets/canvas_background.jpg");
    this.backgroundImage.onload = () => {
      this.drawBackground();
      this.saveState(); // Save initial state with background
    };

    const objCanvas = this.$refs.objectCanvas;
    objCanvas.addEventListener("touchstart", this.handleTouchStart, { passive: false });
    objCanvas.addEventListener("touchmove", this.handleTouchMove, { passive: false });
    objCanvas.addEventListener("touchend", this.handleTouchEnd, { passive: false });
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.setCanvasSize);
    const objCanvas = this.$refs.objectCanvas;
    if (objCanvas) {
      objCanvas.removeEventListener("touchstart", this.handleTouchStart);
      objCanvas.removeEventListener("touchmove", this.handleTouchMove);
      objCanvas.removeEventListener("touchend", this.handleTouchEnd);
    }
  },
  methods: {
    isMobile() {
      return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    },
    setCanvasSize() {
      if (this.isMobile()) {
        this.canvasWidth = window.innerWidth * 0.95;
        this.canvasHeight = window.innerHeight * 0.4; // Adjusted for mobile
      } else {
        this.canvasWidth = window.innerWidth * 0.6; // Take up 60% of viewport width
        this.canvasHeight = window.innerHeight * 0.75; // Take up 75% of viewport height
      }
      this.$nextTick(() => {
        if (this.$refs.drawCanvas && this.$refs.objectCanvas) {
            this.$refs.drawCanvas.width = this.canvasWidth;
            this.$refs.drawCanvas.height = this.canvasHeight;
            this.$refs.objectCanvas.width = this.canvasWidth;
            this.$refs.objectCanvas.height = this.canvasHeight;
            this.restoreState(true); // Redraw everything after resize
            this.drawBackground();
        }
      });
    },
    // =========================
    // 🎨 DRAWING & OBJECT TOOLS
    // =========================
    setColor(color) {
      this.currentColor = color;
      if (this.currentTool === "eraser") this.currentTool = "pencil";
    },
    setTool(tool) {
      this.currentTool = tool;
    },
    getCanvasCoordinates(e) {
      const rect = this.$refs.objectCanvas.getBoundingClientRect();
      const scaleX = this.canvasWidth / rect.width;
      const scaleY = this.canvasHeight / rect.height;
      return {
        x: (e.clientX - rect.left) * scaleX ,
        y: (e.clientY - rect.top) * scaleY ,
      };
    },
    // =========================
    // 👆 TOUCH HANDLING
    // =========================
    handleTouchStart(e) {
      if (e.touches.length === 1) {
        // single touch → drag or draw
        const t = e.touches[0];
        const { x, y } = this.getCanvasCoordinates(t);
        this.startAction({ offsetX: x, offsetY: y });
      } else if (e.touches.length === 2) {
        // double touch → pinch zoom
        this.isPinching = true;
        this.pinchStartDist = this.getDistance(e.touches[0], e.touches[1]);
        this.pinchStartScale = this.scale;
        const center = this.getTouchCenter(e.touches[0], e.touches[1]);
        this.lastPanX = this.panX;
        this.lastPanY = this.panY;
        this.centerStart = center;
      }
    },
    handleTouchMove(e) {
      if (this.isPinching && e.touches.length === 2) {
        e.preventDefault();
        const newDist = this.getDistance(e.touches[0], e.touches[1]);
        const scaleChange = newDist / this.pinchStartDist;
        this.scale = Math.min(Math.max(this.pinchStartScale * scaleChange, 0.5), 3); // batas zoom
        const newCenter = this.getTouchCenter(e.touches[0], e.touches[1]);
        this.panX = this.lastPanX + (newCenter.x - this.centerStart.x);
        this.panY = this.lastPanY + (newCenter.y - this.centerStart.y);
        this.redrawObjects();
        return;
      }

      if (e.touches.length === 1) {
        const t = e.touches[0];
        const { x, y } = this.getCanvasCoordinates(t);
        this.moveAction({ offsetX: x, offsetY: y });
      }
    },
    handleTouchEnd(e) {
      if (e.touches.length === 0 && this.isPinching) {
        this.isPinching = false;
      }
      this.stopAction();
    },
    getDistance(t1, t2) {
      const dx = t2.clientX - t1.clientX;
      const dy = t2.clientY - t1.clientY;
      return Math.sqrt(dx * dx + dy * dy);
    },
    getTouchCenter(t1, t2) {
      return { x: (t1.clientX + t2.clientX) / 2, y: (t1.clientY + t2.clientY) / 2 };
    },
    // =========================
    // 🪐 OBJECT CONTROL
    // =========================
    startAction(e) {
      const worldCoords = this.getCanvasWorldCoordinates(e);
      const { offsetX, offsetY } = worldCoords;

      this.drawing = true; // Assume drawing until an object is found
      for (let i = this.objects.length - 1; i >= 0; i--) {
        const obj = this.objects[i];
        if (offsetX >= obj.x && offsetX <= obj.x + obj.size && offsetY >= obj.y && offsetY <= obj.y + obj.size) {
          this.draggingObj = obj;
          this.selectedObj = obj;
          this.offsetX = offsetX - obj.x;
          this.offsetY = offsetY - obj.y;
          this.drawing = false; // It's a drag, not a draw
          return;
        }
      }
      this.selectedObj = null;
      
      // Start drawing
      this.drawCtx.save();
      this.drawCtx.setTransform(this.scale, 0, 0, this.scale, this.panX, this.panY);
      this.drawCtx.beginPath();
      this.drawCtx.moveTo(offsetX, offsetY);
    },
    moveAction(e) {
      const { offsetX, offsetY } = this.getCanvasWorldCoordinates(e);
      if (this.draggingObj) {
        this.draggingObj.x = Math.max(0, Math.min(this.canvasWidth - this.draggingObj.size, offsetX - this.offsetX));
        this.draggingObj.y = Math.max(0, Math.min(this.canvasHeight - this.draggingObj.size, offsetY - this.offsetY));
        this.redrawObjects();
      } else if (this.drawing) {
        this.drawCtx.lineWidth = this.toolSize / this.scale;
        if (this.currentTool === "eraser") {
          this.drawCtx.globalCompositeOperation = "destination-out";
          this.drawCtx.lineTo(offsetX, offsetY);
          this.drawCtx.stroke();
        } else {
          this.drawCtx.globalCompositeOperation = "source-over";
          this.drawCtx.strokeStyle = this.currentColor;
          this.drawCtx.lineTo(offsetX, offsetY);
          this.drawCtx.stroke();
        }
      }
    },
    stopAction() {
      if (this.drawing || this.draggingObj) this.saveState();
      this.drawing = false;
      this.draggingObj = null;
      if (this.drawCtx.restore) {
        this.drawCtx.closePath();
        this.drawCtx.restore();
      }
    },
    addItem(item) {
      const size = this.isMobile() ? 60 : 80;
      const obj = {
        name: item.name,
        img: new Image(),
        x: Math.random() * (this.canvasWidth - size),
        y: Math.random() * (this.canvasHeight - size),
        size: size,
        rotation: 0,
        src: item.src,
      };
      obj.img.src = item.src;
      obj.img.onload = () => {
        this.objects.push(obj);
        this.redrawObjects();
        this.saveState();
      };
    },
    redrawObjects() {
      this.objectCtx.clearRect(
        0, 0, this.canvasWidth, this.canvasHeight
      );
      this.objectCtx.save();
      this.objectCtx.setTransform(this.scale, 0, 0, this.scale, this.panX, this.panY);

      // Clear with transformed context
      this.objectCtx.clearRect(-this.panX / this.scale, -this.panY / this.scale, this.canvasWidth / this.scale, this.canvasHeight / this.scale);
      for (let obj of this.objects) {
        this.objectCtx.save();
        this.objectCtx.translate(obj.x + obj.size / 2, obj.y + obj.size / 2);
        this.objectCtx.rotate((obj.rotation * Math.PI) / 180);
        this.objectCtx.drawImage(obj.img, -obj.size / 2, -obj.size / 2, obj.size, obj.size);
        this.objectCtx.restore();
      }
      this.objectCtx.restore();
    },
    saveCanvas() {
      const temp = document.createElement("canvas");
      temp.width = this.canvasWidth;
      temp.height = this.canvasHeight;
      const ctx = temp.getContext("2d");
      ctx.drawImage(this.$refs.drawCanvas, 0, 0);
      
      // Draw objects onto the temporary canvas without transforms
      for (let obj of this.objects) {
          ctx.drawImage(obj.img, obj.x, obj.y, obj.size, obj.size);
      }

      const link = document.createElement('a');
      link.download = "gambar_langit.png";
      link.href = temp.toDataURL();
      link.click();
    },
    saveState() {
      this.history = this.history.slice(0, this.historyIndex + 1);
      const drawData = this.$refs.drawCanvas.toDataURL();
      const objData = JSON.parse(JSON.stringify(this.objects));
      this.history.push({ drawCanvas: drawData, objects: objData });
      this.historyIndex++;
      if (this.history.length > 50) {
        this.history.shift();
        this.historyIndex--;
      }
    },
    undo() {
      if (this.historyIndex > 0) {
        this.historyIndex--;
        this.restoreState(false);
      }
    },
    redo() {
      if (this.historyIndex < this.history.length - 1) {
        this.historyIndex++;
        this.restoreState(false);
      }
    },
    restoreState(isResize = false) {
      if (this.history.length === 0) return;
      const s = this.history[this.historyIndex];
      const img = new Image();
      img.src = s.drawCanvas;
      img.onload = () => {
        this.drawCtx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.drawCtx.drawImage(img, 0, 0);
        if (isResize) this.redrawObjects(); // Also redraw objects if it's a resize event
      };
      
      // Only restore objects if not a resize, to avoid losing current state
      if (!isResize) {
        this.objects = [];
        this.selectedObj = null;
        let loadedCount = 0;
        if (s.objects.length === 0) {
          this.redrawObjects();
          return;
        }
        s.objects.forEach(o => {
            const newImg = new Image();
            const newObj = { ...o, img: newImg };
            newImg.src = o.src;
            newImg.onload = () => {
                this.objects.push(newObj);
                loadedCount++;
                if (loadedCount === s.objects.length) {
                    this.redrawObjects();
                }
            };
        });
      }
    },
    getCanvasWorldCoordinates(e) {
      const { offsetX, offsetY } = e;
      return {
        offsetX: (offsetX - this.panX) / this.scale,
        offsetY: (offsetY - this.panY) / this.scale,
      };
    },
    deleteSelectedObject() {
      if (this.selectedObj) {
        this.objects = this.objects.filter(obj => obj !== this.selectedObj);
        this.selectedObj = null;
        this.redrawObjects();
        this.saveState();
      }
    },
    drawBackground() {
      if (!this.backgroundImage) return;
      this.drawCtx.drawImage(this.backgroundImage, 0, 0, this.canvasWidth, this.canvasHeight);
    },
  }
}
</script>


<style scoped>
* {
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;
}

.Mewarnaitatasurya {
  position: relative;
  background: #1a1a1a;
  min-height: 100vh;
  display: flex;
  flex-direction: row;
  align-items: stretch;
  padding: 10px;
  overflow-x: hidden;
}

/* Header */
.header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  padding: 0 10px;
  padding: 0 5px;
}

.back-btn {
  padding: 10px 20px;
  background: #ff9800;
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: bold;
  font-size: 16px;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0,0,0,0.3);
  transition: transform 0.2s;
}

.back-btn:active {
  transform: scale(0.95);
}

.history-btns {
  display: flex;
  gap: 10px;
}

.history-btn {
  padding: 10px 16px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: bold;
  font-size: 16px;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0,0,0,0.3);
  transition: opacity 0.3s, transform 0.2s;
  min-width: 70px;
}

.history-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.history-btn:not(:disabled):active {
  transform: scale(0.95);
}

/* Area Canvas */
.canvas {
  position: relative;
  background: black;
  border: 3px solid #fff;
  border-radius: 15px;
  box-shadow: 0 8px 24px rgba(255,255,255,0.2);
  touch-action: none;
}

/* Canvas Container */
.canvas-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
}

/* Layout Sections */
.left-toolbar, .right-palette {
  background: rgba(40, 40, 40, 0.8);
  border-radius: 15px;
  padding: 20px 15px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.left-toolbar {
  flex-basis: 100px;
}

.main-content {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  padding: 0 15px;
}

.right-palette {
  flex-basis: 240px;
}

.right-palette h3 {
  color: #fff;
  margin: 0 0 10px 0;
  font-size: 16px;
  text-align: center;
}

/* Left Toolbar Content */
.tool-group {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.color-palette {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
}

.tool-btn {
  width: 50px;
  height: 50px;
  border: 2px solid #666;
  cursor: pointer;
  border-radius: 50%;
  font-size: 22px;
  transition: all 0.3s;
  background: #222;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.3);
}

.tool-btn.active {
  border: 3px solid #FFD700;
  box-shadow: 0 0 15px rgba(255, 215, 0, 0.6);
  transform: scale(1.1);
  background: #333;
}

.color-btn {
  width: 35px;
  height: 35px;
  border: 2px solid #666;
  cursor: pointer;
  border-radius: 50%;
  transition: all 0.3s;
  box-shadow: 0 2px 8px rgba(0,0,0,0.3);
}

.color-btn.active {
  border: 3px solid #FFD700;
  box-shadow: 0 0 15px rgba(255, 215, 0, 0.6);
  transform: scale(1.15);
}

.size-control {
  width: 100%;
  text-align: center;
  color: #fff;
}

.size-control label {
  display: block;
  font-size: 13px;
  font-weight: bold;
  margin-bottom: 8px;
}

.size-control input[type="range"] {
  width: 100%;
  cursor: pointer;
  accent-color: #4CAF50;
  margin-bottom: 5px;
}

.size-control span {
  font-size: 12px;
}

/* Right Palette Content */
.palette-items {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  flex-grow: 1;
  overflow-y: auto;
  max-height: 70vh;
}

.palette-item {
  width: 60px;
  height: 60px;
  cursor: pointer;
  transition: transform 0.2s;
  border-radius: 12px;
  box-shadow: 0 3px 10px rgba(0,0,0,0.4);
  background: rgba(255,255,255,0.1);
  padding: 3px;
}

.palette-item:hover {
  transform: scale(1.1);
  background: rgba(255,255,255,0.2);
}

.palette-item:active {
  transform: scale(0.9);
}

.save-btn {
  width: 100%;
  padding: 12px 24px;
  border: none;
  border-radius: 12px;
  background: #4CAF50;
  color: #fff;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.4);
  transition: transform 0.2s;
}

.save-btn:active {
  transform: scale(0.95);
}

/* Control Panel */
.control-panel {
  position: fixed;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(255, 255, 255, 0.98);
  padding: 15px 20px;
  border-radius: 15px;
  box-shadow: 0 6px 20px rgba(0,0,0,0.4);
  max-width: 95%;
  width: 100%;
  max-width: 500px;
  z-index: 100;
}

.controls {
  display: flex;
  gap: 15px;
  align-items: center;
  justify-content: space-between;
}
.control-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 5px;
  min-width: 0;
}
.control-item label {
  font-size: 11px;
  font-weight: bold;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.control-item input[type="range"] {
  width: 100%;
  cursor: pointer;
  accent-color: #4CAF50;
}
.delete-btn {
  padding: 10px 16px;
  background: #f44336;
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: bold;
  cursor: pointer;
  white-space: nowrap;
  font-size: 18px;
  box-shadow: 0 4px 10px rgba(244, 67, 54, 0.4);
  flex-shrink: 0;
}

.delete-btn:active {
  transform: scale(0.95);
}

/* ===================== 📱 RESPONSIVE UNTUK MOBILE ===================== */
@media (max-width: 768px) {
  .Mewarnaitatasurya {
    flex-direction: column;
  }

  .left-toolbar, .right-palette {
    flex-direction: row;
    flex-wrap: wrap;
    width: 100%;
    flex-basis: auto;
    padding: 10px;
    margin-bottom: 10px;
  }

  .main-content {
    order: -1; /* Move canvas to top on mobile */
    padding: 0;
  }

  .control-panel {
    padding: 12px 15px;
  }
}
</style>
