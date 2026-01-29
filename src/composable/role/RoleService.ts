import { AnyARecord } from 'dns';
import { useRoleApi } from './RoleAPI';

const roleApi = useRoleApi();

export function useRoleService() {
  return {
      async addRole(data: any) {
      try {
        const response = await roleApi.addRole(data);
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
    async getRole(url: string) {
      try {
        const response = await roleApi.getRole(url);
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
