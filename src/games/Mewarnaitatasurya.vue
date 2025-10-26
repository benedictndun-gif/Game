<script>
export default {
  name: "MewarnaiTataSurya",
  data() {
    return {
      colors: ["yellow", "red", "blue", "green", "purple", "black", "white", "orange"],
      items: [
        { name: "Matahari", src: require("@/assets/Matahari.png") },
        { name: "Merkurius", src: require("@/assets/Merkurius.png") },
        { name: "Venus", src: require("@/assets/Venus.png") },
        { name: "Bumi", src: require("@/assets/Bumi.png") },
        { name: "Mars", src: require("@/assets/Mars.png") },
        { name: "Jupiter", src: require("@/assets/Jupiter.png") },
        { name: "Saturnus", src: require("@/assets/Saturnus.png") },
        { name: "Uranus", src: require("@/assets/Uranus.png") },
        { name: "Neptunus", src: require("@/assets/Neptunus.png") }
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
    };
  },
  mounted() {
    this.setCanvasSize();
    window.addEventListener("resize", this.setCanvasSize);

    this.drawCtx = this.$refs.drawCanvas.getContext("2d");
    this.objectCtx = this.$refs.objectCanvas.getContext("2d");
    this.drawCtx.lineCap = "round";

    this.drawCtx.fillStyle = "white";
    this.drawCtx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
    this.saveState();

    const objCanvas = this.$refs.objectCanvas;
    objCanvas.addEventListener("touchstart", this.handleTouchStart, { passive: false });
    objCanvas.addEventListener("touchmove", this.handleTouchMove, { passive: false });
    objCanvas.addEventListener("touchend", this.handleTouchEnd, { passive: false });
  },
  methods: {
    isMobile() {
      return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    },
    setCanvasSize() {
      if (this.isMobile()) {
        this.canvasWidth = window.innerWidth * 0.95;
        this.canvasHeight = window.innerHeight * 0.5;
      } else {
        this.canvasWidth = 1000;
        this.canvasHeight = 500;
      }
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
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY,
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
        this.startAction({ offsetX: (x - this.panX) / this.scale, offsetY: (y - this.panY) / this.scale });
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
        this.moveAction({ offsetX: (x - this.panX) / this.scale, offsetY: (y - this.panY) / this.scale });
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
      const { offsetX, offsetY } = e;
      for (let i = this.objects.length - 1; i >= 0; i--) {
        const obj = this.objects[i];
        if (offsetX >= obj.x && offsetX <= obj.x + obj.size && offsetY >= obj.y && offsetY <= obj.y + obj.size) {
          this.draggingObj = obj;
          this.selectedObj = obj;
          this.offsetX = offsetX - obj.x;
          this.offsetY = offsetY - obj.y;
          return;
        }
      }
      this.selectedObj = null;
      this.drawing = true;
      this.drawCtx.beginPath();
      this.drawCtx.moveTo(offsetX, offsetY);
    },
    moveAction(e) {
      const { offsetX, offsetY } = e;
      if (this.draggingObj) {
        this.draggingObj.x = Math.max(0, Math.min(this.canvasWidth - this.draggingObj.size, offsetX - this.offsetX));
        this.draggingObj.y = Math.max(0, Math.min(this.canvasHeight - this.draggingObj.size, offsetY - this.offsetY));
        this.redrawObjects();
      } else if (this.drawing) {
        if (this.currentTool === "eraser") {
          this.drawCtx.globalCompositeOperation = "destination-out";
          this.drawCtx.lineWidth = this.toolSize;
          this.drawCtx.lineTo(offsetX, offsetY);
          this.drawCtx.stroke();
        } else {
          this.drawCtx.globalCompositeOperation = "source-over";
          this.drawCtx.strokeStyle = this.currentColor;
          this.drawCtx.lineWidth = this.toolSize;
          this.drawCtx.lineTo(offsetX, offsetY);
          this.drawCtx.stroke();
        }
      }
    },
    stopAction() {
      if (this.drawing || this.draggingObj) this.saveState();
      this.drawing = false;
      this.draggingObj = null;
      this.drawCtx.closePath();
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
      this.objectCtx.setTransform(this.scale, 0, 0, this.scale, this.panX, this.panY);
      this.objectCtx.clearRect(
        -this.panX / this.scale,
        -this.panY / this.scale,
        this.canvasWidth / this.scale,
        this.canvasHeight / this.scale
      );
      for (let obj of this.objects) {
        this.objectCtx.save();
        this.objectCtx.translate(obj.x + obj.size / 2, obj.y + obj.size / 2);
        this.objectCtx.rotate((obj.rotation * Math.PI) / 180);
        this.objectCtx.drawImage(obj.img, -obj.size / 2, -obj.size / 2, obj.size, obj.size);
        this.objectCtx.restore();
      }
    },
    saveCanvas() {
      const temp = document.createElement("canvas");
      temp.width = this.canvasWidth;
      temp.height = this.canvasHeight;
      const ctx = temp.getContext("2d");
      ctx.drawImage(this.$refs.drawCanvas, 0, 0);
      ctx.drawImage(this.$refs.objectCanvas, 0, 0);
      const link = document.createElement("a");
      link.download = "gambar_tata_surya.png";
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
        this.restoreState();
      }
    },
    redo() {
      if (this.historyIndex < this.history.length - 1) {
        this.historyIndex++;
        this.restoreState();
      }
    },
    restoreState() {
      const s = this.history[this.historyIndex];
      const img = new Image();
      img.src = s.drawCanvas;
      img.onload = () => {
        this.drawCtx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.drawCtx.drawImage(img, 0, 0);
      };
      this.objects = s.objects.map((o) => ({ ...o, img: Object.assign(new Image(), { src: o.src }) }));
      this.selectedObj = null;
      this.redrawObjects();
    },
  },
};
</script>


