<template>
  <div ref="viewport" class="map-viewport">
    <!-- Transform target: image + markers move/scale together -->
    <div ref="inner" class="map-inner">
      <img
        ref="imgEl"
        class="map-image"
        :src="src"
        alt="Map"
        draggable="false"
        @load="onImgLoad"
      />

      <!-- Markers live in the same transformed coordinate space -->
      <div class="marker-layer">
        <div
          v-for="m in visibleMarkers"
          :key="m.id"
          class="marker" :class="['type-' + (m.type || 'default'), m.isGroup ? 'is-group' : '']"
          :style="markerStyle(m)"
          @click.stop="onMarkerClick(m)"
          title="Click for details"
        >
          <div class="pin"></div>
        </div>
      </div>
    </div>

    <!-- Group popover is UI-sized (not scaled), positioned in viewport px -->
    <SubmenuPopover
      v-if="openGroup && groupVisible"
      :x="popoverPos.x"
      :y="popoverPos.y"
      :title="openGroup.title"
      :items="openGroup.items"
      @select="handleSubSelect"
      @close="openGroup = null"
    />
  </div>
</template>

<script>
import Panzoom from '@panzoom/panzoom'
import SubmenuPopover from './SubmenuPopover.vue'

export default {
  emits: ['open-marker'],
  name: 'MapView',
  components: { SubmenuPopover },
  props: {
    src: { type: String, required: true },
    fit: { type: String, default: 'contain' }, // 'contain' | 'cover'
    maxScale: { type: Number, default: 6 },
    // Markers: array of { id, type, x, y, title?, items? }
    // x,y are normalized 0..1 relative to the image's natural size.
    markers: { type: Array, default: () => [] },
    // Zoom level where a group hides and its children appear
    groupRevealScale: { type: Number, default: 2.0 }
  },
  data() {
    return {
      pz: null,
      ro: null,
      imgNatural: { w: 0, h: 0 },
      currentScale: 1,
      openGroup: null,
      popoverPos: { x: 0, y: 0 }
    }
  },
  computed: {
    groupVisible() {
      return this.currentScale < this.groupRevealScale
    },
    visibleMarkers() {
      const out = []
      for (const m of this.markers) {
        if (m.type === 'group') {
          if (this.groupVisible) {
            out.push({ ...m, isGroup: true })
          } else {
            // when zoomed in, show children instead of group
            for (const c of (m.items || [])) out.push({ ...c, isChildOf: m.id })
          }
        } else {
          out.push(m)
        }
      }
      return out
    }
  },
  mounted() {
    const inner = this.$refs.inner
    const viewport = this.$refs.viewport
    const img = this.$refs.imgEl

    // Panzoom on the INNER wrapper so image + markers move/scale together
    this.pz = Panzoom(inner, {
      contain: 'outside',
      maxScale: this.maxScale,
      minScale: 0.1,
      startScale: 1,
      step: 0.2,
      animate: true
    })

    // Wheel to zoom on the viewport
    viewport.addEventListener('wheel', (e) => {
      e.preventDefault()
      this.pz.zoomWithWheel(e)
    }, { passive: false })

    // Track pan/zoom updates for scale & popover following
    const onChange = () => {
      this.currentScale = this.pz.getScale()
      this.updatePopoverScreenPos()
      if (!this.groupVisible) this.openGroup = null // hide popover when groups are hidden
    }
    inner.addEventListener('panzoomchange', onChange)
    inner.addEventListener('panzoompan', onChange)
    inner.addEventListener('panzoomzoom', onChange)

    // Re-fit when the container size changes
    this.ro = new ResizeObserver(() => this.fitToView())
    this.ro.observe(viewport)

    // If the image was cached, load may not fire
    if (img.complete && img.naturalWidth) {
      this.onImgLoad()
    }

    // Safety: also fit next frame in case layout/styles arrive late
    requestAnimationFrame(() => this.fitToView())
  },
  beforeUnmount() {
    this.ro?.disconnect()
  },
  methods: {
    onImgLoad() {
      const img = this.$refs.imgEl
      if (!img || !img.naturalWidth) return
      this.imgNatural.w = img.naturalWidth
      this.imgNatural.h = img.naturalHeight
      this.fitToView()
    },

    fitToView() {
      const inner = this.$refs.inner
      const viewport = this.$refs.viewport
      const { w: iw, h: ih } = this.imgNatural
      if (!inner || !viewport || !iw || !ih) return

      // Size the transform target to the image's native resolution
      inner.style.width = `${iw}px`
      inner.style.height = `${ih}px`

      const vw = viewport.clientWidth || 0
      const vh = viewport.clientHeight || 0
      if (!vw || !vh) return

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

      // Nudge paint for hot-reload edge cases
      // eslint-disable-next-line no-unused-expressions
      this.$refs.imgEl?.offsetHeight
    },

    // Convert normalized coords to pixel positions in the inner (natural) space
    markerStyle(m) {
      const left = (m.x || 0) * this.imgNatural.w
      const top  = (m.y || 0) * this.imgNatural.h
      return { left: `${left}px`, top: `${top}px` }
    },

    onMarkerClick(m) {
      if (m.isGroup) {
        this.openGroup = m
        this.updatePopoverScreenPos()
      } else {
        // child/normal marker → open modal, navigate, etc.
        this.$emit('open-marker', m)
      }
    },

    updatePopoverScreenPos() {
      if (!this.openGroup || !this.pz) return
      const { x: panX, y: panY } = this.pz.getPan()
      const scale = this.pz.getScale()
      const mx = this.openGroup.x * this.imgNatural.w
      const my = this.openGroup.y * this.imgNatural.h
      // Convert to viewport/screen pixels
      this.popoverPos.x = panX + mx * scale
      this.popoverPos.y = panY + my * scale
    },

    // Optional controls to expose
    resetView() { this.fitToView() },
    zoomIn() { this.pz?.zoomIn() },
    zoomOut() { this.pz?.zoomOut() }
  }
}
</script>

