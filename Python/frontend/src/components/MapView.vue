<template>
  <div ref="viewport" class="map-viewport">
    <img
      ref="imgEl"
      class="map-image"
      :src="src"
      alt="Map"
      draggable="false"
      @load="fitToView"
    />
  </div>
</template>

<script>
import Panzoom from '@panzoom/panzoom'

export default {
  name: 'MapView',
  props: {
    src: { type: String, required: true },
    maxScale: { type: Number, default: 6 },
    fit: { type: String, default: 'contain' } // 'contain' | 'cover'
  },
  data() {
    return { pz: null, ro: null }
  },
  mounted() {
    const img = this.$refs.imgEl
    const viewport = this.$refs.viewport

    this.pz = Panzoom(img, {
      contain: 'outside',
      maxScale: this.maxScale,
      minScale: 0.1,
      startScale: 1,
      step: 0.2,
      animate: true
    })

    // Zoom with wheel
    viewport.addEventListener('wheel', (e) => {
      e.preventDefault()
      this.pz.zoomWithWheel(e)
    }, { passive: false })

    // Refit when the viewport resizes
    this.ro = new ResizeObserver(() => this.fitToView())
    this.ro.observe(viewport)

    // If the image was cached, 'load' might not fire
    if (img.complete && img.naturalWidth) {
      this.fitToView()
    } else {
      img.addEventListener('load', this.fitToView, { once: true })
    }

    // Also refit on the next frame to catch any late style/layout changes
    requestAnimationFrame(() => this.fitToView())
  },
  beforeUnmount() {
    this.ro?.disconnect()
    window.removeEventListener('resize', this.fitToView)
  },
  methods: {
    fitToView() {
      const img = this.$refs.imgEl
      const viewport = this.$refs.viewport
      if (!img || !img.naturalWidth || !viewport) return

      const vw = viewport.clientWidth || 0
      const vh = viewport.clientHeight || 0
      const iw = img.naturalWidth || 0
      const ih = img.naturalHeight || 0
      if (!vw || !vh || !iw || !ih) return  // bail if sizes not ready

      const scale = this.fit === 'cover'
        ? Math.max(vw / iw, vh / ih)
        : Math.min(vw / iw, vh / ih)

      this.pz.setOptions({ minScale: scale })
      this.pz.zoom(scale, { animate: false })

      const sw = iw * scale
      const sh = ih * scale
      const offsetX = (vw - sw) / 2
      const offsetY = (vh - sh) / 2
      this.pz.moveTo(offsetX, offsetY, { animate: false })

      // Force a repaint on some browsers / hot-reload edge cases
      // (reads + writes a style to trigger reflow)
      // eslint-disable-next-line no-unused-expressions
      img.offsetHeight
      img.style.transform += ' translateZ(0)'
      // remove the extra Z after a tick so transforms stay tidy
      requestAnimationFrame(() => {
        img.style.transform = img.style.transform.replace(' translateZ(0)', '')
      })
    },
    resetView() { this.fitToView() },
    zoomIn() { this.pz.zoomIn() },
    zoomOut() { this.pz.zoomOut() }
  }
}
</script>


<style scoped>
.map-viewport {
  position: fixed;   /* fills the screen; if you kept a header area, change to absolute and size the parent */
  inset: 0;
  overflow: hidden;  /* no scrollbars while the image is larger than viewport */
  background: #000;  /* avoids white borders while letterboxed in 'contain' */
  z-index: 0;
}

/* Let Panzoom control size via transforms (no intrinsic shrinking) */
.map-image {
  position: absolute;      /* so transforms don’t affect layout */
  top: 0; left: 0;
  max-width: none;         /* keep natural size for accurate scaling */
  max-height: none;
  user-select: none;
  -webkit-user-drag: none;
  touch-action: none;
  transform-origin: 0 0;   /* Panzoom expects top-left origin */
  will-change: transform;
  display: block;
}
</style>
