<template>
  <div id="header-bar">
    <span id="site-title">The Atlantis Debate</span>
    <button class="header-button" @click="$emit('openModal', 'topEvidence')">Top Evidence</button>
    <button class="header-button" @click="$emit('openModal', 'news')">News</button>
    <button class="header-button" @click="$emit('openModal', 'queries')">Queries</button>
    <button class="header-button" @click="$emit('openModal', 'amendments')">Amendments</button>
    <button class="header-button" @click="$emit('openModal', 'platoTexts')">Plato Texts</button>
    <button class="header-button" @click="$emit('openModal', 'about')">About</button>
    <span id="user-controls">
      <button v-if="!loggedIn" @click="$emit('openModal', 'login')">Login</button>
      <button v-if="!loggedIn" @click="$emit('openModal', 'register')">Register</button>
      <template v-else>
        <img v-if="userImage && userImage.length > 0" :src="userImage" alt="User" class="avatar" />
        <span class="username">{{ username }}</span>
        <button @click="$emit('openModal', 'account')">Account</button>
      </template>
    </span>
  </div>
</template>

<script setup>
defineProps({
  loggedIn: Boolean,
  username: String,
  userImage: String
})
</script>

<style scoped>
#header-bar {
  display: flex;
  align-items: center;
  padding: 0.5em 1em;
  background: #1a2633;
  color: #fff;
  gap: 1em;
}
#site-title {
  font-weight: bold;
  font-size: 1.4em;
  margin-right: 2em;
}
.header-button {
  background: none;
  border: none;
  color: #fff;
  margin: 0 0.2em;
  padding: 0.5em 1em;
  cursor: pointer;
  font-size: 1em;
  border-radius: 2px;
  transition: background 0.2s;
}
.header-button:hover {
  background: #22304a;
}
#user-controls {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 0.4em;
}
.avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 0.3em;
}
.username {
  font-weight: 500;
  margin-right: 0.5em;
}
</style>
