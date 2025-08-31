<template>
  <div class="menu-container">
    <!-- Circle / X button -->
    <button
      class="menu-button"
      :class="{ open }"
      @click="toggle"
      aria-label="Open menu"
      :aria-expanded="open.toString()"
    >
      <span class="line line1"></span>
      <span class="line line2"></span>
      <span class="line line3"></span>
    </button>

    <!-- Left-side panel overlay (grows from the button) -->
    <div class="panel" :class="{ open }" @transitionend="onTransitionEnd" @click.self="close">
      <ul class="menu-list" :class="{ show: contentVisible }">
        <li @click="go('evidence')">Top Evidence</li>
        <li @click="go('news')">News</li>
        <li @click="go('queries')">Queries</li>
        <li @click="go('amendments')">Amendments</li>
        <li @click="go('plato')">Plato Texts</li>
        <li @click="go('about')">About</li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "MenuButton",
  data() {
    return { open: false, contentVisible: false }
  },
  methods: {
    toggle() {
      this.open = !this.open
      if (!this.open) this.contentVisible = false
    },
    close() { this.open = false; this.contentVisible = false },
    onTransitionEnd(e) {
      // Only show content after width/height finishes (panel fully open)
      if (this.open && (e.propertyName === 'width' || e.propertyName === 'height')) {
        this.contentVisible = true
      }
    },
    go(route) {
      // hook up vue-router later if you like
      this.close()
    }
  }
}
</script>

<style scoped>
/* Button position */
.menu-container {
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 5000; /* above the map */
}

/* ===== Button + X animation ===== */
.menu-button {
  width: 56px; height: 56px;
  border-radius: 56px;
  background: #0d9488;
  border: 0; cursor: pointer;
  position: relative;
  box-shadow: 0 4px 16px rgba(0,0,0,.35);
  transition: background .25s ease;
  z-index: 2; 
}
.menu-button:hover { background: #14b8a6; }

.line {
  position: absolute; left: 50%;
  width: 26px; height: 3px;
  background: #fff; border-radius: 2px;
  transform: translateX(-50%);
  transition: transform .35s ease, opacity .25s ease, top .25s ease;
}
.line1 { top: 18px; }
.line2 { top: 26px; }
.line3 { top: 34px; }
.menu-button.open .line1 { top: 26px; transform: translateX(-50%) rotate(45deg); }
.menu-button.open .line2 { opacity: 0; transform: translateX(-50%) scaleX(.2); }
.menu-button.open .line3 { top: 26px; transform: translateX(-50%) rotate(-45deg); }

/* ===== Left-side panel (grows from the button) ===== */
.panel {
  /* anchor to viewport left edge, start aligned with the button */
  position: fixed;
  top: 20px;            /* same as button top */
  left: 20px;           /* same as button left */
  width: 56px;          /* starts as a circle */
  height: 56px;
  border-radius: 28px;  /* circle */
  background: rgba(13,148,136,.95);
  color: #fff;
  overflow: hidden;     /* hide text while growing */
  z-index: 1;        /* under button, above map */
  pointer-events: none;
  transition:
    width .45s cubic-bezier(.22,.61,.36,1),
    height .45s cubic-bezier(.22,.61,.36,1),
    border-radius .45s ease;
}

/* Open state: full-height left panel */
.panel.open {
  top: 20px;               /* slide up to top */
  left: 20px;              /* slide to far left */
  height: 70%;        /* full viSewport height */
  width: 270px;         /* panel width (tweak as you like) */
  border-radius: 30px; /* rounded right edge only */
  pointer-events: auto;       /* <-- clickable when open */
}

/* Menu content */
.menu-list {
  list-style: none;
  margin: 80px 0 0;     /* push content below button area */
  padding: 0 24px;
  text-align: left;
  font-size: clamp(1rem, 1.8vw, 1.25rem);
  line-height: 2;
  opacity: 0;           /* hidden until panel finishes opening */
  transition: opacity .25s ease;
}
.menu-list.show { opacity: 1; }

.menu-list li {
  cursor: pointer;
  transition: transform .15s ease, color .15s ease;
}
.menu-list li:hover {
  transform: translateX(3px);
  color: #a7f3d0;
}
</style>
