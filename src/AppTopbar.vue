<template>
  <div class="bg-white w-11/12 absolute shadow-xl flex justify-between mt-3 rounded-xl left-1/2 -translate-x-1/2">
    <!-- <button class="p-link layout-menu-button layout-topbar-button" @click="onMenuToggle">
      <em :class="iconeBouton"></em>
    </button> -->
    <router-link to="/" class="layout-topbar-logo">
      <img class="text-black w-4/5" alt="Logo Aide Asso" src="/Logo-Dahlia.svg" />
    </router-link>

    <!-- <div class="flex justify-center ml-8">
      <AutoComplete v-model="associationSelected" optionLabel="nom" placeholder="Chercher une association ..."
        :suggestions="associationFiltred" @complete="search">
        <template #option="slotProps">
          <router-link :to="`/asso-search-detail/${slotProps.option.id}`">
            <div class="flex items-center space-x-2">
              <img v-if="slotProps.option.logo" :src="'data:image/png;base64,' + slotProps.option.logo"
                :alt="slotProps.option.nom" style="width: 15px;" class="mr-3" />
              <div class="text-lg font-medium">{{ slotProps.option.nom }}</div> <!-- Texte plus grand 
            </div>
          </router-link>


        </template>
        <template #header>
          <div class="font-medium px-3 py-2">Associations disponible</div>
        </template>
      </AutoComplete>
    </div> -->
    <!-- <button
      class="p-link layout-topbar-menu-button layout-topbar-button"
      v-styleclass="{
        selector: '@next',
        enterClass: 'hidden',
        enterActiveClass: 'scalein',
        leaveToClass: 'hidden',
        leaveActiveClass: 'fadeout',
        hideOnOutsideClick: true,
      }"
    >
      <em class="pi pi-ellipsis-v"></em>
    </button> -->
    <ul class="m-auto flex gap-5">
      <!-- <li>
        <div class="layout-topbar-button" :class="{ 'w-6rem border-radius-2rem': windowInnerWidth >= 992 }">
          <em class="fas fa-moon" :class="{ 'mr-2': windowInnerWidth >= 992 }"></em>
          <InputSwitch v-model="themeSombreActive" @change="changerTheme" />
        </div>
      </li> -->
      <!-- <li>
        <router-link to="/admin">
          <div class="p-link layout-topbar-button">
            <em class="fas fa-cog"></em>
            <span>Paramètres</span>
          </div>
        </router-link>
      </li> -->
      <li>
        <div>À propos</div>
      </li>
      <li>
        <div>FAQ</div>
      </li>
      <li>
        <div>Nous contacter</div>
      </li>
     
    </ul>
    <ul class="flex m-auto">
     <li>
        <!-- Content for logged-in user -->
         <PButton variant="text" :pt="{root:'hover:!text-main !text-black'}" @click="connectDialog= true" label="Se connecter"/>
      
      </li>
    <li>  <PButton :pt="{root:'border-none !bg-main'}" @click="signupDialog = true" label="S'inscrire"/>
