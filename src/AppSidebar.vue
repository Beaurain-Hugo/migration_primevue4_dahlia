<template>
  <nav class="h-[95vh] sticky z-50 top-5 bg-white/50 shadow-lg p-3 rounded-3xl">
    <ul class="flex h-full justify-between flex-col">
    <!-- <button class="p-link layout-menu-button layout-topbar-button" @click="onMenuToggle">
      <em :class="iconeBouton"></em>
    </button> -->
    <li class="group"><router-link class="flex p-3 relative transition-colors duration-300 group-hover:bg-white/75 rounded-xl text-black" to="/tableau-de-bord"><span style="" class="pi text-2xl pi-info-circle"></span><span class="rounded-full transition group-hover:translate-x-0 -translate-x-2 duration-300 opacity-0 group-hover:!opacity-100 group-hover:scale-100 scale-95  group-hover:z-10 absolute left-12 bg-white w-max px-4 py-2">Tableau de bord</span></router-link></li>
    <li class="group"><router-link class="flex p-3 relative transition-colors duration-300 group-hover:bg-white/75 rounded-xl text-black" :to="`/asso-info/${props.idAsso}`"><span style="" class="pi text-2xl pi-info-circle"></span><span class="rounded-full transition group-hover:translate-x-0 -translate-x-2 duration-300 opacity-0 group-hover:!opacity-100 group-hover:scale-100 scale-95  group-hover:z-10 absolute left-12 bg-white w-max px-4 py-2">Informations importantes</span></router-link></li>
    <li class="group"><router-link class="flex p-3 relative transition-colors duration-300 group-hover:bg-white/75 rounded-xl text-black" to="/qsfqsf"><span style="" class="pi text-2xl pi-file"></span><span class="rounded-full transition group-hover:translate-x-0 -translate-x-2 duration-300 opacity-0 group-hover:!opacity-100 group-hover:scale-100 scale-95  group-hover:z-10 absolute left-12 bg-white w-max px-4 py-2">Création association</span></router-link></li>
    <li class="group"><router-link class="flex p-3 relative transition-colors duration-300 group-hover:bg-white/75 rounded-xl text-black" :to="`/asso-reunion/${props.idAsso}`"><span style="" class="pi text-2xl pi-users"></span><span class="rounded-full transition group-hover:translate-x-0 -translate-x-2 duration-300 opacity-0 group-hover:!opacity-100 group-hover:scale-100 scale-95  group-hover:z-10 absolute left-12 bg-white w-max px-4 py-2">Réunions</span></router-link></li>
    <li class="group"><router-link class="flex p-3 relative transition-colors duration-300 group-hover:bg-white/75 rounded-xl text-black" :to="`/asso-planning/${props.idAsso}`"><span style="" class="pi text-2xl pi-calendar"></span><span class="rounded-full transition group-hover:translate-x-0 -translate-x-2 duration-300 opacity-0 group-hover:!opacity-100 group-hover:scale-100 scale-95  group-hover:z-10 absolute left-12 bg-white w-max px-4 py-2">Planning</span></router-link></li>
    <li class="group"><router-link class="flex p-3 relative transition-colors duration-300 group-hover:bg-white/75 rounded-xl text-black" :to="`/asso-actions/${props.idAsso}`"><span style="" class="pi text-2xl pi-list"></span><span class="rounded-full transition group-hover:translate-x-0 -translate-x-2 duration-300 opacity-0 group-hover:!opacity-100 group-hover:scale-100 scale-95  group-hover:z-10 absolute left-12 bg-white w-max px-4 py-2">Tâches à effectuer</span></router-link></li>
    <li class="group"><router-link class="flex p-3 relative transition-colors duration-300 group-hover:bg-white/75 rounded-xl text-black" :to="`/asso-benevoles/${props.idAsso}`"><span style="" class="pi text-2xl pi-user-plus"></span><span class="rounded-full transition group-hover:translate-x-0 -translate-x-2 duration-300 opacity-0 group-hover:!opacity-100 group-hover:scale-100 scale-95  group-hover:z-10 absolute left-12 bg-white w-max px-4 py-2">Adhérents</span></router-link></li>
    <li class="group"><router-link class="flex p-3 relative transition-colors duration-300 group-hover:bg-white/75 rounded-xl text-black" :to="`/asso-administration/${props.idAsso}`"><span style="" class="pi text-2xl pi-file-pdf"></span><span class="rounded-full transition group-hover:translate-x-0 -translate-x-2 duration-300 opacity-0 group-hover:!opacity-100 group-hover:scale-100 scale-95  group-hover:z-10 absolute left-12 bg-white w-max px-4 py-2 ">Suivi administratif</span></router-link></li>
    <li class="group"><router-link class="flex p-3 relative transition-colors duration-300 group-hover:bg-white/75 rounded-xl text-black" :to="`/tresorerie-detail/${props.idAsso}`"><span style="" class="pi text-2xl pi-euro"></span><span class="rounded-full transition group-hover:translate-x-0 -translate-x-2 duration-300 opacity-0 group-hover:!opacity-100 group-hover:scale-100 scale-95  group-hover:z-10 absolute left-12 bg-white w-max px-4 py-2">Trésorerie</span></router-link></li>
    <li class="group"><router-link class="flex p-3 relative transition-colors duration-300 group-hover:bg-white/75 rounded-xl text-black" to="/mon-profil"><span style="" class="pi text-2xl pi-user"></span><span class="rounded-full transition group-hover:translate-x-0 -translate-x-2 duration-300 opacity-0 group-hover:!opacity-100 group-hover:scale-100 scale-95  group-hover:z-10 absolute left-12 bg-white w-max px-4 py-2">Profil</span></router-link></li>
    <li class="sidebar__list-item group">
      <button v-if="user" class="flex items-center p-3 relative transition-colors duration-300 group-hover:bg-white/75 rounded-xl text-red-500" @click="seDeconnecter()">
        <span class="pi pi-sign-out"></span>
        <span class="rounded-full transition group-hover:translate-x-0 -translate-x-2 duration-300 opacity-0 group-hover:!opacity-100 group-hover:scale-100 scale-95  group-hover:z-10 absolute left-12 bg-white w-max px-4 py-2">Se déconnecter</span>
      </button>
      <ConfirmPopup></ConfirmPopup>
    </li>
    </ul>
  </nav>
  <Toast />
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import EventBus from '@/AppEventBus';
import { useUserService } from '@/composable/user/UserService';
import UserModel from './models/UserModel';
import { useRoute } from 'vue-router';
import router from '@/router';
import { MenuItem } from 'primevue/menuitem';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import { AssociationModel } from '@/models/AssociationModel';
import { useAssoService } from './composables/asso/AssoService';

