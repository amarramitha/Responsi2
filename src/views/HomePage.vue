<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Resep</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <!-- Pull-to-refresh functionality -->
      <ion-refresher slot="fixed" @ionRefresh="handleRefresh">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>

      <!-- Floating action button to add a new recipe -->
      <ion-fab vertical="bottom" horizontal="end" slot="fixed">
        <ion-fab-button @click="openAddModal">
          <ion-icon :icon="add"></ion-icon>
        </ion-fab-button>
      </ion-fab>

      <!-- Input Modal for adding or editing a recipe -->
      <InputModal 
        v-model:isOpen="isOpen" 
        v-model:editingId="editingId" 
        :resep="resep" 
        @submit="handleSubmit" 
      />

      <!-- Modal for displaying recipe details -->
      <ion-modal :is-open="isModalOpen" @did-dismiss="closeModal">
        <ion-header>
          <ion-toolbar>
            <ion-buttons slot="start">
              <ion-button @click="closeModal">
                <ion-icon :icon="close"></ion-icon>
              </ion-button>
            </ion-buttons>
            <ion-title>{{ selectedResep?.name }}</ion-title>
          </ion-toolbar>
        </ion-header>

        <ion-content>
          <ion-card v-if="selectedResep">
            <ion-card-header>
              <ion-card-title>{{ selectedResep.name }}</ion-card-title>
            </ion-card-header>
            <ion-card-content>
              <div v-html="formattedSteps"></div>
            </ion-card-content>
          </ion-card>
        </ion-content>
      </ion-modal>

      <!-- Recipe List -->
      <ion-list>
        <ion-item-sliding v-for="resep in reseps" :key="resep.id">
          <ion-item button @click="goToDetail(resep)">
            <ion-label>
              <h2>{{ resep.name }}</h2>
              <!-- Display formatted steps with line breaks -->
              <div v-html="formattedStepsForList(resep)"></div>
            </ion-label>
          </ion-item>

          <!-- Options for each recipe -->
          <ion-item-options side="start">
            <ion-item-option color="danger" @click="handleDelete(resep)">
              <ion-icon :icon="trash"></ion-icon>
            </ion-item-option>
          </ion-item-options>

          <ion-item-options side="end">
            <ion-item-option @click="handleEdit(resep)">
              <ion-icon :icon="create"></ion-icon>
            </ion-item-option>
          </ion-item-options>
        </ion-item-sliding>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonRefresher, IonRefresherContent, IonFab, IonFabButton, IonIcon, IonList, IonItem, IonItemSliding, IonItemOption, IonItemOptions, IonLabel, IonModal, IonButton } from '@ionic/vue';
import { add, create, trash, close } from 'ionicons/icons';
import InputModal from '@/components/InputModal.vue';
import { onMounted, ref, computed } from 'vue';
import { firestoreService, type Resep } from '@/utils/firestore';
import { useRouter } from 'vue-router';

const isOpen = ref(false);
const editingId = ref<string | null>(null);
const resep = ref<Omit<Resep, 'id' | 'createdAt' | 'updatedAt'>>({ name: '', steps: '' });
const reseps = ref<Resep[]>([]);
const router = useRouter();

// Modal for recipe details
const isModalOpen = ref(false);
const selectedResep = ref<Resep | null>(null);

// Load recipes on page mount
const loadReseps = async () => {
  reseps.value = await firestoreService.getResepList();
};

onMounted(() => {
  loadReseps();
});

// Handle refresh event
const handleRefresh = async (event: any) => {
  await loadReseps();
  event.target.complete();
};

// Open modal to show recipe details
const goToDetail = (resep: Resep) => {
  selectedResep.value = resep;
  isModalOpen.value = true;
};

// Close the modal
const closeModal = () => {
  isModalOpen.value = false;
  selectedResep.value = null;
};

// Handle adding or updating a recipe
const handleSubmit = async (resepData: Omit<Resep, 'id' | 'createdAt' | 'updatedAt'>) => {
  if (editingId.value) {
    await firestoreService.updateResep(editingId.value, resepData);
  } else {
    await firestoreService.addResep(resepData);
  }
  loadReseps();
  isOpen.value = false;
};

// Open modal for editing a recipe
const handleEdit = (resep: Resep) => {
  editingId.value = resep.id!;
  Object.assign(resep, { ...resep });
  isOpen.value = true;
};

// Handle deleting a recipe
const handleDelete = async (resep: Resep) => {
  await firestoreService.deleteResep(resep.id!);
  loadReseps();
};

// Open modal to add a new recipe
const openAddModal = () => {
  editingId.value = null;
  resep.value = { name: '', steps: '' };
  isOpen.value = true;
};

// Format steps with line breaks and numbering for details
const formattedSteps = computed(() => {
  if (!selectedResep.value?.steps) return '';
  return selectedResep.value.steps
    .split('\n') // Split by newline
    .map((step, index) => `${index + 1}. ${step}`) // Add numbering
    .join('<br />'); // Join steps with <br /> for line breaks
});

// Format steps for the list view, no numbering for brevity
const formattedStepsForList = (resep: Resep) => {
  if (!resep.steps) return '';
  return resep.steps
    .split('\n') // Split by newline
    .map((step) => `${step}`) // Plain steps
    .join('<br />'); // Join steps with <br /> for line breaks
};
</script>
