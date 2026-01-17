<template>
  <div>
    <ul class="adherent-card-list">
      <li class="adherent-card-list__card">
        <Card>
          <template #title>Total adhérents</template>
          <template #content>{{ listeMembres.length }}</template>
        </Card>
      </li>
      <li class="adherent-card-list__card">
        <Card>
          <template #title>Adhérents actifs</template>
          <template #content>{{ ACTIVE_MEMBRES.length }}</template>
        </Card>
      </li>
      <li class="adherent-card-list__card">
        <Card>
          <template #title>Bureau</template>
          <template #content>À faire</template>
        </Card>
      </li>
      <li class="adherent-card-list__card">
        <Card>
          <template #title>Nouveaux ce mois</template>
          <template #content>{{ listeMembres.filter((membre) => new Date(membre.date_adhesion) > new Date( new Date().getFullYear(), new Date().getMonth() - 1, new Date().getDate())).length }}</template>
        </Card>
      </li>
    </ul>
    <div style="width:70vw" class="card">
      <Toolbar class="mb-6">
        <template #start>
          <PButton label="Nouveau membre" icon="pi pi-plus" class="mr-2" @click="openNew" />
          <PButton
            label="Supprimer"
            icon="pi pi-trash"
            severity="danger"
            outlined
            @click="confirmDeleteSelected"
            :disabled="!selectedProducts || !selectedProducts.length"
          />
        </template>
      </Toolbar>
      <DataTable
        ref="dt"
        v-model:selection="selectedProducts"
        :value="listeMembres"
        dataKey="id"
        :paginator="true"
        :rows="5"
        :filters="filters"
        scrollable
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        :rowsPerPageOptions="[5, 15, 25]"
        currentPageReportTemplate="Affiche {first} à {last} de {totalRecords} membres"
      >
        <template #header>
          <div class="flex" style="justify-content:space-between; align-items:baseline">
            <h4 class="m-0">Gérer les bénévoles</h4>
            <InputText v-model="filters['global'].value" placeholder="Rechercher" />
          </div>
        </template>

        <Column selectionMode="multiple" style="width: 3rem" :exportable="false"></Column>
        <Column field="username" header="Membre" sortable>
          <template #body="slotProps">
            <Avatar v-if="slotProps.data.photo" size="large" shape="circle" :image="'data:image/png;base64,' + slotProps.data.photo"  @click="toggleReglage">
            </Avatar>
            <Avatar size="large" shape="circle" v-else @click="toggleReglage">
              <div>
                {{ slotProps.data.prenom?.charAt(0).toUpperCase() + '' + slotProps.data.nom.charAt(0).toUpperCase() }}
              </div>
            </Avatar>
            <div>
              <div>{{ slotProps.data.prenom + " " + slotProps.data.nom}}</div>
              <div>{{ slotProps.data.email }}</div>
            </div>
          </template>
        </Column>
        <Column field="role" header="Rôle" sortable style="min-width: 12rem"></Column>
        <Column field="email" header="Mail" sortable style="min-width: 12rem"></Column>
        <Column field="date_adhesion" header="Date d'adhésion" sortable style="min-width: 12rem">
          <!-- <template #body="slotProps">
            salut
          </template> -->
          <template #body="{ data }">
            <!-- {{formatDate("2024-04-10T22:00:00.000Z")}} -->
            {{ formatDate(data.date_adhesion) }}
          </template>
        </Column>
        <Column field="est_actif" header="Activité" sortable style="min-width: 12rem">
          <template #body="slotProps">
            <Tag v-if="slotProps.data.est_actif" value="Actif" severity="success" />
            <Tag v-else value="Inactif" severity="danger" />
          </template>
        </Column>
        <Column :exportable="false" style="min-width: 12rem">
          <template #body="slotProps">
            <PButton icon="pi pi-pencil" outlined rounded class="mr-2" @click="editProduct(slotProps.data)" />
            <PButton icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteProduct(slotProps.data)" />
          </template>
        </Column>
      </DataTable>
    </div>
    <PDialog v-model:visible="addMembreDialog" :style="{ width: '600px' }" header="Inviter de nouveaux adhérents" modal>
      <Stepper v-model:value="activeStep" linear class="basis-[40rem]">
       <StepPanels>
            <StepPanel v-slot="{ activateCallback }" :value="1">
              <div>
                <span>Sélectionnez un ou plusieurs utilisateurs pour les inviter dans votre association.</span>
              </div>
              <Card v-if="selectedUsers.length != 0">
                <template #header>
                  <span>
                    {{selectedUsers.length}} personnes sélectionnées.
                  </span>
                  <PButton label="Tout déselectionner" variant="text" @click="selectedUsers = []" />
                </template>
                <template #content>
                  <div v-for="user in selectedUsers" :key="user.id">
                    <Chip>
                     <Avatar v-if="user.photo" shape="circle" :image="'data:image/png;base64,' + item.photo"  @click="toggleReglage">
                          </Avatar>
                          <Avatar shape="circle" v-else @click="toggleReglage">
                            <div>
                              {{ user.prenom?.charAt(0).toUpperCase() + '' + user.nom?.charAt(0).toUpperCase() }}
                            </div>
                          </Avatar>
                          <div>{{ user.prenom + " " + user.nom }}</div>
                          <span class="pi pi-times-circle" @click="deleteOneUserSelected(user)"></span>
                    </Chip>
                  </div>
                </template>
              </Card>
              <IconField>
                <InputIcon class="pi pi-search" />
                <InputText v-model="filter" placeholder="Search" />
              </IconField>
              <CheckboxGroup name="participant" v-model="selectedUsers" >
              <VirtualScroller :items="filterUsers" :itemSize="50" class="border border-surface-200 dark:border-surface-700 rounded" style="width: 300px; height: 200px">
                  <template v-slot:item="{ item, options }">
                    <div :class="['flex items-center p-2', { 'bg-surface-100 dark:bg-surface-700': options.odd }]" style="height: 50px">
                        <Checkbox :inputId="item.id"  :value="item" />
                        <label :for="item.id" style="display:flex;">
                          <Avatar v-if="item.photo" size="large" shape="circle" :image="'data:image/png;base64,' + item.photo"  @click="toggleReglage">
                          </Avatar>
                          <Avatar size="large" shape="circle" v-else @click="toggleReglage">
                            <div>
                              {{ item.prenom?.charAt(0).toUpperCase() + '' + item.nom?.charAt(0).toUpperCase() }}
                            </div>
                          </Avatar>
                          <div>
                            <div>{{ item.prenom + " " + item.nom }}</div>
                            <div>{{ item.email }}</div>
                          </div>
                        </label>
                    </div>
                  </template>
                </VirtualScroller>
              </CheckboxGroup>
                <div v-if="selectedUsers.length != 0" class="flex pt-6 justify-end">
                    <PButton label="Next" icon="pi pi-arrow-right" iconPos="right" @click="activateCallback(2)" />
                </div>
            </StepPanel>
            <StepPanel v-slot="{ activateCallback }" :value="2">
                <div>
                  <div>
                      <span>Définissez le rôle et la date d'adhésion pour chaque utilisateur sélectionné</span>
                  </div>
                  <Card v-for="user in selectedUsers" :key="user.id">
                    <template #header>
                      <div>
                        <Avatar v-if="user.photo" size="large" shape="circle" :image="'data:image/png;base64,' + user.photo"  @click="toggleReglage" />                        <Avatar size="large" shape="circle" v-else @click="toggleReglage">
                          <div>{{ user.prenom?.charAt(0).toUpperCase() + '' + user.nom?.charAt(0).toUpperCase() }}</div>
                        </Avatar>
                        <div>
                          <div>{{ user.prenom + " " + user.nom }}</div>
                          <div>{{ user.email }}</div>
                        </div>
                      </div>
                      <span class="pi pi-times" @click="deleteOneUserSelected(user)"></span>
                    </template>
                    <template #content>
                      <div>
                        <span>Rôle</span>
                        <SelectButton v-model="user.role" defaultValue="adherent" :options="statuses" optionLabel="label" optionValue="value" dataKey="value" aria-labelledby="custom">
                          <template #option="slotProps">
                            <span :class="'pi ' + 'pi-'+getStatusLabel(slotProps.option.value)"></span>
                            <span>{{slotProps.option.label}}</span>
                          </template>
                        </SelectButton>
                        <label :for="'date'+user.id">Date d'adhésion</label>
                        <DatePicker showIcon :inputId="'date'+user.id" v-model="user.date_adhesion" dateFormat="dd/mm/yy" placeholder="Sélectionner une date" />
                        <span>L'utilisateur est-il actif dans l'association ?</span>
                        <ToggleButton v-model="user.est_actif" onLabel="Actif" offLabel="Inactif" />
                      </div>
                    </template>
                  </Card>
                </div>
                <div class="flex pt-6 justify-between">
                    <PButton label="Back" severity="secondary" icon="pi pi-arrow-left" @click="activateCallback(1)" />
                    <PButton :label="`Envoyer ${selectedUsers.length} invitations`" icon="pi pi-send" @click="saveProduct()" />
                </div>
                {{selectedUsers}}
            </StepPanel>
        </StepPanels>
      </Stepper>
      
      <!-- <div class="flex flex-col gap-6"> -->
      <!-- <MultiSelect
          id="user-select"
          v-model="selectedUsers"
          :options="membres"
          :optionLabel="'username'"
          :optionValue="'id'"
          filter
          filterPlaceholder="Rechercher un utilisateur"
          :placeholder="'Choisissez des utilisateurs'"
          class="w-full"
        >
          <template #selectedValue="slotProps">
            {{ slotProps.value }}
            <img
              v-if="membre.image"
              :src="`https://primefaces.org/cdn/primevue/images/membre/${membre.image}`"
              :alt="membre.image"
              class="block m-auto pb-4"
            />
            <Tag class="mr-2 mb-1" :value="slotProps.value.name" />
          </template>
        </MultiSelect> -->
      <!-- <template #footer>
        <PButton v-if="step === 1" label="Suivant" icon="pi pi-arrow-right" @click="goToStep(2)" :disabled="!selectedUsers.length" />
        <PButton v-else-if="step === 2" label="Enregistrer" icon="pi pi-check" @click="saveProduct" />
        <PButton label="Annuler" icon="pi pi-times" text />
      </template> -->
      <!-- Étape 1 : Sélection des utilisateurs -->
      <!-- <div v-if="step === 1">
        <label for="user-select" class="block text-sm font-medium text-gray-700 mb-2">Sélectionnez des utilisateurs</label>
        <MultiSelect
          id="user-select"
          v-model="selectedUsers"
          :options="membres"
          :optionLabel="'username'"
          :optionValue="'id'"
          filter
          filterPlaceholder="Rechercher un utilisateur"
          :placeholder="'Choisissez des utilisateurs'"
          class="w-full"
        >
          <template #selectedValue="slotProps">
            {{ slotProps.value }}
            <img
              v-if="membre.image"
              :src="`https://primefaces.org/cdn/primevue/images/membre/${membre.image}`"
              :alt="membre.image"
              class="block m-auto pb-4"
            />
            <Tag class="mr-2 mb-1" :value="slotProps.value.name" />
          </template>
        </MultiSelect>
      </div>
      <!-- Étape 2 : Définition des informations -->
      <!-- <div v-if="step === 2">
        <div v-for="(user, index) in selectedUsersDetails" :key="user.id" class="mb-4 p-4 border rounded">
          <h3 class="text-lg font-bold mb-2">{{ user.username }}</h3>
          <div class="flex flex-col gap-2">
            <div> -->
              <!-- <label for="role" class="block font-bold mb-3">Rôle</label>
              <Dropdown
                id="inventoryStatus"
                v-model="membre.role"
                :options="statuses"
                optionLabel="label"
                optionValue="label"
                placeholder="Choisissez un rôle"
              > -->
              <!-- <label :for="'role-' + index" class="block font-medium">Rôle</label>
              <Dropdown
                v-model="user.role"
                :options="statuses"
                optionLabel="label"
                :id="'role-' + index"
                placeholder="Sélectionnez un rôle"
              >
                <template #value="slotProps">
                  <div v-if="slotProps.value && slotProps.value.value">
                    <Tag :value="slotProps.value.label" :severity="getStatusLabel(slotProps.value.label)" />
                  </div>
                  <div v-else-if="slotProps.value && !slotProps.value.value">
                    <Tag :value="slotProps.value" :severity="getStatusLabel(slotProps.value)" />
                  </div>
                  <span v-else>{{ slotProps.placeholder }}</span>
                </template>
              </Dropdown>
            </div>
            <div>
              <label :for="'date_adhesion-' + index" class="block font-bold mb-3">Date d'adhésion</label>
              <Calendar v-model="user.date_adhesion" :id="'date_adhesion-' + index" />
            </div>
            <div>
              <label :for="'est_actif-' + index" class="block font-bold mb-3">Activité</label>
              <ToggleButton v-model="user.est_actif" :id="'est_actif-' + index" onLabel="Actif" offLabel="Inactif" @click="console.log(user.est_actif)" />
            </div>
          </div>
        </div>
      </div> -->
      <!-- </div> -->

      <!-- <template #footer>
        <PButton label="Cancel" icon="pi pi-times" text @click="hideDialog" />
        <PButton label="Save" icon="pi pi-check" @click="updateProduct" />
      </template> -->
    </PDialog>
    <PDialog v-model:visible="editMembreDialog" :style="{ width: '450px' }" :header="membre.prenom + ' ' + membre.nom" :modal="true">
      <div class="flex flex-col gap-6">
        <img
          v-if="membre.image"
          :src="`https://primefaces.org/cdn/primevue/images/membre/${membre.image}`"
          :alt="membre.image"
          class="block m-auto pb-4"
        />  
        <div>
          <label for="role" class="block font-bold mb-3">Rôle</label>
          <Dropdown
            id="inventoryStatus"
            v-model="membre.role"
            :options="statuses"
            optionLabel="label"
            optionValue="label"
            placeholder="Choisissez un rôle"
          >
            <template #value="slotProps">
              {{ slotProps.value.value }}
              <div v-if="slotProps.value && slotProps.value.value">
                <Tag :value="slotProps.value.label" :severity="getStatusLabel(slotProps.value.label)" />
              </div>
              <div v-else-if="slotProps.value && !slotProps.value.value">
                <Tag :value="slotProps.value" :severity="getStatusLabel(slotProps.value)" />
              </div>
              <span v-else>{{ slotProps.placeholder }}</span>
            </template>
          </Dropdown>
        </div>
        <div>
          <label for="date_adhesion" class="block font-bold mb-3">Date d'adhésion</label>
          <Calendar v-model="membre.date_adhesion" dateFormat="dd/mm/yy" />
        </div>
        <div>
          <label for="est_actif" class="block font-bold mb-3">Activité</label>
          <ToggleButton v-model="membre.est_actif" onLabel="Actif" offLabel="Inactif" />
        </div>
      </div>

      <template #footer>
        <PButton label="Cancel" icon="pi pi-times" text @click="hideDialog" />
        <PButton label="Save" icon="pi pi-check" @click="updateProduct" />
      </template>
    </PDialog>

    <PDialog v-model:visible="deleteProductDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
      <div class="flex items-center gap-4">
        <i class="pi pi-exclamation-triangle !text-3xl" />
        <span v-if="membre"
          >Are you sure you want to delete <b>{{ membre.name }}</b
          >?</span
        >
      </div>
      <template #footer>
        <PButton label="No" icon="pi pi-times" text @click="deleteProductDialog = false" />
        <PButton label="Yes" icon="pi pi-check" @click="deleteProduct" />
      </template>
    </PDialog>

    <PDialog v-model:visible="deleteProductsDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
      <div class="flex items-center gap-4">
        <i class="pi pi-exclamation-triangle !text-3xl" />
        <span v-if="membre">Are you sure you want to delete the selected membres?</span>
      </div>
      <template #footer>
        <PButton label="No" icon="pi pi-times" text @click="deleteProductsDialog = false" />
        <PButton label="Yes" icon="pi pi-check" text @click="deleteSelectedProducts" />
      </template>
    </PDialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
