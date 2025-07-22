<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../lib/supabase'

const games = ref([])

onMounted(async () => {
  const { data, error } = await supabase.from('products').select('game').neq('active', false)
  games.value = [...new Set(data.map(p => p.game))]
})
</script>

<template>
  <div>
    <h2>Available Games</h2>
    <ul>
      <li v-for="g in games" :key="g">
        <a :href="`/Game?game=${g}`">{{ g }}</a>
      </li>
    </ul>
  </div>
</template>
