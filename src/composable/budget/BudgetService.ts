import { AnyARecord } from 'dns';
import { useBudgetApi } from './BudgetAPI';

const budgetApi = useBudgetApi();

export function useBudgetService() {
  return {
      async addBudget(data: any) {
      try {
        const response = await budgetApi.addBudget(data);
        if (response && response.id) {
          return `${response.id}`;
        } else {
          return 'Échec de la création de l\'association.';
        }
      } catch (error) {
        console.error('Erreur lors de la création de l\'association :', error);
        return 'Erreur lors de la création de l\'association.';
      }
    },
    async getBudgetById(id: number) {
      try {
        const response = await budgetApi.getBudgetById(id);
        if (response) {
          return response; // Retourne les données utilisateur si l'appel est réussi
        } else {
          return 'Utilisateur non trouvé.'; // Gestion d'erreur : aucune donnée renvoyée
        }
      } catch (error) {
        console.error('Erreur lors de la récupération de l\'utilisateur :', error);
        return 'Erreur lors de la récupération des données utilisateur.';
      }
    },
     async getBudgetsByIdAsso(id: number) {
      try {
        const response = await budgetApi.getBudgetsByAssoId(id);
        if (response) {
          return response.member; // Retourne les données utilisateur si l'appel est réussi
        } else {
          return 'Utilisateur non trouvé.'; // Gestion d'erreur : aucune donnée renvoyée
        }
      } catch (error) {
        console.error('Erreur lors de la récupération de l\'utilisateur :', error);
        return 'Erreur lors de la récupération des données utilisateur.';
      }
    },
    async getRoles() {
      try {
        const response = await roleApi.getRoles();
        if (response) {
          return response.member; // Retourne les données utilisateur si l'appel est réussi
        } else {
          return 'Utilisateur non trouvé.'; // Gestion d'erreur : aucune donnée renvoyée
        }
      } catch (error) {
        console.error('Erreur lors de la récupération de l\'utilisateur :', error);
        return 'Erreur lors de la récupération des données utilisateur.';
      }
    },
  };
}
