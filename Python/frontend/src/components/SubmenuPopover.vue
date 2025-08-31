<template>
  <div class="popover" :style="{ left: x + 'px', top: y + 'px' }">
    <h4 class="title">{{ title }}</h4>
    <ul class="list">
      <li v-for="item in items" :key="item.id" @click.stop="$emit('select', item)">
        <img class="thumb" :src="item.img" :alt="item.title" />
        <div class="meta">
          <div class="name">{{ item.title }}</div>
          <div class="tip" v-if="item.tip">{{ item.tip }}</div>
        </div>
      </li>
    </ul>
    <button class="close" @click.stop="$emit('close')">✕</button>
  </div>
</template>

<script>
export default {
  name: 'SubmenuPopover',
  props: {
    x: { type: Number, required: true }, // viewport coords (px)
    y: { type: Number, required: true },
    title: { type: String, default: '' },
    items: { type: Array, default: () => [] }
  }
}
</script>

<style scoped>
.popover {
  position: absolute;
  transform: translate(12px, -8px); /* offset from marker */
  width: 260px;
  max-height: 60vh;
  overflow: auto;
  background: rgba(20, 20, 20, 0.92);
  color: #fff;
  border: 1px solid rgba(255,255,255,.08);
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0,0,0,.45);
  padding: 10px 10px 6px;
  z-index: 6000;
}

.title { margin: 4px 6px 8px; font-size: 14px; letter-spacing: .3px; opacity: .9; }

.list { list-style: none; margin: 0; padding: 0; }
.list li {
  display: grid; grid-template-columns: 56px 1fr; gap: 10px;
  align-items: center; padding: 8px; border-radius: 8px; cursor: pointer;
}
.list li:hover { background: rgba(255,255,255,.06); }

.thumb { width: 56px; height: 56px; object-fit: cover; border-radius: 6px; }
.meta .name { font-weight: 600; font-size: 13px; }
.meta .tip  { font-size: 12px; opacity: .8; }

.close {
  position: absolute; top: 6px; right: 6px;
  width: 26px; height: 26px; border: 0; border-radius: 50%;
  background: rgba(255,255,255,.08); color: #fff; cursor: pointer;
}
.close:hover { background: rgba(255,255,255,.18); }
</style>
