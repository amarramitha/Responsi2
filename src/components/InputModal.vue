<template>
  <ion-modal :is-open="isOpen" @did-dismiss="cancel">
    <ion-header>
      <ion-toolbar>
        <ion-title>{{ editingId ? 'Edit' : 'Tambah' }} Resep</ion-title>
        <ion-buttons slot="start">
          <ion-button @click="cancel">
            <ion-icon :icon="close"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-item>
        <ion-input
          v-model="resep.name"
          label="Nama Resep"
          label-placement="floating"
          placeholder="Masukkan Nama Resep"
        ></ion-input>
      </ion-item>
      <ion-item>
        <ion-textarea
          v-model="resep.steps"
          label="Langkah-langkah"
          label-placement="floating"
          placeholder="Masukkan Langkah-langkah Memasak"
          :autogrow="true"
          :rows="5"
        ></ion-textarea>
      </ion-item>
      <ion-row>
        <ion-col>
          <ion-button type="button" @click="submitForm" shape="round" color="primary" expand="block">
            {{ editingId ? 'Edit' : 'Tambah' }} Resep
          </ion-button>
        </ion-col>
      </ion-row>
    </ion-content>
  </ion-modal>
</template>

<script setup lang="ts">
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonInput,
  IonRow,
  IonCol,
  IonItem,
  IonContent,
  IonTextarea,
} from '@ionic/vue';
import { close } from 'ionicons/icons';
import { Resep, firestoreService } from '@/utils/firestore';
import { ref, watch } from 'vue';

const props = defineProps<{
  isOpen: boolean;
  editingId: string | null;
  resep: Omit<Resep, 'id' | 'createdAt' | 'updatedAt'>;
}>();

const emit = defineEmits<{
  'update:isOpen': [value: boolean];
  'update:editingId': [value: string | null];
  'submit': [item: Omit<Resep, 'id' | 'createdAt' | 'updatedAt'>];
}>();

// Function to format the steps after the user submits
const formatSteps = () => {
  if (!props.resep || !props.resep.steps) {
    return '';
  }
  
  // Split the steps by line breaks, map through each step, and add numbering
  const stepsArray = props.resep.steps.split('\n').map((step: string, index: number) => `${index + 1}. ${step.trim()}`);
  return stepsArray.join('\n');
};


const cancel = () => {
  emit('update:isOpen', false);
  emit('update:editingId', null);
  resetResep();
};

const submitForm = () => {
  // Format steps only when submitting
  const formattedSteps = formatSteps();
  emit('submit', { ...props.resep, steps: formattedSteps });
  cancel();
};

const resetResep = () => {
  props.resep.name = '';
  props.resep.steps = '';
};

// Watch editingId for changes and fetch resep data if editing
watch(
  () => props.editingId,
  async (newEditingId) => {
    if (newEditingId) {
      try {
        const resep = await firestoreService.getResepById(newEditingId);
        if (resep) {
          props.resep.name = resep.name;
          props.resep.steps = resep.steps; // Use the saved steps
        }
      } catch (error) {
        console.error('Failed to fetch resep data:', error);
      }
    } else {
      resetResep();
    }
  },
  { immediate: true }
);
</script>
