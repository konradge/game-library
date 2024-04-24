<template>
  <v-card>
    <v-card-title>{{ game.name }}</v-card-title>
    <v-card-text>
      <iframe style="border: 0" :src="game.image"></iframe><br />
      <div v-if="game.author">Author: {{ game.author.join(', ') }}</div>
      <div v-if="game.year">Year: {{ game.year.join(', ') }}</div>
      <div v-if="game.publisher">Publisher: {{ game.publisher.join(', ') }}</div>
      <div v-if="game.type">Type: {{ game.type }}</div>
      <div v-if="game.location">Location: {{ game.location }}</div>
      <div v-if="game.furtherInformation">Further Information: {{ game.furtherInformation }}</div>
      <div v-if="game.playerCount && Number.isInteger(game.playerCount)">
        Player Count: {{ game.playerCount }}
      </div>
      <div v-else-if="game.playerCount && Array.isArray(game.playerCount)">
        Player Count: {{ game.playerCount[0] }} - {{ game.playerCount[1] }}
      </div>
    </v-card-text>
  </v-card>
</template>
<script setup lang="ts">
import type { Game } from '@/interfaces/parse'
import { parseGames } from '@/interfaces/parse'
import { onMounted } from 'vue'
defineProps<{
  game: Game
}>()

onMounted(() => {
  parseGames()
})
</script>