import { useRoute } from 'vue-router';
import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from 'primevue/usetoast';
import {useAssoService} from '@/composables/asso/AssoService';
import {useUserService} from '@/composables/user/UserService';
import { useMemberService } from '@/composables/member/MemberService';
import Membre from '@/models/MembreModel';

const listeMembres = ref<Membre>([]);
const ACTIVE_MEMBRES = ref<Membre>([]);
const AssoService = useAssoService();
const MemberService = useMemberService();
const UserService = useUserService();
const route = useRoute();
const activeStep = ref(1);
const filter = ref('');
const items = ref(Array.from({ length: 100000 }).map((_, i) => `Item #${i}`));

onMounted(async () => {
  const idAsso = sessionStorage.getItem('idAsso'); // Récupérer l'ID de l'association actuelle
  listeMembres.value = await AssoService.getMembersByAssoId(Number(idAsso)); // Récupérer les membres de l'association par son ID
  allMembres.value = await UserService.getUsers(); // Récupérer tous les membres de la BDD
  membres.value = allMembres.value.filter((user) => !listeMembres.value.some((member) => member.user_id === user.id));
  ACTIVE_MEMBRES.value = listeMembres.value.filter((membre) => membre.est_actif);
  // console.log(listeMembres.value.filter((membre) => console.log("TEST", new Date(membre.date_adhesion))));
  // console.log(listeMembres.value.filter((membre) => new Date(membre.date_adhesion) > new Date( new Date().getFullYear(), new Date().getMonth() - 1, new Date().getDate())))
});

