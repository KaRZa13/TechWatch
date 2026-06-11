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
        <UIcon name="i-lucide-radar" size="xl" class="text-primary"/>
        <h1 class="text-lg font-semibold tracking-tight">
          TechWatch
        </h1>
      </template>

      <template #default="{ collapsed }">
        <UDashboardSearchButton :collapsed="collapsed" class="bg-transparent ring-default"/>

        <UNavigationMenu
          v-for="(link, index) in links"
          :key="index"
          :collapsed="collapsed"
          :items="link"
          orientation="vertical"
          tooltip
          popover
        />
      </template>

      <template #footer="{ collapsed }">
        <AppearanceMenu :collapsed="collapsed"/>
      </template>
    </UDashboardSidebar>
    <slot/>
  </UDashboardGroup>
</template>

<script setup lang="ts">
import type {NavigationMenuItem} from '@nuxt/ui'

const open = ref(false)

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