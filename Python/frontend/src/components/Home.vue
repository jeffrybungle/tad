<template>
  <div>
    <HeaderBar
      :loggedIn="false"
      username=""
      userImage=""
      @openModal="handleOpenModal"
    />

    <MapView
      src="/img/map.jpg"
      :markers="markers"
      :groupRevealScale="2.0"
      @open-marker="openMarker"
    />

    <!-- floating menu above the map -->
    <div style="position: relative; z-index: 5000;">
      <MenuButton />
    </div>

    <!-- ADMIN (hidden when SHOW_ADMIN=false) -->
    <div v-if="SHOW_ADMIN">
      <section style="margin-left:220px; padding:1rem;">
        <h2>Users (from Flask)</h2>
        <p v-if="loading">Loading…</p>
        <p v-else-if="error">{{ error }}</p>
        <ul v-else>
          <li v-for="u in users" :key="u.username">
            {{ u.username }} — {{ u.role }}
          </li>
        </ul>
      </section>

      <div class="home-page">
        <div id="layout-wrapper">
          <aside class="sidebar" id="admin-controls">
            <h2>Admin Mode</h2>
            <ul>
              <li>Queries</li>
              <li>Locations</li>
              <li>Users</li>
            </ul>
            <button id="admin-logout-btn">Logout</button>
          </aside>
        </div>
      </div>
    </div>
  </div>

    <!-- Marker Info Modal -->
    <div v-if="selectedMarker" class="marker-modal" @click.self="closeMarker">
      <div class="marker-card" :class="'t-' + (selectedMarker?.type || 'default')">
        <div class="marker-media" v-if="selectedMarker.img">
          <img :src="selectedMarker.img" :alt="selectedMarker.title || selectedMarker.id" />
          <div class="marker-media__fade"></div>
        </div>
        <div class="marker-body">
          <h2 class="marker-title">{{ selectedMarker.title || selectedMarker.id }}</h2>
          <p class="marker-desc" v-if="selectedMarker.description">{{ selectedMarker.description }}</p>
          <a v-if="selectedMarker.moreInfo" :href="selectedMarker.moreInfo" class="marker-link" target="_blank" rel="noopener">More info →</a>
          <div class="marker-meta"><span class="badge">Type: {{ selectedMarker.type }}</span></div>
          <div class="marker-actions">
            <button class="marker-close" @click="closeMarker">Close</button>
          </div>
        </div>
      </div>
    </div>

</template>


<script>
import HeaderBar from './HeaderBar.vue'
import { SHOW_ADMIN } from '../featureFlags'
import { getUsers } from '../api'
import MapView from './MapView.vue'
import MenuButton from './MenuButton.vue'

export default {
  name: "Home",
  components: { HeaderBar, MapView, MenuButton },

  props: {
    loggedIn: Boolean,
    username: String,
    userImage: String
  },

  data() {
    return {
      selectedMarker: null,
      SHOW_ADMIN,
      users: [],
      loading: false,
      error: null,
      markers: [
        {
          id: 'egypt',
          type: 'group',
          title: 'Egypt',
          x: 0.58, y: 0.48,
          items: [
            { id: 'giza',   type: 'site', title: 'Giza Plateau', x: 0.595, y: 0.505, img: '/img/markers/sphinx.jpg',  tip: 'Pyramids & Sphinx' },
            { id: 'luxor',  type: 'site', title: 'Luxor Temple', x: 0.645, y: 0.585, img: '/img/luxor.jpg', tip: 'New Kingdom temple' },
            { id: 'karnak', type: 'site', title: 'Karnak',       x: 0.650, y: 0.575, img: '/img/karnak.jpg', tip: 'Hypostyle Hall' }
          ]
        }
      ]
    }
  },
  
  async mounted() {
    if (!this.SHOW_ADMIN) return   // only fetch if admin
    this.loading = true
    try {
      this.users = await getUsers()
    } catch (e) {
      this.error = (e && e.message) ? e.message : "Failed to load users"
    } finally {
      this.loading = false
    }
  },

  methods: {
    openMarker(m) { this.selectedMarker = m },
    closeMarker() { this.selectedMarker = null },
    handleOpenModal(modalId) {
      alert(`Open modal: ${modalId}`)
    }
  }
}
</script>

<style scoped>
.sidebar {
  background: #f0f0f0;
  padding: 1em;
  width: 200px;
  float: left;
}

.header {
  position: relative;
  z-index: 1000;
}

/* === Modal overlay === */
.marker-modal {
  position: fixed; inset: 0; z-index: 9999;
  display: flex; align-items: center; justify-content: center;
  background: rgba(0,0,0,.45);
  padding: 24px;
}

/* === Card layout: image left, content right === */

/* === Type-based panel theming === */
.marker-card { 
  background: var(--panel-bg, #0d1117); 
  border: 1px solid var(--accent, #22d3ee);
}
.marker-card.t-site     { --accent: #eab308; --panel-bg: #0d1117; }
.marker-card.t-text     { --accent: #14b8a6; --panel-bg: #0b1615; }
.marker-card.t-artifact { --accent: #f97316; --panel-bg: #171008; }
.marker-card.t-region,
.marker-card.t-group    { --accent: #60a5fa; --panel-bg: #0b1220; }

/* Accent usages */
.badge { border: 1px solid var(--accent); }
.marker-link { color: var(--accent); }
.marker-close { background: var(--accent); }

.marker-card {
  position: relative;
  display: grid;
  grid-template-columns: minmax(260px, 40%) 1fr;
  width: min(920px, calc(100% - 32px));
  background: #0d1117; /* soft dark */
  color: #f8fafc;
  border: 1px solid rgba(255,255,255,.08);
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 24px 64px rgba(0,0,0,.5);
}

/* left image panel */
.marker-media {
  position: relative;
  min-height: 240px;
}
.marker-media img {
  position: absolute; inset: 0;
  width: 100%; height: 100%; object-fit: cover;
}
/* fade the image into the body color on the right */
.marker-media__fade {
  position: absolute; top: 0; right: -1px; bottom: 0; left: 45%;
  background: linear-gradient(to right, rgba(13,17,23,0) 0%, #0d1117 75%);
  pointer-events: none;
}

/* right content */
.marker-body { padding: 22px; display: flex; flex-direction: column; gap: 10px; }
.marker-title { margin: 0; font-size: 22px; font-weight: 800; }
.marker-desc  { margin: 2px 0 6px; line-height: 1.5; opacity: .95; }
.marker-link  { text-decoration: underline; opacity: .95; }
.marker-meta  { opacity: .9; }
.badge { padding: 2px 8px; border-radius: 999px; background: rgba(255,255,255,.08); border: 1px solid rgba(255,255,255,.14); }
.marker-actions { margin-top: 6px; }
.marker-close {
  padding: .6rem 1rem; border: 0; border-radius: 10px;
  background: #2563eb; color: #fff; cursor: pointer;
}
.marker-close:hover { filter: brightness(1.05); }

@media (max-width: 700px) {
  .marker-card { grid-template-columns: 1fr; }
  .marker-media { min-height: 180px; }
}

</style>