// CHANGER LES VALEURS DANS LES PAGES QUAND CHANGEMENT D'ASSO
watch(() => route.params.id, async (newId) => {
    const id = newId ? Number(newId) : null;
    const idAsso = sessionStorage.getItem('idAsso'); // Récupérer l'ID de l'association actuelle
    if (id == Number(idAsso)) {
      listeMembres.value = await AssoService.getMembersByAssoId(Number(idAsso)); // Récupérer les membres de l'association par son ID
    }
});

const toast = useToast();
const dt = ref();
const membres = ref<Membre[]>([]);
const membre = ref<Membre>({});
const addMembreDialog = ref(false);
const editMembreDialog = ref(false);
const deleteProductDialog = ref(false);
const deleteProductsDialog = ref(false);
const selectedUsers = ref([]);
const allMembres = ref<Membre[]>();
const step = ref(1);
const selectedUsersDetails = ref([]); // Détails des utilisateurs sélectionnés

// Gestion des étapes
const goToStep = (stepNumber) => {
  step.value = stepNumber;
  if (stepNumber === 2) {
    // Remplir les détails des utilisateurs sélectionnés à l'étape 2
    selectedUsersDetails.value = selectedUsers.value.map((id) => {
      const user = membres.value.find((u) => u.id === id);
      return { ...user, role: null, est_actif: false, date_adhesion: null }; // Ajouter des champs modifiables
    });
  }
};

