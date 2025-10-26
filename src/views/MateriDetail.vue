<template>
  <div>
    <h2>📖 Materi Detail untuk {{ $route.params.planet }}</h2>
    <router-link to="/materi">⬅️ Kembali ke Materi</router-link>
  </div>
</template>

<script>
export default {
  name: "MateriDetailPage"
}
</script>
