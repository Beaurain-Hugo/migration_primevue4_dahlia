<template>
  <div class="btn-top-association">
    <PButton label="Nouvelle association" icon="pi pi-plus" iconPos="right" @click="showDialog = true" />
  </div>
  <div class="container mt-4" v-if="!isLoading">
    <div class="grid-container">
      <div class="grid-item" v-for="association in associationListe" :key="association.association_id">
         <Card style="width: 100%; overflow: hidden; height: 100%">
          <template #header>
            <div class="flex align-items-center gap-4 p-3">
              <img v-if="association.logo" :src="'data:image/png;base64,' + association.logo" alt="Tournament Logo"
                style="width: 40px;border-radius: 8px;" />
              <h2 style="margin: 0; font-size: 1.5rem; color: #333; font-weight: bold;">
                {{ association.nom }}
              </h2>
            </div>
          </template>
          <template #subtitle>
            <span style="font-size: 0.9rem; color: #666;">{{ association.date_pub_jo }}</span>
          </template>
          <template #content>
            <p style="font-size: 1rem; color: #555; line-height: 1.5; margin: 10px 0;">
              {{ association.description.slice(0, 200) + '...' }}
            </p>
          </template>
          <template #footer>
            <div class="flex justify-content-end p-3">
              <PButton @click="assoDetail(association.association_id)" label="En savoir plus" severity="secondary"
                outlined style="font-size: 0.9rem; padding: 0.5rem 1rem; border-radius: 5px" />
            </div>
          </template>
        </Card>
      </div>
    </div>
    <!-- Dialog for creating new association -->
    <PDialog v-model:visible="showDialog" class="flex-1 mx-5 md:flex-none custom-dialog" header="Nouvelle association" @hide="resetDialog">
      <Steps :model="steps" v-model:activeStep="active" />
      <!-- Step 1: Basic information -->
      <div v-if="active === 0">
        <div class="flex-1 flex flex-column gap-2 mt-3">
          <h2>Nouvelle association</h2>
          <p>Toutes les données peuvent être modifiées ultérieurement.</p>
        </div>
        <div class="flex-1 flex flex-column gap-2 mt-3">
          <label for="newAssociation.numero_rna">Numéro SIREN ou RNA</label>
          <InputText v-model="newAssociation.numero_rna" id="newAssociation.numero_rna" placeholder="Entrez le SIREN ou RNA" @blur="fetchAssociationData" />
        </div>
        <!-- Automatically fill in association data after fetching -->
        <div v-if="associationData" class="flex-1 flex flex-column gap-2 mt-3">
          <label for="associationName">Nom de l'association</label>
          <InputText v-model="newAssociation.nom" id="associationName" :disabled="false" />
          <label for="associationLogo">Logo de l'association</label>
          <FileUpload
            v-model="newAssociation.logo"
            :multiple="false"
            accept="image/*"
            :maxFileSize="1000000000000"
            @select="onSelectedFile($event)"
          />
          <label for="associationDescription">Description</label>
          <InputText v-model="newAssociation.description" id="associationDescription" :disabled="false" />
          <label for="associationEmail">Email</label>
          <InputText v-model="newAssociation.email" id="associationEmail" :disabled="false" />
          <label for="associationTelephone">Téléphone</label>
          <InputText v-model="newAssociation.telephone" id="associationTelephone" :disabled="false" />
          <label for="associationPageWeb">Page web</label>
          <InputText v-model="newAssociation.page_web_url" id="associationPageWeb" :disabled="false" />
          <label for="associationDatePubJO">Date de publication JO</label>
          <InputText v-model="newAssociation.date_pub_jo" id="associationDatePubJO" :disabled="true" />
          <label for="adresse">Adresse</label>
          <InputText v-model="newAssociation.adresse" id="adresse" :disabled="true" />
          <label for="code_postal">Code postal</label>
          <InputText v-model="newAssociation.code_postal" id="code_postal" :disabled="true" />
          <label for="ville">Ville</label>
          <InputText v-model="newAssociation.ville" id="ville" :disabled="true" />
        </div>
        <div class="p-dialog-footer mt-3">
          <PButton label="Annuler" icon="pi pi-times" class="p-button-text" @click="resetDialog" />
          <PButton label="Suivant" icon="pi pi-arrow-right" @click="validateStep(nextStep)" />
        </div>
      </div>
      <!-- Step 2: Logo -->
      <div v-if="active === 1">
        <div class="flex-1 flex flex-column gap-2 mt-3">
          <h2>Définissez le logo</h2>
          <p>Ajoutez un logo pour votre association (optionnel).</p>
        </div>
        <div class="flex-1 flex flex-column gap-2 mt-3">
          <label for="associationLogo">Logo</label>
          <InputText v-model="newAssociation.logo" id="associationLogo" />
        </div>
        <div class="p-dialog-footer mt-3">
          <PButton label="Précédent" icon="pi pi-arrow-left" @click="prevStep" class="p-button-text" />
          <PButton label="Enregistrer" icon="pi pi-check" @click="validateStep(saveAssociation)" />
        </div>
      </div>
    </PDialog>
  </div>
  <Toast />
  <div class="spinner-container" v-if="isLoading">
    <LoadingSpinner />
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAssoService } from '@/composables/asso/AssoService';
import { useUserService } from '@/composables/user/UserService';
import { useToast } from 'primevue/usetoast';
import { useUtilsService } from '@/composables/UtilsService';
import LoadingSpinner from '@/components/ui-elements/LoadingSpinner.vue';
import UserModel from '@/models/UserModel';
import { Association } from '@/models/AssociationModel';
import axios from 'axios';

