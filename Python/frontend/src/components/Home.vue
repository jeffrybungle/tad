<template>
  <div>
    <HeaderBar
      :loggedIn="false"
      username=""
      userImage=""
      @openModal="handleOpenModal"
    />

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
        <aside v-if="SHOW_ADMIN" class="sidebar" id="admin-controls">
          <!-- (hidden when SHOW_ADMIN=false) -->
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
</template>

<script>
import HeaderBar from './HeaderBar.vue'
import { SHOW_ADMIN } from '../featureFlags'
import { getUsers } from '../api'

export default {
  name: "Home",
  components: { HeaderBar },

  props: {
    loggedIn: Boolean,
    username: String,
    userImage: String
  },

  data() {
    return {
      users: [],
      loading: false,
      error: null,
      SHOW_ADMIN
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
</style>
