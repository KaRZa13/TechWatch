<template>
  <UForm 
    :schema="schemaNewSource" 
    :state="state"
    class="flex flex-col gap-4"
    @submit="handleSubmit"
    
  >
    <UFormField name="name" label="Nom de la source">
      <UInput v-model="state.name" class="w-full" placeholder="Entrez le nom de la source" />
    </UFormField>

    <UFormField name="type" label="Type de source">
      <USelect 
        class="w-full" 
        :items="sourceTypes.data?.map((t) => ({ label: t.name, value: t.id }))"
        v-model="state.type"
        label="Type de source" 
        placeholder="Sélectionnez un type de source" />
    </UFormField>

    <UFormField name="url" label="URL de la source">
      <UInput v-model="state.url" class="w-full" placeholder="Entrez l'URL de la source" />
    </UFormField>

    <UFormField name="color" label="Couleur de la source">
      <USelect v-model="state.color" class="w-full" :items="sourceColors" placeholder="Sélectionnez une couleur">
        <template #leading="{ modelValue }">
          <span v-if="modelValue" class="rounded-full ring ring-bg size-2 ml-1 bg-(--chip-light) dark:bg-(--chip-dark)"
            :style="{
              '--chip-light': `var(--color-${getChipColor(modelValue)}-500)`,
              '--chip-dark': `var(--color-${getChipColor(modelValue)}-400)`
            }" />
        </template>

        <template #item-leading="{ item }">
          <div class="inline-flex items-center justify-center shrink-0 size-5">
            <span class="rounded-full ring ring-bg size-2 bg-(--chip-light) dark:bg-(--chip-dark)" :style="{
              '--chip-light': `var(--color-${(item as any).label}-500)`,
              '--chip-dark': `var(--color-${(item as any).label}-400)`
            }" />
          </div>
        </template>
      </USelect>
    </UFormField>

    <UButton type="submit" variant="solid" color="primary" label="Ajouter la source" class="mt-4 justify-center cursor-pointer" />
  </UForm>
  <UButton @click="logState" variant="outline" color="neutral" label="Log State" class="mt-2 justify-center cursor-pointer" />
</template>

<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

interface SourceType {
  id: number
  name: string
  created_at: string
}

const emit = defineEmits<{ success: [] }>()

const supabase = useSupabaseClient()
const sourceTypes: { data: SourceType[] | null } = await supabase.from('source_type').select('*')
const toast = useToast()

const schemaNewSource = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  type: z.number().int('Le type doit être un entier'),
  color: z.string().min(1, 'La couleur est requise'),
  url: z.url('L\'URL doit être valide')
})

type NewSource = z.output<typeof schemaNewSource>

const initialState = (): NewSource => ({
  name: '',
  type: sourceTypes.data?.[0]?.id || 1,
  color: '#FF6467',
  url: ''
})

const state = reactive<NewSource>(initialState())

function getChipColor(value: string | number | bigint | true) {
  return sourceColors.value.find(i => i.value === value)?.label
}

async function handleSubmit(event: FormSubmitEvent<NewSource>) {
  const { data, error } = await supabase.from('source').insert([event.data as never]).select()
  
  if (error) {
    console.error(error)
    toast.add({ title: 'Erreur', description: 'Une erreur est survenue lors de l\'ajout de la source.' })
    return
  }
  Object.assign(state, initialState())
  toast.add({ title: 'Succès', description: 'La source a été ajoutée avec succès.' })
  emit('success')
}

function logState() {
  console.log('Current state:', state)
}

const sourceColors = ref([
  {
    label: 'red',
    value: '#FF6467',
  },
  {
    label: 'orange',
    value: '#FF8904',
  },
  {
    label: 'yellow',
    value: '#FDC700',
  },
  {
    label: 'lime',
    value: '#9AE600',
  },
  {
    label: 'green',
    value: '#05DF72',
  },
  {
    label: 'cyan',
    value: '#00D3F2',
  },
  {
    label: 'blue',
    value: '#51A2FF',
  },
  {
    label: 'purple',
    value: '#C27AFF',
  },
  {
    label: 'pink',
    value: '#FB64B6',
  }
])
</script>