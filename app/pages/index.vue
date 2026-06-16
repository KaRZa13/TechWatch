<template>
  <UDashboardPanel id="home">
    <template #header>
      <UDashboardNavbar title="Fils d'actualités" :ui="{ right: 'gap-3' }">
        <template #leading>
          <UDashboardSidebarCollapse/>
        </template>

        <template #right>
          <UDashboardSearchButton :kbds="['alt', 'k']" label="Rechercher..."/>

          <UButton
            icon="i-lucide-refresh-ccw"
            variant="outline"
            color="neutral"
            :ui="{ leadingIcon: isLoading ? 'animate-spin [animation-direction:reverse]' : '' }"
            @click="refresh"
          />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <section class="w-full h-full flex p-2 gap-8">
        <!-- RSS -->
        <div class="w-1/2 h-full rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-y-auto">
          <div class="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-800 sticky top-0 bg-(--ui-bg)">
            <h2 class="text-lg font-semibold">Flux RSS</h2>
            <UBadge
              v-if="rssSources.length > 0"
              :label="rssSources.length + ' sources'"
              color="primary"
              variant="soft"
              size="sm"
            />
          </div>
          <div class="flex flex-col px-48 py-4 space-y-4">
            <FeedArticle
              v-for="(article, index) in rssArticles"
              :key="index"
              :article="article"
            />
          </div>
        </div>
        
        <!-- YouTube -->
        <div class="w-1/2 h-full flex flex-col rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-y-auto">
          <div class="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-800 sticky top-0 bg-(--ui-bg)">
            <h2 class="text-lg font-semibold">YouTube</h2>
            <UBadge
              v-if="youtubeSources.length > 0"
              :label="youtubeSources.length + ' sources'"
              color="primary"
              variant="soft"
              size="sm"
            />
          </div>
          <div class="flex flex-col px-48 py-4 space-y-4 ">
            <FeedArticle
              v-for="(video, index) in videos"
              :key="index"
              :article="video"
            />
          </div>
        </div>
      </section>
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
import type { Article } from '~/components/FeedArticle.vue'
import type { Source } from '~/types'
const supabase = useSupabaseClient()
const isLoading = ref(false)

const sourcesTable = await supabase.from('source').select(`id, name, type (name), color, url`).then((response) => {
  if (response.error) {
    console.error('Error fetching sources:', response.error)
    return []
  }

  return response.data.map((source: Source) => ({
    id: source.id,
    label: source.name,
    type: source.type.name,
    color: source.color,
    url: source.url
  }))
})

const youtubeSources = sourcesTable.filter(source => source.type === 'Youtube')
const rssSources = sourcesTable.filter(source => source.type === 'Flux RSS')

const videos = ((await Promise.all(
  youtubeSources.map(source => $fetch('/api/youtube/channel', { query: { url: source.url } }))
)).flat() as Article[]).sort((a, b) => {
  if (!a.publishedAt) return 1
  if (!b.publishedAt) return -1
  return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
})

const rssArticles = ((await Promise.all(
  rssSources.map(source => $fetch<Article[]>('/api/rss/rss', { query: { url: source.url } }))
)).flat()).sort((a, b) => {
  if (!a.publishedAt) return 1
  if (!b.publishedAt) return -1
  return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
})

onMounted(() => {
  console.log('YouTube videos:', videos)
  console.log('RSS articles:', rssArticles)
})

async function refresh() {
  isLoading.value = true
  await new Promise(resolve => setTimeout(resolve, 2000))
  isLoading.value = false
}
</script>