<style scoped>
* {
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;
}

.Mewarnaitatasurya {
  position: relative;
  background: #000;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  overflow-x: hidden;
}

/* Header */
.header {
  width: 100%;
  max-width: 1000px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
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

/* Canvas Container */
.canvas-container {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.canvas {
  position: relative;
  background: white;
  border: 3px solid #fff;
  border-radius: 15px;
  box-shadow: 0 8px 24px rgba(255,255,255,0.2);
  touch-action: none;
}

/* Toolbar Section */
.toolbar-section {
  width: 100%;
  max-width: 600px;
  background: rgba(40, 40, 40, 0.95);
  border-radius: 15px;
  padding: 15px;
  margin-bottom: 15px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.5);
}

.tools-colors-row {
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 12px;
}

.tool-btn {
  width: 45px;
  height: 45px;
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
  width: 45px;
  height: 45px;
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
  background: rgba(60, 60, 60, 0.9);
  padding: 10px 15px;
  border-radius: 10px;
  width: 100%;
  max-width: 250px;
  margin: 0 auto;
}

.size-control label {
  display: block;
  font-size: 13px;
  font-weight: bold;
  color: #fff;
  margin-bottom: 8px;
  text-align: center;
}

.size-control input[type="range"] {
  width: 100%;
  cursor: pointer;
  accent-color: #4CAF50;
}

/* Palette Section */
.palette-section {
  width: 100%;
  max-width: 600px;
  background: rgba(40, 40, 40, 0.95);
  border-radius: 15px;
  padding: 15px;
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 12px rgba(0,0,0,0.5);
  margin-bottom: 15px;
}

.palette-item {
  width: 55px;
  height: 55px;
  cursor: pointer;
  transition: transform 0.2s;
  border-radius: 12px;
  box-shadow: 0 3px 10px rgba(0,0,0,0.4);
  background: rgba(255,255,255,0.1);
  padding: 3px;
}

.palette-item:active {
  transform: scale(0.9);
}

.save-btn {
  padding: 12px 24px;
  border: none;
  border-radius: 12px;
  background: #4CAF50;
  color: #fff;
  font-size: 18px;
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

/* Mobile Responsive */
@media (max-width: 768px) {
  .Mewarnaitatasurya {
    padding: 8px;
  }

  .header {
    margin-bottom: 10px;
  }

  .back-btn {
    padding: 8px 16px;
    font-size: 14px;
  }

  .history-btn {
    padding: 8px 12px;
    font-size: 14px;
    min-width: 60px;
  }

  .toolbar-section {
    padding: 12px;
    margin-bottom: 12px;
  }

  .tool-btn, .color-btn {
    width: 40px;
    height: 40px;
    font-size: 20px;
  }

  .size-control {
    max-width: 200px;
  }

  .palette-section {
    padding: 12px;
    gap: 10px;
  }

  .palette-item {
    width: 48px;
    height: 48px;
  }

  .save-btn {
    padding: 10px 20px;
    font-size: 16px;
  }

  .control-panel {
    padding: 12px 15px;
  }

  .controls {
    gap: 10px;
  }

  .control-item label {
    font-size: 10px;
  }

  .delete-btn {
    padding: 8px 12px;
    font-size: 16px;
  }
}
</style>