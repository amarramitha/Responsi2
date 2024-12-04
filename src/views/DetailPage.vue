<template>
    <ion-page>
      <ion-header>
        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-back-button></ion-back-button>
          </ion-buttons>
          <ion-title>{{ resep?.name }}</ion-title>
        </ion-toolbar>
      </ion-header>
  
      <ion-content>
        <ion-card v-if="resep">
          <ion-card-header>
            <ion-card-title>{{ resep.name }}</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <!-- Use v-html to render formatted steps (with line breaks preserved) -->
            <p v-html="formattedSteps"></p>
          </ion-card-content>
        </ion-card>
      </ion-content>
    </ion-page>
  </template>
  
  <script setup lang="ts">
  import { onMounted, ref, computed } from 'vue';
  import { useRoute } from 'vue-router';
  import { firestoreService, type Resep } from '@/utils/firestore';
  
  const route = useRoute();
  const resep = ref<Resep | null>(null);
  
  // Fetch the recipe data based on the route parameter
  onMounted(async () => {
    const id = route.params.id as string;
    resep.value = await firestoreService.getResepById(id);
  });
  
  // Computed property to format the steps, ensuring line breaks are preserved
  const formattedSteps = computed(() => {
    if (!resep.value?.steps) {
      return '';
    }
    // Replace newline characters with <br /> tags to preserve line breaks
    return resep.value.steps.replace(/\n/g, '<br />');
  });
  </script>
  