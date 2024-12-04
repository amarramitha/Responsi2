<template>
    <ion-modal :is-open="isModalOpen" @did-dismiss="closeModal">
      <ion-header>
        <!-- Custom Back Button to close modal -->
        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-button @click="closeModal">
              <ion-icon :icon="close"></ion-icon>
            </ion-button>
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
            <!-- Directly render steps as plain text without any extra formatting -->
            <p>{{ resep.steps }}</p>
          </ion-card-content>
        </ion-card>
      </ion-content>
    </ion-modal>
  </template>
  
  <script setup lang="ts">
  import { onMounted, ref } from 'vue';
  import { useRoute } from 'vue-router';
  import { firestoreService, type Resep } from '@/utils/firestore';
  import { close } from 'ionicons/icons'; // Using close icon for custom back button
  
  const route = useRoute();
  const resep = ref<Resep | null>(null);
  
  // Control the modal open/close state
  const isModalOpen = ref(false);
  
  // Fetch the recipe data based on the route parameter
  onMounted(async () => {
    const id = route.params.id as string;
    resep.value = await firestoreService.getResepById(id);
    isModalOpen.value = true; // Open the modal when data is loaded
  });
  
  // Method to close the modal
  const closeModal = () => {
    isModalOpen.value = false;
  };
  </script>
  