<template>
  <UCard :ui="{ body: 'p-0' }" class="overflow-hidden">
    <!-- YouTube embed -->
    <div v-if="article.type === 'youtube'" class="aspect-video">
      <iframe
        :src="youtubeEmbedUrl"
        class="w-full h-full rounded-lg"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen
      />
    </div>

    <!-- RSS thumbnail -->
    <div v-else-if="article.thumbnail" class="aspect-video overflow-hidden bg-muted">
      <img :src="article.thumbnail" :alt="article.title" class="w-full h-full object-cover" />
    </div>

    <!-- Content -->
    <div class="p-4 flex flex-col gap-3">
      <div class="flex items-center gap-2 flex-wrap">
        <UBadge
          v-if="article.type === 'youtube'"
          label="YouTube"
          color="error"
          variant="soft"
          size="sm"
          icon="i-lucide-play-circle"
        />
        <UBadge
          v-else
          label="RSS"
          color="primary"
          variant="soft"
          size="sm"
          icon="i-lucide-rss"
        />
        <UBadge
          v-if="article.source"
          :label="article.source"
          color="neutral"
          variant="outline"
          size="sm"
        />
        <span v-if="article.publishedAt" class="text-xs text-muted ml-auto">
          {{ formattedDate }}
        </span>
      </div>

      <div>
        <h3 class="font-semibold text-highlighted line-clamp-2 leading-snug">
          <a :href="article.url" target="_blank" rel="noopener noreferrer" class="hover:underline">
            {{ article.title }}
          </a>
        </h3>
        <p v-if="article.description" class="text-sm text-muted line-clamp-3 mt-1">
          {{ article.description }}
        </p>
      </div>

      <div class="flex gap-2">
        <UButton
          :icon="isSaved ? 'i-lucide-bookmark-check' : 'i-lucide-bookmark'"
          :color="isSaved ? 'success' : 'neutral'"
          variant="outline"
          size="sm"
          :label="isSaved ? 'Sauvegardé' : 'Sauvegarder'"
          @click="save"
        />
        <UButton
          v-if="article.type === 'Flux RSS'"
          icon="i-lucide-sparkles"
          color="primary"
          variant="soft"
          size="sm"
          label="Résumer avec l'IA"
          :loading="isSummarizing"
          @click="summarize"
        />
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
export interface Article {
  id: string
  type: 'youtube' | 'Flux RSS'
  title: string
  description?: string
  url: string
  thumbnail?: string
  publishedAt?: string
  source?: string
}

const props = defineProps<{ article: Article }>()

const toast = useToast()
const isSaved = ref(false)
const isSummarizing = ref(false)

const youtubeVideoId = computed(() => {
  const match = props.article.url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)
  return match?.[1] ?? ''
})

const youtubeEmbedUrl = computed(() =>
  `https://www.youtube.com/embed/${youtubeVideoId.value}`
)

const formattedDate = computed(() => {
  if (!props.article.publishedAt) return ''
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(new Date(props.article.publishedAt))
})

async function save() {
  // TODO: persist to Supabase
  isSaved.value = true
  toast.add({
    title: 'Article sauvegardé',
    description: `"${props.article.title}" ajouté à vos favoris.`,
    color: 'success',
    icon: 'i-lucide-bookmark-check'
  })
}

async function summarize() {
  isSummarizing.value = true
  try {
    // TODO: call AI summarization API
    await new Promise(resolve => setTimeout(resolve, 1500))
    toast.add({
      title: 'Résumé généré',
      description: 'Le résumé de l\'article sera bientôt disponible.',
      color: 'info',
      icon: 'i-lucide-sparkles'
    })
  } finally {
    isSummarizing.value = false
  }
}
</script>
