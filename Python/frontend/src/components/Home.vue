<template>
  <div>
    <HeaderBar
      :loggedIn="loggedIn"
      :username="username"
      :userImage="userImage"
      @openModal="handleOpenModal"
    />

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
</template>

<script>
import HeaderBar from './HeaderBar.vue'

export default {
  name: "Home",
  components: {
    HeaderBar
  },
  props: {
    loggedIn: Boolean,
    username: String,
    userImage: String
  },
  methods: {
    handleOpenModal(modalId) {
      alert(`Open modal: ${modalId}`);
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
