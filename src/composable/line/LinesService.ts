import { useLinesApi } from './LinesAPI';

const linesApi = useLinesApi();

export function useLinesService() {
  return {
      async addLines(data: any) {
      try {
        const response = await linesApi.addLines(data);
        if (response) {
          return response;
        } else {
          return 'Échec de la création de l\'association.';
        }
      } catch (error) {
        console.error('Erreur lors de la création de l\'association :', error);
        return 'Erreur lors de la création de l\'association.';
      }
    },
    async getLine(url: string) {
      try {
        const response = await linesApi.getLine(url);
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