</li>
      </ul>
    <PDialog v-model:visible="signupDialog" header="Créer un compte" modal>
      <template #header>
        <span class="text-transparent bg-gradient-to-r from-main to-second bg-clip-text m-auto text-3xl font-bold">Créer un compte</span>
      </template>
       <div class="flex flex-col gap-4">
        <div class="flex flex-col p-4 border-2 bg-gradient-to-r from-[#FFEDE2] to-purple-50 rounded-xl border-[#FC82A4]/20">
            <div class="text-main">
              <span class="pi pi-user border-2 rounded-full p-1 border-main"></span>
              <span class="font-bold"> Rejoignez Dahlia</span>
            </div>
            <span>Après votre inscription, vous pourrez rejoindre une association existante ou créer la vôtre.</span>
        </div>
        <div class="flex gap-2">
          <div class="w-1/2">
            <label for="lastname">Nom</label>
            <InputText :pt="{root:'!bg-[#F0F0F0] !shadow'}" fluid id="lastname" v-model="nom" placeholder="Dupont" />
          </div>
           <div class="w-1/2">
            <label for="firstname">Prénom</label>
            <InputText id="firstname" :pt="{root:'!bg-[#F0F0F0] !shadow'}" fluid v-model="prenom" placeholder="Dupont" />
          </div>
        </div>
         <div>
            <label for="email">Email</label>
            <InputText id="email" :pt="{root:'!bg-[#F0F0F0] !shadow'}" fluid v-model="mail" placeholder="Dupont" />
          </div>
          <div>
            <label for="password">Mot de passe</label>
            <Password inputId="password" :pt="{pcInputText:{root:'!bg-[#F0F0F0] !shadow'}}" fluid v-model="password" />
          </div>
          <div>
            <label for="password_confirm">Confirmez votre mot de passe</label>
            <Password inputId="password_confirm" :pt="{pcInputText:{root:'!bg-[#F0F0F0] !shadow'}}" fluid v-model="password_confirmation" />
          </div>
      <PButton fluid :pt="{root:'shadow-lg border-none !bg-gradient-to-r from-main to-second'}" label="Créer mon compte" @click="signup" />
      <div class="flex flex-col">  
        <span class="text-center">En vous inscrivant, vous acceptez nos conditions d'utilisation</span>
        <span class="text-center text-main">Déja inscrit ? <PButton class="!text-main p-0 underline" label="Connectez-vous" link @click="signupDialog = false; connectDialog = true" /></span>
      </div>
  </div>
    </PDialog>
    <PDialog v-model:visible="connectDialog" header="Se connecter" modal>
       <template #header>
        <span class="text-transparent bg-gradient-to-r from-main to-second bg-clip-text m-auto text-3xl font-bold">Se connecter</span>
      </template>
       <div class="flex flex-col gap-4">
         <div>
            <label for="email">Email</label>
            <InputText id="email" :pt="{root:'!bg-[#F0F0F0] !shadow'}" fluid v-model="mail" placeholder="Dupont" />
          </div>
          <div>
            <label for="password">Mot de passe</label>
            <Password inputId="password" :pt="{pcInputText:{root:'!bg-[#F0F0F0] !shadow'}}" fluid v-model="password" />
          </div>
      <PButton fluid :pt="{root:'shadow-lg border-none !bg-gradient-to-r from-main to-second'}" label="Se connecter" @click="login" />
      <div class="flex flex-col">  
        <span class="text-center text-main">Pas encore de compte ? <PButton class="!text-main p-0 underline" label="Inscrivez-vous" link @click="connectDialog=false; signupDialog = true;" /></span>
      </div>
  </div>
    </PDialog>
    <Toast />
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import EventBus from '@/AppEventBus';
// import { useUserService } from '@/composables/user/UserService';
import { useUserService } from '@/composable/user/UserService'; // Assurez-vous d'importer correctement votre service utilisateur
import UserModel from './models/UserModel';
import { useRoute, useRouter } from 'vue-router';
import { MenuItem } from 'primevue/menuitem';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import { Association } from '@/models/AssociationModel';
import { useAssoService } from './composables/asso/AssoService';

const confirm = useConfirm();
const associationService = useAssoService();
const toast = useToast();
const route = useRoute();
const router = useRouter();
const signupDialog = ref(false)
const connectDialog = ref(false)
const userService = useUserService();
const user = ref<UserModel | null>(null);
const photo = ref();
const isHomePage = ref(route.name === 'tableau-de-bord');
const jwt = ref(false);
const op = ref();
const userR = ref();
const password = ref('');
const nom = ref('');
const prenom = ref('');
const mail = ref('');
const password_confirmation = ref('');
const isActive = ref(true);
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

function addEmail(suffix: string) {
  mail.value += suffix;
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
      photo.value = data;
      console.log(photo.value);
    }
  };

  // Lire le contenu du fichier en tant que Blob
  reader.readAsDataURL(file);
}

async function signup() {
  if(password.value === password_confirmation.value){
    const response = await userService.createUserAccount(prenom.value, nom.value, mail.value, password.value);
    console.log(response);
    if (response == true) {
      toast.add({ severity: 'success', summary: 'Succès', detail: 'Vous êtes connecté', life: 3000 });
      router.push('/tableau-de-bord');
    } else {
      toast.add({ severity: 'error', summary: 'Erreur', detail: response, life: 3000 });
    }
  } else {
    console.error('salut')
    return'Les mots de passe ne correspondent pas';
  }
}

async function login() {
  const response = await userService.loginUser(mail.value, password.value);
  console.log(response);
  if (response == true) {
    toast.add({ severity: 'success', summary: 'Succès', detail: 'Vous êtes connecté', life: 3000 });
    router.push('/tableau-de-bord');
  } else {
    toast.add({ severity: 'error', summary: 'Erreur', detail: response, life: 3000 });
  }
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
      const userData = await userService.getUserById(Number(sessionStorage.getItem('jwt')));
      user.value = userData;
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
  jwt.value = !!sessionStorage.getItem('jwt');
  if (window.localStorage.getItem('dark-mode')) {
    themeSombreActive.value = window.localStorage.getItem('dark-mode') === 'true';
    if (themeSombreActive.value) changerTheme();
  }
  await fetchData();
});

watch(
  () => sessionStorage.getItem('jwt'),
  async () => {
    await fetchData();
  }
);

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
  sessionStorage.removeItem('jwt');
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

</style>
