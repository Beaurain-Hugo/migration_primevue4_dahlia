<template>
  <div>
    <ul class="adherent-card-list">
      <li class="adherent-card-list__card">
        <div class="border flex items-center p-4 rounded-xl shadow gap-2">
          <span class="pi pi-users text-3xl p-2 rounded-full bg-blue-200 text-blue-600 inline-flex items-center justify-center"></span>
          <div class="flex flex-col">
            <span class="text-lg">Total adhérents</span>
            <span class="text-xl font-bold">{{ listeMembres.length }}</span>
          </div>
        </div>
      </li>
      <li class="adherent-card-list__card">
        <div class="border flex items-center p-4 rounded-xl shadow gap-2">
          <span class="pi pi-users text-3xl  p-2 rounded-full bg-green-200 text-green-600 inline-flex items-center justify-center"></span>
          <div class="flex flex-col">
            <span class="text-lg">Adhérents actifs</span>
            <span class="text-xl font-bold">{{ ACTIVE_MEMBRES.length }}</span>
          </div>
        </div>
      </li>
      <li class="adherent-card-list__card">
        <div class="border flex items-center p-4 rounded-xl shadow gap-2">
          <span class="pi pi-crown text-3xl"></span>
          <div class="flex flex-col">
            <span class="text-lg">Bureau</span>
            <span class="text-xl font-bold">À faire</span>
          </div>
        </div>
      </li>
      <li class="adherent-card-list__card">
        <div class="border flex items-center p-4 rounded-xl shadow gap-2">
          <span class="pi pi-calendar text-3xl  p-2 rounded-full bg-orange-200 text-orange-600 inline-flex items-center justify-center"></span>
          <div class="flex flex-col">
            <span class="text-lg">Nouveaux ce mois-ci</span>
            <span class="text-xl font-bold">{{ listeMembres.filter((membre) => new Date(membre.date_adhesion) > new Date( new Date().getFullYear(), new Date().getMonth() - 1, new Date().getDate())).length }}</span>
          </div>
        </div>
      </li>
    </ul>
    <div class="cad">
      <Toolbar class="my-6 shadow-md">
        <template #start>
            <InputText v-model="filters['global'].value" placeholder="Rechercher un adhérent" />
        </template>
        <template #end>
          <PButton label="Inviter des adhérents" icon="pi pi-plus" class="mr-2" @click="openNew"  :pt="{root:'bg-purple-900 border-purple-900'}"/>
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
        :pt="{
          root:'rounded-xl bg-white px-6 border shadow-lg',
          header:'rounded-t-xl bg-white border-none',
          pcPaginator:{
            paginatorContainer:{class:'rounded-b-xl border-none'},
          },
          bodyrow:'hover:bg-orange-50'

        }"
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
            <h4 class="m-0">Liste des adhérents ({{listeMembres.length}})</h4>
            <!-- <InputText v-model="filters['global'].value" placeholder="Rechercher" /> -->
          </div>
        </template>

        <Column :pt="{
          headerCell:'bg-white'
        }"selectionMode="multiple" style="width: 3rem" :exportable="false"></Column>
        <Column :pt="{
          headerCell:'bg-white'
        }" :field="f => `${f.firstname} ${f.lastName}`" header="Membre" sortable>
          <template #body="slotProps">
            <div class="flex items-center gap-2">
              <Avatar v-if="slotProps.data.photo" size="large" shape="circle" :image="'data:image/png;base64,' + slotProps.data.photo">
              </Avatar>
              <Avatar size="large" shape="circle" v-else>
                <div>
                  {{ slotProps.data.firstname?.charAt(0).toUpperCase() + '' + slotProps.data.lastName.charAt(0).toUpperCase() }}
                </div>
              </Avatar>
              <div>
                <div>{{ slotProps.data.firstname + " " + slotProps.data.lastName}}</div>
                <div>{{ slotProps.data.email }}</div>
              </div>
            </div>
          </template>
        </Column>
        <Column :pt="{
          headerCell:'bg-white'
        }" field="role" header="Rôle" sortable style="min-width: 6rem">
          <template #body="slotProps">
            <Tag :value="slotProps.data.role.name" />
          </template>
        </Column>
        <Column :pt="{
          headerCell:'bg-white'
        }" field="date_adhesion" header="Date d'adhésion" sortable>
          <template #body="{ data }">
            <span class="pi pi-calendar"></span>
            {{ formatDate(data.date_adhesion) }}
          </template>
        </Column>
        <Column :pt="{
          headerCell:'bg-white'
        }" field="est_actif" header="Activité" sortable style="min-width: 6rem">
          <template #body="slotProps">
            <Tag v-if="slotProps.data.est_actif" value="Actif" severity="success" />
            <Tag v-else value="Inactif" severity="danger" />
          </template>
        </Column>
        <Column :pt="{
          headerCell:'bg-white'
        }" :exportable="false" style="min-width: 12rem">
          <template #body="slotProps">
            <PButton :pt="{root:'hover:!bg-second hover:!text-white'}" severity="contrast" icon="pi pi-pencil" variant="text" rounded class="mr-2" @click="editProduct(slotProps.data)" />
            <PButton :pt="{root:'hover:!bg-second'}" icon="pi pi-trash" variant="text" rounded severity="danger" @click="confirmDeleteProduct(slotProps.data)" />
          </template>
        </Column>
      </DataTable>
    </div>
    <PDialog v-model:visible="addMembreDialog" :style="{ width: '600px' }" header="Inviter de nouveaux adhérents" modal>
      <Stepper v-model:value="activeStep" linear class="basis-[40rem]">
       <StepPanels>
            <StepPanel class="!bg-[#F0F0F0]" v-slot="{ activateCallback }" :value="1">
              <div class="flex flex-col gap-2">
              <div class="bg-[#F0F0F0]">
                <span>Sélectionnez un ou plusieurs utilisateurs pour les inviter dans votre association.</span>
              </div>
              <Card class="!border-[#FC82A4] border !bg-gradient-to-br !from-[#FFEDE2]/50 !to-[#FFEDE2]/20" v-if="selectedUsers.length != 0">
                <template #title>
                  <div class="flex justify-between">
                    <span class="text-lg text-slate-700 font-medium">
                      {{selectedUsers.length}} personnes sélectionnées.
                    </span>
                    <PButton class="text-slate-700 font-medium" label="Tout déselectionner" severity="secondary" variant="text" @click="selectedUsers = []" />
                  </div>
                </template>
                <template #content>
                  <div class="flex">
                  <div v-for="user in selectedUsers" :key="user.id" >
                    <Chip class="bg-white border font-semibold !border-[#451D94]/20">
                     <Avatar v-if="user.photo" shape="circle" :image="'data:image/png;base64,' + user.photo">
                          </Avatar>
                          <Avatar shape="circle" v-else>
                            <div>
                              {{ user.firstname?.charAt(0).toUpperCase() + '' + user.lastName?.charAt(0).toUpperCase() }}
                            </div>
                          </Avatar>
                          <div>{{ user.firstname + " " + user.lastName }}</div>
                          <span class="pi pi-times" @click="deleteOneUserSelected(user)"></span>
                    </Chip>
                  </div>
                  </div>
                </template>
              </Card>
              <IconField>
                <InputIcon class="pi pi-search" />
                <InputText :pt="{root:'!bg-[#F0F0F0] !shadow'}" fluid v-model="filter" placeholder="Cherchez un utilisateur..." />
              </IconField>
              <CheckboxGroup name="participant" class="w-full" v-model="selectedUsers" >
              <VirtualScroller :items="filterUsers" :itemSize="86" class="" style="width: 100%; height: 200px">
                  <template v-slot:item="{ item, options }">
                    <label :for="item.id" :class="['flex items-center gap-4 px-2 py-4 border mt-2 rounded-xl hover:bg-[#FFEDE2]/30 hover:border-main/30', { 'bg-main/5 border-main hover:border-main hover:bg-main/5':selectedUsers.includes(item) }]" style="height:86px" >
                        <Checkbox :inputId="item.id" :value="item" />
                        <!-- <label :for="item.id" class="flex gap-3"> -->
                          <Avatar v-if="item.photo" size="large" shape="circle" :image="'data:image/png;base64,' + item.photo">
                          </Avatar>
                          <Avatar size="large" shape="circle" v-else>
                            <div>
                              {{ item.firstname?.charAt(0).toUpperCase() + '' + item.lastName?.charAt(0).toUpperCase() }}
                            </div>
                          </Avatar>
                            <span class="font-bold text-xl capitalize">{{ item.firstname + " " + item.lastName }}</span>
                        <!-- </label> -->
                      </label>
                  </template>
                </VirtualScroller>
              </CheckboxGroup>
                <div v-if="selectedUsers.length != 0" class="flex pt-6 justify-end">
                    <PButton :pt="{root:'bg-purple-900 border-purple-900'}" label="Continuer" icon="pi pi-arrow-right" iconPos="right" @click="activateCallback(2)" />
                </div>
                </div>
            </StepPanel>
            <StepPanel class="!bg-[#F0F0F0]" v-slot="{ activateCallback }" :value="2">
                <div>
                  <div>
                      <span>Définissez le rôle et la date d'adhésion pour chaque utilisateur sélectionné</span>
                  </div>
                  <Card class="!bg-[#F0F0F0]" v-for="user in selectedUsers" :key="user.id">
                    <template #title>
                      <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2">
                        <Avatar v-if="user.photo" size="large" shape="circle" :image="'data:image/png;base64,' + user.photo"  />
                        <Avatar size="large" shape="circle" v-else>
                          <div>{{ user.firstname?.charAt(0).toUpperCase() + '' + user.lastName?.charAt(0).toUpperCase() }}</div>
                        </Avatar>
                          <span class="capitalize">{{ user.firstname + " " + user.lastName }}</span>
                        </div>
                        <span class="pi pi-times" @click="deleteOneUserSelected(user)"></span>

                      </div>
                    </template>
                    <template #content>
                      <div class="flex flex-col gap-3">
                        <span>Rôle</span>
                           <RadioButtonGroup name="role" class="flex justify-center items-center gap-4" v-model="user.role" >
                            <label v-for="role in roles" :key="role.id" :for="'membre-'+role.id" :class="['flex flex-col text-center px-2 py-4 border mt-2 rounded-3xl hover:bg-[#FFEE2]/30 hover:border-main/30', { 'border-main bg-main/5 text-main':user.role === role  }]"  >
                              <span :class="['p-1 bg-slate-100 rounded-md m-auto pi ' + 'pi-'+getStatusLabel(role.name), { '!bg-main text-white':user.role?.id === role.id  }]"></span>
                              <span class="">{{ role.role }}</span>
                              <RadioButton :pt="{box:'hidden', root:'hidden'}" :inputId="'membre-'+role.id" :value="role" />
                            </label>
                            </RadioButtonGroup>
                        <div>
                        <label :for="'date'+user.id">Date d'adhésion</label>
                        <DatePicker :pt="{pcInputText:{root:'!bg-[#F0F0F0] !shadow-none'}}" fluid showIcon :inputId="'date'+user.id" v-model="user.date_adhesion" dateFormat="dd/mm/yy" placeholder="Sélectionner une date" />
                        </div>
                        <div class="flex gap-2 items-center">
                        <span>L'utilisateur est-il actif dans l'association ?</span>
                        <ToggleButton v-model="user.est_actif" onLabel="Actif" offLabel="Inactif" />
                        </div>
                      </div>
                    </template>
                  </Card>
                </div>
                <div class="flex pt-6 justify-between">
                    <PButton label="Revenir en arrière" severity="secondary" icon="pi pi-arrow-left" @click="activateCallback(1)" />
                    <PButton :label="`Envoyer ${selectedUsers.length} invitations`" icon="pi pi-send" @click="saveProduct()" :pt="{root:'bg-purple-900 border-purple-900'}" />
                </div>
            </StepPanel>
        </StepPanels>
      </Stepper>

    </PDialog>
    <PDialog v-model:visible="editMembreDialog" :style="{ width: '450px' }" :header="membre.firstname + ' ' + membre.lastName" :modal="true">
      <div class="flex flex-col gap-6">
        <img
          v-if="membre.image"
          :src="`https://primefaces.org/cdn/primevue/images/membre/${membre.image}`"
          :alt="membre.image"
          class="block m-auto pb-4"
        />  
        <div>
          <label for="role" class="block font-bold mb-3">Rôle</label>
          <Select
            id="inventoryStatus"
            v-model="membre.role.name"
            :options="roles"
            optionLabel="role"
            optionValue="id"
            placeholder="Choisissez un rôle"
          >
            <template #value="slotProps">
              <div v-if="slotProps.value && slotProps.value">
                <Tag :value="slotProps.value" :severity="getStatusLabel(slotProps.value.label)" />
              </div>
              <!-- <div v-else-if="slotProps.value && !slotProps.value.value">
                <Tag :value="slotProps.value" :severity="getStatusLabel(slotProps.value)" />
              </div> -->
              <span v-else>{{ slotProps.placeholder }}</span>
            </template>
          </Select>
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
          >Are you sure you want to delete <b>{{ membre.firstname + ' ' + membre.lastName }}</b
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
import { ref, onMounted, watch, computed, reactive } from 'vue';
import { useRoute } from 'vue-router';
import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from 'primevue/usetoast';
// import {useAssoService} from '@/composables/asso/AssoService';
import {useAssoService} from '@/composable/asso/AssoService';
import {useRoleService} from '@/composable/role/RoleService';
import {useUserService} from '@/composable/user/UserService';
// import {useUserService} from '@/composables/user/UserService';
import { useMemberService } from '@/composable/member/MemberService';
import Membre from '@/models/MembreModel';
import { only } from 'node:test';