const toast = useToast();
const { isLoading } = useUtilsService();
const associationService = useAssoService();
const userService = useUserService();
const router = useRouter();

const showDialog = ref(false);
const active = ref(0);
const steps = [{ label: '' }, { label: '' }];
const user = ref<UserModel | null>(null);

const associationListe = ref<Association[]>([]);
const newAssociation = ref<Association>({
  id: 0, // L'ID sera défini après la création
  nom: '',
  logo: '',
  numero_rna: '',
  numero_siren: '',
  page_web_url: '',
  description: '',
  email: '',
  telephone: '',
  date_pub_jo: new Date(),
  user_id: Number(sessionStorage.getItem('jwt')) || 0, // L'ID utilisateur est récupéré du sessionStorage
});

const associationData = ref<any>(null); // Stocke les données de l'association récupérées via l'API

async function fetchData() {
  const jwt = sessionStorage.getItem('jwt');
  if (jwt) {
    try {
      const userData = await userService.getUserById(Number(jwt));
      user.value = userData;
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  } else {
    user.value = null;
  }
}

watch(
  () => sessionStorage.getItem('jwt'),
  async () => {
    await fetchData();
  }
);

onMounted(async () => {
  const jwt = sessionStorage.getItem('jwt');
  isLoading.value = true;
  await fetchData();
  associationListe.value = await associationService.getAllAssociations(Number(jwt));
  console.log(associationListe.value);
  isLoading.value = false;
});

const resetDialog = () => {
  showDialog.value = false;
  active.value = 0;
};

const nextStep = () => {
  active.value += 1;
};

const prevStep = () => {
  active.value -= 1;
};
const instance = axios.create(
  {
    baseURL: 'https://entreprise.api.gouv.fr/v4/djepva/api-association/associations/',
    headers: {
    Authorization:`Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1aWQiOiIwMDAwMDAwMC0wMDAwLTAwMDAtMDAwMC0wMDAwMDAwMDAwMDAiLCJqdGkiOiIwMDAwMDAwMC0wMDAwLTAwMDAtMDAwMC0wMDAwMDAwMDAwMDAiLCJzY29wZXMiOlsiYXNzb2NpYXRpb25zIiwib3Blbl9kYXRhIiwicHJvYnRwIiwiY290aXNhdGlvbnNfcHJvYnRwIiwiYXR0ZXN0YXRpb25zX2Zpc2NhbGVzIiwiYXR0ZXN0YXRpb25fZmlzY2FsZV9kZ2ZpcCIsImF0dGVzdGF0aW9uc19zb2NpYWxlcyIsImF0dGVzdGF0aW9uX3NvY2lhbGVfdXJzc2FmIiwiYmlsYW5zX2VudHJlcHJpc2VfYmRmIiwiYmlsYW5zX2JkZiIsImZudHBfY2FydGVfcHJvIiwiY2VydGlmaWNhdF9jbmV0cCIsImNlcnRpZmljYXRpb25fY25ldHAiLCJjZXJ0aWZpY2F0X29wcWliaSIsInF1YWxpYmF0IiwiY2VydGlmaWNhdF9yZ2VfYWRlbWUiLCJkb2N1bWVudHNfYXNzb2NpYXRpb24iLCJlbnRyZXByaXNlcyIsInVuaXRlc19sZWdhbGVzX2V0YWJsaXNzZW1lbnRzX2luc2VlIiwiZXRhYmxpc3NlbWVudHMiLCJleGVyY2ljZXMiLCJjaGlmZnJlX2FmZmFpcmVzX2RnZmlwIiwiZXh0cmFpdHNfcmNzIiwibGlhc3NlX2Zpc2NhbGUiLCJsaWFzc2VzX2Zpc2NhbGVzX2RnZmlwIiwiY2VydGlmaWNhdGlvbnNfcXVhbGlvcGlfZnJhbmNlX2NvbXBldGVuY2VzIiwiYXR0ZXN0YXRpb25fY290aXNhdGlvbnNfY29uZ2VzX3BheWVzX2Nob21hZ2VfaW50ZW1wZXJpZXNfY2lidHBfY25ldHAiLCJlb3JpX2RvdWFuZXMiLCJkYXRhX3N1YnZlbnRpb25fc3VidmVudGlvbnMiLCJsaWVuc19jYXBpdGFsaXN0aXF1ZXNfZGdmaXAiLCJjb252ZW50aW9uc19jb2xsZWN0aXZlcyIsIm1hbmRhdGFpcmVzX3NvY2lhdXhfaW5mb2dyZWZmZSIsImFjdGVzX2lucGkiLCJhc3NvY2lhdGlvbnNfZG9ubmVlc19wcm90ZWdlZXMiLCJhc3NvY2lhdGlvbnNfZGplcHZhIiwibXNhX2NvdGlzYXRpb25zIiwiY290aXNhdGlvbnNfbXNhIiwiY2VydGlmaWNhdGlvbl9vcHFpYmkiLCJlbnRyZXByaXNlc19hcnRpc2FuYWxlcyIsImVmZmVjdGlmc191cnNzYWYiLCJiZW5lZmljaWFpcmVzX2VmZmVjdGlmc19pbnBpIiwiY25hZl9xdW90aWVudF9mYW1pbGlhbCIsImNuYWZfYWxsb2NhdGFpcmVzIiwiY25hZl9lbmZhbnRzIiwiY25hZl9hZHJlc3NlIiwiY29tcGxlbWVudGFpcmVfc2FudGVfc29saWRhaXJlIiwiYWxsb2NhdGlvbl9hZHVsdGVfaGFuZGljYXBlIiwicmV2ZW51X3NvbGlkYXJpdGVfYWN0aXZlIiwicmV2ZW51X3NvbGlkYXJpdGVfYWN0aXZlX21ham9yYXRpb24iLCJhbGxvY2F0aW9uX3NvdXRpZW5fZmFtaWxpYWwiLCJwcmltZV9hY3Rpdml0ZSIsInByaW1lX2FjdGl2aXRlX21ham9yYXRpb24iLCJjbm91c19zdGF0dXRfYm91cnNpZXIiLCJjbm91c19lY2hlbG9uX2JvdXJzZSIsImNub3VzX2VtYWlsIiwiY25vdXNfcGVyaW9kZV92ZXJzZW1lbnQiLCJjbm91c19zdGF0dXRfYm91cnNlIiwiY25vdXNfdmlsbGVfZXR1ZGVzIiwiY25vdXNfaWRlbnRpdGUiLCJtZXNyaV9pZGVudGlmaWFudCIsIm1lc3JpX2lkZW50aXRlIiwibWVzcmlfaW5zY3JpcHRpb25fZXR1ZGlhbnQiLCJtZXNyaV9pbnNjcmlwdGlvbl9hdXRyZSIsIm1lc3JpX2FkbWlzc2lvbiIsIm1lc3JpX2V0YWJsaXNzZW1lbnRzIiwicG9sZV9lbXBsb2lfaWRlbnRpdGUiLCJwb2xlX2VtcGxvaV9hZHJlc3NlIiwicG9sZV9lbXBsb2lfY29udGFjdCIsInBvbGVfZW1wbG9pX2luc2NyaXB0aW9uIiwicG9sZV9lbXBsb2lfcGFpZW1lbnRzIiwibWVuX3N0YXR1dF9zY29sYXJpdGUiLCJtZW5fc3RhdHV0X2JvdXJzaWVyIiwibWVuX2VjaGVsb25fYm91cnNlIiwiYW50c19leHRyYWl0X2ltbWF0cmljdWxhdGlvbl92ZWhpY3VsZV9pZGVudGl0ZV9wYXJ0aWN1bGllciIsImFudHNfZXh0cmFpdF9pbW1hdHJpY3VsYXRpb25fdmVoaWN1bGVfYWRyZXNzZV9wYXJ0aWN1bGllciIsImFudHNfZXh0cmFpdF9pbW1hdHJpY3VsYXRpb25fdmVoaWN1bGVfc3RhdHV0X3JhdHRhY2hlbWVudCIsImFudHNfZXh0cmFpdF9pbW1hdHJpY3VsYXRpb25fdmVoaWN1bGVfZG9ubmVlc19pbW1hdHJpY3VsYXRpb25fdmVoaWN1bGUiLCJhbnRzX2V4dHJhaXRfaW1tYXRyaWN1bGF0aW9uX3ZlaGljdWxlX2NhcmFjdGVyaXN0aXF1ZXNfdGVjaG5pcXVlc192ZWhpY3VsZSIsInBvbGVfZW1wbG9pX2lkZW50aWZpYW50IiwibWVuX3N0YXR1dF9pZGVudGl0ZSIsIm1lbl9zdGF0dXRfZXRhYmxpc3NlbWVudCIsIm1lbl9zdGF0dXRfbW9kdWxlX2VsZW1lbnRhaXJlX2Zvcm1hdGlvbiIsIm1lc3JpX2FkbWlzc2lvbnMiLCJtZXNyaV9hZG1pc3Npb25faW5zY3JpdCIsIm1lc3JpX2FkbWlzc2lvbl9yZWdpbWVfZm9ybWF0aW9uIiwibWVzcmlfYWRtaXNzaW9uX2NvbW11bmVfZXR1ZGVzIiwibWVzcmlfYWRtaXNzaW9uX2V0YWJsaXNzZW1lbnRfZXR1ZGVzIiwiZHNual9zdGF0dXRfc2VydmljZV9uYXRpb25hbCIsImVhamVfYWxsb2NhdGFpcmVzIiwiZWFqZV9lbmZhbnRzIiwiZWFqZV9hZHJlc3NlIiwiZWFqZV9wYXJhbWV0cmVzX2NhbGN1bF9wYXJ0aWNpcGF0aW9uX2ZhbWlsaWFsZSIsInNkaF9zdGF0dXRfc3BvcnRpZl9pZGVudGl0ZSIsInNkaF9zdGF0dXRfc3BvcnRpZl9lc3Rfc3BvcnRpZl9kZV9oYXV0X25pdmVhdSIsInNkaF9zdGF0dXRfc3BvcnRpZl9hX2V0ZV9zcG9ydGlmX2RlX2hhdXRfbml2ZWF1Iiwic2RoX3N0YXR1dF9zcG9ydGlmX2luZm9ybWF0aW9uc19zdGF0dXQiLCJzZGhfc3RhdHV0X3Nwb3J0aWZfaW5mb3JtYXRpb25zX3N0YXR1dHNfcHJlY2VkZW50cyJdLCJzdWIiOiJzdGFnaW5nIGRldmVsb3BtZW50IiwiaWF0IjoxNzUzODcxNzE0LCJ2ZXJzaW9uIjoiMS4wIiwiZXhwIjoyMDY5NDA0NTE0fQ.y8PLkn6t2yjhGK7Kzj-fRA3kB5PGtCL6-EUhQbfkYWQ`,
    "Access-Control-Allow-Origin": "*",

    },
  }
)
const fetchAssociationData = async () => {
  if (newAssociation.value.numero_rna) {
    isLoading.value = true;
    try {
      // Récupération des données d'association via l'API gouvernementale
      const response = await instance({url: `130025265?context=Test+de+l%27API&object=Test+de+l%27API&recipient=10000001700010`, method: 'GET'});
      console.log(await instance({url: `${newAssociation.value.numero_rna}`, method: 'GET'}))
      if (response.data) {
        const data = response.data;
        associationData.value = data;

        // Remplir le formulaire avec les données récupérées
        newAssociation.value.nom = data.identite.nom || '';
        newAssociation.value.description = data.activites.objet || '';
        newAssociation.value.email = data.coordonnees.courriel || '';
        newAssociation.value.telephone = data.coordonnees.telephone || '';
        newAssociation.value.page_web_url = data.page_web_url || '';
        newAssociation.value.adresse = data.coordonnees.adresse_siege.num_voie + " " + data.coordonnees.adresse_siege.type_voie + " " + data.coordonnees.adresse_siege.voie || '';
        newAssociation.value.code_postal = data.coordonnees.adresse_siege.cp || '';
        newAssociation.value.ville = data.coordonnees.adresse_siege.commune || '';
        newAssociation.value.date_pub_jo = new Date(data.identite.date_pub_jo) || new Date();  // Récupère la date de publication
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des données de l\'association:', error);
      toast.add({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Impossible de récupérer les informations de l\'association.',
        life: 5000,
      });
    }
    isLoading.value = false;
  }
};

const saveAssociation = async () => {
  // Combine the properties of newAssociation.value with user_id
  const assoAndUser = {
    ...newAssociation.value, // Spread the properties from newAssociation.value
    user_id: sessionStorage.getItem('jwt'), // Add user_id to the merged object
  };
  console.log(assoAndUser);
  try {
    await associationService.createAssociation(assoAndUser); // Use the combined object
    toast.add({
      severity: 'success',
      summary: 'Succès',
      detail: "L'association a été créée avec succès.",
      life: 5000,
    });

    // Fetch all associations and update the list
    associationListe.value = await associationService.getAllAssociations(Number(assoAndUser.user_id));
    resetDialog(); // Reset the dialog after successful creation
  } catch (error) {
    // Handle error if needed
    console.error('Error creating association:', error);
  }
};
const validateStep = async (callback: Function) => {
  if (!newAssociation.value.nom || !newAssociation.value.description || !newAssociation.value.email) {
    toast.add({
      severity: 'error',
      summary: 'Erreur de validation',
      detail: 'Tous les champs doivent être remplis.',
      life: 5000,
    });
  } else {
    callback();
  }
};

async function assoDetail(id: number) {
  sessionStorage.setItem('idAsso', id.toString()); // Suppose que `token` est renvoyé par l'API
  router.push('/asso-detail');
}

function onSelectedFile(event: any) {
  const file = event.files[0];

  const reader = new FileReader();

  reader.onloadend = function () {
    // Convertir le Blob en une chaîne de caractères
    const base64String = reader?.result as string | null;

    if (base64String) {
      const [, data] = base64String.split(',');
      // Enregistrer la chaîne de caractères dans votre objet ou l'envoyer au serveur
      newAssociation.value.logo = data;
      console.log(newAssociation.value.logo);
    }
  };

  // Lire le contenu du fichier en tant que Blob
  reader.readAsDataURL(file);
}
</script>

<style scoped>
/* Grille responsive avec 3 colonnes */
.grid-container {
  display: grid;
  grid-template-columns: repeat(1, 1fr); /* Par défaut, une colonne */
  gap: 16px; /* Espacement entre les éléments de la grille */
}

@media (min-width: 640px) {
  .grid-container {
    grid-template-columns: repeat(2, 1fr); /* 2 colonnes sur les écrans moyens (sm) */
  }
}

@media (min-width: 1024px) {
  .grid-container {
    grid-template-columns: repeat(3, 1fr); /* 3 colonnes sur les écrans larges (lg) */
  }
}

.grid-item {
  width: 100%; /* Les éléments prennent toute la largeur de leur colonne */
}
</style>