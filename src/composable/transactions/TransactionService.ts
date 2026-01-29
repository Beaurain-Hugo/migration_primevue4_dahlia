import { AnyARecord } from 'dns';
import { useTransactionsApi } from './TransactionAPI';

const transactionsApi = useTransactionsApi();

export function useTransactionService() {
  return {
      async addTransactions(data: any) {
      try {
        const response = await transactionsApi.addTransactions(data);
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
    async getTypes() {
      try {
        const response = await transactionsApi.getTypes();
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
    async getType(url:string) {
      try {
        const response = await transactionsApi.getType(url);
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
    async getTransactionsByAssoId(id:number) {
      try {
        const response = await transactionsApi.getTransactionsByAssoId(id);
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