const listeMembres = ref<Membre[]>([]);
const ACTIVE_MEMBRES = ref<Membre[]>([]);
const AssoService = useAssoService();
const MemberService = useMemberService();
const RoleService = useRoleService();
const UserService = useUserService();
const route = useRoute();
const activeStep = ref(1);
const filter = ref('');
const roles = ref();
const usersNames = reactive<Record<string, string>>({})

onMounted(async () => {
  const idAsso = sessionStorage.getItem('idAsso'); // Récupérer l'ID de l'association actuelle
  const res = await AssoService.getAssociationById(Number(idAsso));
  listeMembres.value = await Promise.all(
    res.associationUsers.map(async element => {
      const member = await MemberService.getMember(element)
      const role = await RoleService.getRole(member.role)
      const user = await UserService.getUser(member.user)
      return { ...user, role: role, member_id:member.id }
    })
  )
  const membersRole = await Promise.all(
    res.associationUsers.map(async element => {
      const member = await MemberService.getMember(element)
      const role = await RoleService.getRole(member.role)
      console.log(role)
      return {"id":role.id,"role":role.name,} 
    })
  );
  // roles.value = membersRole.filter(onlyUnique)
  roles.value = Array.from(
    new Map(
      membersRole.map(role => [role.id, role])
    ).values())
  // listeMembres.value = await AssoService.getMembersByAssoId(Number(idAsso)); // Récupérer les membres de l'association par son ID
  allUsers.value = await UserService.getUsers(); // Récupérer tous les membres de la BDD
  membres.value = allUsers.value?.member.filter((user) => !listeMembres.value.some((member) => member.id === user.id));
  ACTIVE_MEMBRES.value = listeMembres.value.filter((membre) => membre.est_actif);
  // console.log(listeMembres.value.filter((membre) => console.log("TEST", new Date(membre.date_adhesion))));
  // console.log(listeMembres.value.filter((membre) => new Date(membre.date_adhesion) > new Date( new Date().getFullYear(), new Date().getMonth() - 1, new Date().getDate())))
});
function onlyUnique(value, index, array) {
  return array.indexOf(value) === index;
}
// CHANGER LES VALEURS DANS LES PAGES QUAND CHANGEMENT D'ASSO
watch(() => route.params.id, async (newId) => {
    const id = newId ? Number(newId) : null;
    const idAsso = sessionStorage.getItem('idAsso'); // Récupérer l'ID de l'association actuelle
    if (id == Number(idAsso)) {
      listeMembres.value = await AssoService.getMembersByAssoId(Number(idAsso)); // Récupérer les membres de l'association par son ID
    }
});