// async function filterUsers(filter) {
//   console.log("oui", membres.value.filter((user) => membres.value.some((member) => member.username.startsWith(filter))))
//   membres.value = membres.value.filter((user) => membres.value.some((member) => member.username.includes(filter)))
// }

const filterUsers = computed(() =>
  filterByText(membres.value, filter.value, ['prenom', 'nom', 'username'])
);

function normalize(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function filterByText<T>(items: T[], search: string, fields: (keyof T)[]): T[] {
  if (!search?.trim()) return items;

  const query = normalize(search);

  return items.filter(item =>
    fields.some(field =>
      normalize(String(item[field] ?? '')).includes(query)
    )
  );
}

const selectedProducts = ref();
const filters = ref({
  'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
});
// const submitted = ref(false);
const statuses = ref([
  { label: 'Président', value: 'president' },
  { label: 'Secrétaire', value: 'secretaire' },
  { label: 'Trésorier', value: 'tresorier' },
  { label: 'Bénévole', value: 'benevole' },
  { label: 'Adhérent', value: 'adherent' },
]);
const openNew = () => {
  membre.value = {};
  // submitted.value = false;
  addMembreDialog.value = true;
};
const hideDialog = () => {
  editMembreDialog.value = false;
  // submitted.value = false;
};
const saveProduct = async () => {
  // submitted.value = true;
  const jsonOutput = {
    newMembres: selectedUsers.value.map((user) => ({
      id_user: user.id,
      role: user.role,
      date_adhesion: user.date_adhesion,
      est_actif: user.est_actif,
    })),
  };
  try {
    await MemberService.addMember(Number(sessionStorage.getItem('idAsso')), jsonOutput);
    toast.add({
      severity: 'success',
      summary: 'Succès',
      detail: 'Les membres ont été ajoutés avec succès.',
      life: 5000,
    });
    addMembreDialog.value = false;
    selectedUsers.value = [];
    listeMembres.value = await AssoService.getMembersByAssoId(Number(sessionStorage.getItem('idAsso')));
  } catch (error) {
    // Handle error if needed
    console.error('Error adding members:', error);
  }
};

const editProduct = (prod) => {
  membre.value = { ...prod };
  editMembreDialog.value = true;
};

const updateProduct = async () => {
  try {
    await MemberService.updateMember(Number(membre.value.id), membre.value); // Use the combined object
    toast.add({
      severity: 'success',
      summary: 'Succès',
      detail: "L'association a été modifiée avec succès.",
      life: 5000,
    });
    listeMembres.value = await AssoService.getMembersByAssoId(Number(sessionStorage.getItem('idAsso')));
    editMembreDialog.value = false;
    membre.value = {};
  } catch (error) {
    // Handle error if needed
    console.error('Error creating association:', error);
  }
};

const confirmDeleteProduct = (prod) => {
  membre.value = prod;
  console.log(membre.value);
  deleteProductDialog.value = true;
};
const deleteProduct = async () => {
  try {
    await MemberService.deleteMember(Number(membre.value.id));
    deleteProductDialog.value = false;
    membre.value = {};
    listeMembres.value = await AssoService.getMembersByAssoId(Number(sessionStorage.getItem('idAsso')));
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });

  } catch (error) {
    // Handle error if needed
    console.error('Error creating association:', error);
  }
};
const findIndexById = (id, array) => {
  let index = 0;
  console.log("findbyindex", id, array);
  for (let i = 0; i < array.length; i++) {
    if (array[i].id === id) {
      index = i;
      console.log(index)
      break;
    }
  }
  return index;
};
const deleteOneUserSelected = (user) => {
  const id = selectedUsers.value.find((u) => u.id === user.id).id
  const index = findIndexById(id, selectedUsers.value);
  selectedUsers.value.splice(index, 1)
}

