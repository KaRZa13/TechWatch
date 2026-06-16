<template>
  <UDashboardGroup unit="rem">
    <UDashboardSidebar
      id="default"
      v-model:open="open"
      collapsible
      resizable
      class="bg-elevated/25"
      :ui="{ footer: 'lg:border-t lg:border-default' }"
    >
      <template #header="{ collapsed }">
        <UIcon name="i-lucide-radar" class="size-7 shrink-0 text-primary"/>
        <h1 class="text-lg font-semibold tracking-tight">
          {{ collapsed ? '' : 'TechWatch' }}
        </h1>
      </template>

      <template #default="{ collapsed }">
        <span class="text-sm ml-3 text-slate-400">
          {{ collapsed ? '' : 'VUES' }}
        </span>
        <UNavigationMenu
          v-for="(link, index) in links"
          :key="index"
          :collapsed="collapsed"
          :items="link"
          orientation="vertical"
          tooltip
          popover
          :ui="{ linkLeadingIcon: 'size-5'}"
        />
        <span class="text-sm ml-3 text-slate-400">
          {{ collapsed ? '' : 'SOURCES' }}
        </span>
        
        <UModal v-model:open="modalOpen" title="Ajouter une source">
          <UButton
            variant="outline"
            color="neutral"
            label="Ajouter une source"
            icon="i-ri-add-line"
          />
          <template #body>
            <FormNewSource @success="modalOpen = false" />
          </template>
        </UModal>
        <URadioGroup 
          :items="items"
          v-model="selectedSource"
          variant="card"
          indicator="hidden"
          :ui="{ label: 'text-start' }"
        >
          <template #label="{ item }">
            <div class="flex items-center gap-1.5">
              <UIcon :name="item.icon" class="size-5 shrink-0" :style="{ color: item.color }"/>
              <span class="ml-2">
                {{ collapsed ? '' : item.label }}
              </span>
            </div>
          </template>
        </URadioGroup>
        <ULink to="/sources" class="flex justify-center cursor-pointer hover:underline">
          {{ collapsed ? '+' : 'Toutes les sources' }}
        </ULink>
      </template>

      <template #footer="{ collapsed }">
        <AppearanceMenu :collapsed="collapsed"/>
      </template>
    </UDashboardSidebar>
    <slot/>
  </UDashboardGroup>
</template>

<script setup lang="ts">
import type { NavigationMenuItem, RadioGroupItem } from '@nuxt/ui'

interface Source {
  id: number
  name: string
  type: { name: string }
  url: string
  color: string
  created_at: string
}

function checkSourceType(sourceName: string): string {
  switch (sourceName) {
    case 'Flux RSS':
      return 'i-lucide-rss'
    case 'Github':
      return 'i-lucide-github'
    case 'Youtube':
      return 'i-lucide-youtube'
    case 'Feedly':
      return 'i-lucide-feedly'
    default:
      return 'i-lucide-link'
  }
}

const supabase = useSupabaseClient()

const sourcesTable = await supabase.from('source').select(`id, name, type (name), color`).then((response) => {
  if (response.error) {
    console.error('Error fetching sources:', response.error)
    return []
  }

  return response.data.map((source: Source) => ({
    id: source.id,
    label: source.name,
    type: source.type.name,
    color: source.color
  }))
})

const items = ref<RadioGroupItem[]>(sourcesTable.map((source) => ({
  label: source.label,
  value: source.id,
  icon: checkSourceType(source.type),
  color: source.color
})))

const selectedSource = ref<number | null>(null)

const open = ref(false)
const modalOpen = ref(false)
const links = [[{
  label: 'Fil d\'actualité',
  icon: 'i-ri-home-2-line',
  to: '/',
  onSelect: () => {
    open.value = false
  }
}, {
  label: 'Sauvegardés',
  icon: 'i-ri-bookmark-line',
  to: '/saved',
  onSelect: () => {
    open.value = false
  }
}, {
  label: 'Alertes',
  icon: 'i-ri-notification-line',
  to: '/alerts',
  onSelect: () => {
    open.value = false
  }
}
]] satisfies NavigationMenuItem[][]
</script>