const toast = useToast();
const membres = ref<Membre[]>([]);
const membre = ref<Membre>({});
const addMembreDialog = ref(false);
const editMembreDialog = ref(false);
const deleteProductDialog = ref(false);
const deleteProductsDialog = ref(false);
const selectedUsers = ref([]);
const allUsers = ref<Membre[]>();
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

  const jsonOutput =  selectedUsers.value.map((user) => ({
       association:`/api/associations/${sessionStorage.getItem('idAsso')}`,
      user:`/api/users/${user.id}`,
      role:`/api/roles/${user.role.id}`,
    }));
  try {
    console.log(jsonOutput)
    for(const user of jsonOutput){
      await MemberService.addMember(user);
    }
    // const re = await MemberService.addMember(membre);
    // await MemberService.addMember(Number(sessionStorage.getItem('idAsso')), jsonOutput);
    toast.add({
      severity: 'success',
      summary: 'Succès',
      detail: 'Les membres ont été ajoutés avec succès.',
      life: 5000,
    });
    addMembreDialog.value = false;
    // selectedUsers.value = [];
    // listeMembres.value = await AssoService.getMembersByAssoId(Number(sessionStorage.getItem('idAsso')));
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
    await MemberService.deleteMember(Number(membre.value.member_id));
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
    case 'Adhérent':
      return 'user-plus';
    case 'Bénévole':
      return 'user';
    case 'Président':
      return 'key';
    case 'Secrétaire':
      return 'file';
    case 'Trésorier':
      return 'wallet';
    default:
      return 'user';
  }
};
</script>
