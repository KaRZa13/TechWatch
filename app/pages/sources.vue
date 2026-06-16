<template>
  <UDashboardPanel id="sources">
    <template #header>
      <UDashboardNavbar title="Toutes les sources" :ui="{ right: 'gap-3' }">
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

      <UDashboardToolbar>
          <template #left>
            
          </template>
      </UDashboardToolbar>

    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
const isLoading = ref(false)

async function refresh() {
  isLoading.value = true
  await new Promise(resolve => setTimeout(resolve, 2000))
  isLoading.value = false
}

</script>