<style scoped>
/* Fill the window; change to 'absolute' and size a parent if needed */
.map-viewport {
  position: fixed;
  inset: 0;
  overflow: hidden;
  background: #000;
  z-index: 0; /* map sits behind UI elements */
}

/* Transform target (Panzoom applies transforms here) */
.map-inner {
  position: absolute;
  top: 0;
  left: 0;
}

/* Raw image; Panzoom handles transform via the .map-inner */
.map-image {
  position: absolute;
  top: 0;
  left: 0;
  max-width: none;
  max-height: none;
  user-select: none;
  -webkit-user-drag: none;
  touch-action: none;
  transform-origin: 0 0;
}

.marker-layer {
  pointer-events: none;
  pointer-events: none;
  position: absolute;
  inset: 0;
  pointer-events: none; /* so dragging pans the map unless on a marker */
  z-index: 10;
}

.marker {
  pointer-events: auto; cursor: pointer;
  pointer-events: auto; cursor: pointer;
  position: absolute;
  transform: translate(-50%, -100%); /* tip at the (x,y) point */
  pointer-events: auto;
  z-index: 10;
}

/* Simple circular pin; style per type as needed */

/* === Type accent colors for marker pins === */
.marker .pin {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 2px solid var(--accent, rgba(0,0,0,.35));
  box-shadow: 0 2px 6px rgba(0,0,0,.35);
  background: #0e1118; /* neutral so the ring color pops */
}
.marker.type-site    .pin { --accent: #eab308; }
.marker.type-text    .pin { --accent: #14b8a6; }
.marker.type-artifact .pin { --accent: #f97316; }
.marker.type-region  .pin,
.marker.type-group   .pin,
.marker.is-group     .pin { --accent: #60a5fa; }


.marker.type-site  .pin { background: #f59e0b; } /* amber */
.marker.type-text  .pin { background: #14b8a6; } /* teal */
.marker.is-group    .pin { background: #60a5fa; } /* blue for group */

/* Type-based accent ring */
.marker.type-site      .pin { --accent: #eab308; } /* amber */
.marker.type-text      .pin { --accent: #14b8a6; } /* teal */
.marker.type-artifact  .pin { --accent: #f97316; } /* orange */
.marker.type-region    .pin,
.marker.type-group     .pin,
.marker.is-group       .pin { --accent: #60a5fa; } /* blue */

</style>
