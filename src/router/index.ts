import { createRouter, createWebHistory } from 'vue-router';
import App from '@/App.vue';
import UserModel from '@/models/UserModel';
import { defineAsyncComponent, ref } from 'vue';
import { useUserService } from '@/composables/user/UserService';

const userService = useUserService();
const user = ref<UserModel | null>(null);

// Définir le composant de manière asynchrone
const TableauDeBord = defineAsyncComponent(() =>
  import('@/views/TableauDeBord.vue')
);

const AssoDetail = defineAsyncComponent(() => import('@/views/asso-detail.vue'));
const TresoDetail = defineAsyncComponent(() => import('@/views/asso-tresorerie.vue'));
const AssoReu = defineAsyncComponent(() => import('@/views/asso-reunions.vue'));
const AssoPlanning = defineAsyncComponent(() => import('@/views/asso-planning.vue'));
const Profil = defineAsyncComponent(() => import('@/views/profil.vue'));
const AssoActions = defineAsyncComponent(() => import('@/views/asso-actions.vue'));


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'app',
      component: App,
      children: [
        {
          path: '/',
          name: 'accueil',
          meta: {layout: "no-sidebar"},
          component: () => import('@/views/Accueil.vue'),
        },
        {
          path: '/tableau-de-bord',
          name: 'tableau-de-bord',
          component: TableauDeBord,
          meta: { requiresAuth: true },
        },
        {
          path: '/asso-detail',
          name: 'asso-detail',
          component: AssoDetail,
          meta: { requiresAuth: true },
        },
        {
          path: '/asso-reunion/:id',
          name: 'asso-reunion',
          component: AssoReu,
          meta: { 
            requiresAuth: true,
            title:"Gestion des réunions",
            subtitle:"Gérez vos réunions et créez facilement vos comptes-rendus"
          },
        },
        {
          path: '/asso-benevoles/:id',
          name: 'asso-benevoles',
          component: () => import('@/views/asso-benevole.vue'),
          meta: { 
            requiresAuth: true,
             title: "Gestion des adhérents",
              subtitle:"Gérez les adhésions et bénévoles de votre association"
          },
        },
        {
          path: '/tresorerie-detail/:id',
          name: 'tresorerie-detail',
          component: TresoDetail,
          meta: { 
            requiresAuth: true,
            title: "Finances & Budgets",
            subtitle:"Suivez votre situation financière et optimisez votre gestion"
          },
        },
        {
          path: '/asso-actions/:id',
          name: 'asso-actions',
          component: AssoActions,
          meta: { 
            requiresAuth: true,
            title: "Gestion des tâches",
            subtitle:"Créez et attribuez des tâches aux membres de votre association"
          },
        },
        {
          path: '/asso-planning/:id',
          name: 'asso-planning',
          component: AssoPlanning,
          meta: { 
            requiresAuth: true,
            title: "Calendrier",
            subtitle:"Gérez ici vos réunions, évènements et autres"
          },
        },
        {
          path: '/mon-profil/',
          name: 'profil',
          component: Profil,
          meta: { 
            requiresAuth: true,
            title: "Mon compte",
            subtitle:"Gérez vos informations personnelles et vos préférences"
          },
        },
        {
          path: '/asso-search-detail/:id',
          name: 'asso-search-detail',
          component: () => import('@/views/asso-search-detail.vue'),
        },
      ],
    },
    {
      path: '/:notFound(.*)',
      redirect: '/',
      meta: {layout: "no-sidebar"},
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginUser.vue'),
    },
    {
      path: '/signup',
      name: 'signup',
      component: () => import('@/views/SignUpUser.vue'),
    },
  ],
});

export function isAuthenticated() {
  return !!sessionStorage.getItem('jwt'); // Vérifie si un token JWT est stocké
}

router.beforeEach(async (to, from, next) => {
  // Vérifie si la route requiert une authentification
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!isAuthenticated()) {
      // Si l'utilisateur n'est pas connecté, redirige vers la page de connexion
      next({ name: 'login' });
    } else {
      // Si l'utilisateur est authentifié, charge les données de l'utilisateur
      await fetchData();
      next();
    }
  } else {
    // Si aucune authentification n'est nécessaire, continue normalement
    next();
  }
});

async function fetchData() {
  const jwt = sessionStorage.getItem('jwt');
  if (jwt) {
    try {
      const userData = await userService.getUserById(Number(jwt));
      user.value = userData;
      console.log('Utilisateur connecté:', user.value);
    } catch (error) {
      console.error('Erreur lors de la récupération des données utilisateur:', error);
      user.value = null; // En cas d'erreur, réinitialise l'utilisateur
    }
  } else {
    user.value = null; // Aucun utilisateur n'est connecté
  }
}

export default router;
