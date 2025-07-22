<script setup>
import { onMounted, ref } from 'vue'
import { supabase } from '../lib/supabase'
const products = ref([])
const game = new URLSearchParams(window.location.search).get('game')

onMounted(async () => {
  const { data } = await supabase.from('products').select().eq('game', game).eq('active', true)
  products.value = data
})
</script>

<template>
  <h2>{{ game }} Packages</h2>
  <div v-for="p in products" :key="p.id">
    <p>{{ p.credits }} {{ p.currency }} — RM{{ p.price_rm }}</p>
    <a :href="`/Order.html?product_id=${p.id}`">Buy Now</a>
  </div>
</template>
