<template>
  <UDashboardPanel id="saved">
    <template #header>
      <UDashboardNavbar title="Sauvegardés" :ui="{ right: 'gap-3' }">
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
      <section class="w-full h-full flex justify-center p-2 gap-8">
        <div class="w-2/3 flex flex-col px-48 py-4 space-y-4">
          <p v-if="articles.length === 0" class="text-sm text-muted text-center py-12">
            Aucun article sauvegardé.
          </p>
          <FeedArticle
            v-for="article in articles"
            :key="article.id"
            :article="article"
          />
        </div>
      </section>
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
import type { Article } from '~/components/FeedArticle.vue'

const isLoading = ref(false)
const supabase = useSupabaseClient()

const { data } = await supabase.from('saved').select('*').order('published_at', { ascending: false })

const articles = (data ?? []).map((item: Record<string, string>) => ({
  id: item.id,
  type: item.type as Article['type'],
  title: item.title,
  description: item.description,
  url: item.url,
  thumbnail: item.thumbnail,
  publishedAt: item.published_at,
  source: item.source
})) as Article[]

async function refresh() {
  isLoading.value = true
  await new Promise(resolve => setTimeout(resolve, 2000))
  isLoading.value = false
}
</script>