const confirm = useConfirm();
const associationService = useAssoService();
const toast = useToast();
const route = useRoute();
const userService = useUserService();
const user = ref<UserModel | null>(null);
const photo = ref();
const isHomePage = ref(route.name === 'tableau-de-bord');
const jwt = ref(false);
const op = ref();
const userR = ref();
const password = ref('');
const associationListe = ref<Association[]>([]);
const associationSelected = ref<Association>();
const associationFiltred = ref<Association[]>([]);

const menuSidebarIsActive = ref(sessionStorage.getItem("idAsso") ? true : false);
  
const search = (event) => {
  setTimeout(() => {
    if (!event.query.trim().length) {
      associationFiltred.value = [...associationListe.value];
    } else {
      associationFiltred.value = associationListe.value.filter((asso: Association) => {
        return asso.nom.toLowerCase().includes(event.query.toLowerCase());
      });
    }
  }, 250);
}

const home = ref({
  icon: 'pi pi-home',
});
const fileAriane = ref<MenuItem[]>([]);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const toggle = (event: any) => {
  op.value.toggle(event);
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const toggleReglage = (event: any) => {
  userR.value.toggle(event);
};

function formatDate(date: Date) {
  return new Date(date).toLocaleString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

async function fetchData() {
  if (jwt.value) {
    try {
      const userData = await userService.getUserById(Number(localStorage.getItem('id_user')));
      user.value = userData;
      console.log(userData)
      photo.value = user.value.photo;
      console.log('User connected:', user.value);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  } else {
    user.value = null;
  }
}
async function modifUser() {
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const confirmerDeconnexion = (event: any) => {
  confirm.require({
    target: event.currentTarget,
    message: 'Voulez-vous vous déconnecter?',
    icon: 'pi pi-exclamation-triangle',
    rejectClass: 'p-button-secondary p-button-outlined p-button-sm',
    acceptClass: 'p-button-sm',
    rejectLabel: 'Annuler',
    acceptLabel: 'Déconnexion',
    accept: async () => {
      await seDeconnecter();
      toast.add({ severity: 'info', summary: 'Confirmé', detail: 'Déconnexion effectuée', life: 1000 });
    },
    reject: () => {
      toast.add({ severity: 'error', summary: 'Rejeté', detail: 'Déconnexion annulée', life: 1000 });
    },
  });
};

onBeforeUnmount(() => {
  window.removeEventListener('resize', storeWindowInnerWidth);
});

const props = defineProps<{
  staticMenuInactive: boolean;
  mobileMenuActive: boolean;
  idAsso: Number
}>();
const emit = defineEmits<{
  (e: 'menu-toggle', v: Event): void;
  (e: 'topbar-menu-toggle', v: Event): void;
}>();

const windowInnerWidth = ref(window.innerWidth);
window.addEventListener('resize', storeWindowInnerWidth);
const themeSombreActive = ref(false);

const iconeBouton = computed(() => {
  let icone = 'pi pi-times';
  if ((windowInnerWidth.value >= 992 && props.staticMenuInactive) || (windowInnerWidth.value < 992 && !props.mobileMenuActive)) {
    icone = 'pi pi-bars';
  }
  return icone;
});

onMounted(async () => {
    associationListe.value = await associationService.getAllAssociation();
  fileAriane.value = [{ label: route.name?.toString(), to: { path: route.path } }];
  jwt.value = !!localStorage.getItem('id_user');
  if (window.localStorage.getItem('dark-mode')) {
    themeSombreActive.value = window.localStorage.getItem('dark-mode') === 'true';
    if (themeSombreActive.value) changerTheme();
  }
  await fetchData();
});

// watch(props.idAsso, (newId, oldId) => {
//         console.log("watch")  

//     if (newId !== oldId) {
//       // fetchAssociation();
//     }
// });

watch(
  () => route.name,
  (newRouteName) => {
    fileAriane.value = [{ label: newRouteName?.toString(), to: { path: route.path } }];
  }
);



function onMenuToggle(event: Event) {
  emit('menu-toggle', event);
}

function storeWindowInnerWidth() {
  windowInnerWidth.value = window.innerWidth;
}

function changerTheme() {
  EventBus.emit('theme-change', {
    theme: themeSombreActive.value ? 'lara-dark-indigo' : 'lara-light-indigo',
    dark: themeSombreActive.value,
  });
  window.localStorage.setItem('dark-mode', themeSombreActive.value.toString());
}

async function seDeconnecter() {
  if (user.value) {
    user.value = null;
  }
  localStorage.removeItem('id_user');
  localStorage.removeItem('jwt');
  sessionStorage.removeItem('idAsso');
  router.push({ name: 'accueil' });
}

onBeforeUnmount(() => {
  window.removeEventListener('resize', storeWindowInnerWidth);
});
</script>

<style lang="scss" scoped>
.border-radius-2rem {
  border-radius: 2rem !important;
}

.custom-megamenu {
  background-color: inherit;
  border: none;
  /* Récupère la couleur de fond de la Card */
}

.custom-tabmenu {
  display: flex;
  justify-content: space-around;
  font-size: 5rem;
}
.layout-topbar-logo {
  display: flex;
  align-items: left;
  justify-content: left;
  padding: 0.5rem;  /* Un petit espace autour du logo */
}

.logo-image {
  width: auto;         /* Garde les proportions d'origine du logo */
  max-width: 100%;      /* Le logo s'adapte à la taille du conteneur */
  height: 4rem;         /* Définit une hauteur fixe pour le logo */
  object-fit: contain;  /* S'assure que l'image reste contenue dans le conteneur */
}
.router-link-exact-active{
  background: #fc82a4;
}
.router-link-exact-active:hover{
  background: #fc82a4;
}
.router-link-exact-active > .pi{
  color:white;
}

</style>
