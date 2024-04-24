<template>
  <div>
    <v-text-field v-model="search" label="Spiel suchen..." append-inner-icon="mdi-magnify">
    </v-text-field>
    <v-data-table :headers="headers" :items="filteredGames" @click:row="onDataTableClicked">
      <template v-slot:item.author="{ item }">
        <div v-if="item.author">{{ item.author.join(',') }}</div>
      </template>
      <template #item.playerCount="{ item }">
        <div v-if="item.playerCount && Array.isArray(item.playerCount)">
          {{ item.playerCount[0] }} - {{ item.playerCount[1] }}
        </div>
        <div v-else-if="item.playerCount">
          {{ item.playerCount }}
        </div>
      </template>
    </v-data-table>
    <v-dialog v-model="gameSelected" width="auto">
      <GameOverview v-if="selectedGame" :game="selectedGame" />
    </v-dialog>
    <!-- <div v-for="game in filteredGames" :key="game.name" @click="selectedGame = game">
      {{ game.name }}
    </div> -->
  </div>
</template>
<script setup lang="ts">
import type { Game } from '@/interfaces/parse'
import { parseGames } from '@/interfaces/parse'
import { onMounted } from 'vue'
import { watch } from 'vue'
import { ref } from 'vue'
import GameOverview from './GameOverview.vue'
import { computed } from 'vue'

const headers = [
  { title: 'Name', key: 'name' },
  { title: 'Autor', key: 'author' },
  { title: 'Spieleranzahl', key: 'playerCount' },
  { title: 'Ort', key: 'location' }
]

const allGames = ref<Game[]>([])
const filteredGames = ref<Game[]>([])

const selectedGame = ref<Game | null>(null)

onMounted(async () => {
  allGames.value = await parseGames()
})

const search = ref('')

function onDataTableClicked(_: unknown, { item }: { item: Game }) {
  selectedGame.value = item
  console.log(item)
}

const gameSelected = computed({
  get: () => selectedGame.value !== null,
  set: (value: boolean) => {
    if (!value) {
      selectedGame.value = null
    }
  }
})

watch(search, (newValue) => {
  selectedGame.value = null
  if (newValue.length === 0) {
    filteredGames.value = allGames.value
  } else {
    filteredGames.value = allGames.value.filter((game) => {
      return game.name.toLowerCase().includes(newValue.toLowerCase())
    })
  }
})

watch(allGames, (newValue) => {
  filteredGames.value = newValue
})
</script>