const createId = () => {
  let id = '';
  var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for ( var i = 0; i < 5; i++ ) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
};
const confirmDeleteSelected = () => {
  deleteProductsDialog.value = true;
  console.log(selectedProducts.value)
};

const formatDate = (date: Date | string | number | null | undefined): string => {
  if (!date) return '';

  const parsedDate = new Date(date); 
  if (isNaN(parsedDate.getTime())) return '';
  const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
  return new Intl.DateTimeFormat('fr-FR', options).format(parsedDate);
};

const deleteSelectedProducts = async () => {
  const jsonOutput = {
    deletedMembers: selectedProducts.value.map((user: any) => ({
      id_user: user.id,
    })),
  };
    console.log(jsonOutput);
  try {
    console.log("try", jsonOutput);
    await MemberService.deleteMembers(jsonOutput);
    listeMembres.value = await AssoService.getMembersByAssoId(Number(sessionStorage.getItem('idAsso')));
  deleteProductsDialog.value = false;
  selectedProducts.value = null;
  toast.add({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
  } catch (error) {
    // Handle error if needed
    console.error('Error adding members:', error);
  }
 
};

const getStatusLabel = (status) => {
  switch (status) {
    case 'adherent':
      return 'user-plus';
    case 'benevole':
      return 'user';
    case 'president':
      return 'key';
    case 'secretaire':
      return 'file';
    case 'tresorier':
      return 'wallet';
    default:
      return 'user';
  }
};
</script>
