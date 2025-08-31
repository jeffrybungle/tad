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
    <div v-if="selectedMarker" class="marker-modal" @click.self="closeMarker"
         :style="{ backgroundImage: selectedMarker?.img ? `linear-gradient(rgba(0,0,0,.45), rgba(0,0,0,.45)), url(${selectedMarker.img})` : 'none' }">
      <div class="marker-modal__content">
        <h2 class="marker-modal__title">{{ selectedMarker.title || selectedMarker.id }}</h2>
        <p class="marker-modal__desc" v-if="selectedMarker.description">{{ selectedMarker.description }}</p>
        <a v-if="selectedMarker.moreInfo" :href="selectedMarker.moreInfo" class="marker-modal__link" target="_blank" rel="noopener">More info →</a>
        <div class="marker-modal__meta"><span class="badge">Type: {{ selectedMarker.type }}</span></div>
        <button class="marker-modal__close" @click="closeMarker">Close</button>
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
            { id: 'luxor',  type: 'site', title: 'Luxor Temple', x: 0.645, y: 0.585, img: '/img/map.jpg', tip: 'New Kingdom temple' },
            { id: 'karnak', type: 'site', title: 'Karnak',       x: 0.650, y: 0.575, img: '/img/map.jpg', tip: 'Hypostyle Hall' }
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

.marker-modal {
  position: fixed; inset: 0; z-index: 9999;
  display: flex; align-items: center; justify-content: center;
  background-size: cover; background-position: center; background-repeat: no-repeat;
}
.marker-modal__content {
  position: relative;
  max-width: 720px; width: calc(100% - 2rem);
  background: rgba(10, 12, 16, 0.92);
  border: 1px solid rgba(255,255,255,.08);
  border-radius: 16px; padding: 24px;
  box-shadow: 0 20px 60px rgba(0,0,0,.4);
  color: #f8fafc; z-index: 1;
}
.marker-modal__title { margin: 0 0 .5rem; font-size: 1.5rem; font-weight: 700; }
.marker-modal__desc  { margin: 0 0 .75rem; line-height: 1.5; opacity: .95; }
.marker-modal__link  { display: inline-block; margin-bottom: .5rem; text-decoration: underline; }
.marker-modal__meta  { margin-top: .25rem; opacity: .9; }
.badge { padding: 2px 8px; border-radius: 999px; background: rgba(255,255,255,.08); border: 1px solid rgba(255,255,255,.14); }
.marker-modal__close {
  margin-top: 1rem; padding: .6rem 1rem; border: 0; border-radius: 10px;
  background: #2563eb; color: #fff; cursor: pointer;
}
.marker-modal__close:hover { filter: brightness(1.05); }

</style>