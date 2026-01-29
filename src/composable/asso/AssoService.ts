import { AnyARecord } from 'dns';
import { useAssoApi } from './AssoAPI';

const assoApi = useAssoApi();

export function useAssoService() {
  return {
    async getAssociationById(id: number) {
      try {
        const response = await assoApi.getAssociationById(id);
        if (response) {
          return response;  // Retourne les données de l'association si l'appel est réussi
        } else {
          return 'Association non trouvée.';
        }
      } catch (error) {
        console.error('Erreur lors de la récupération de l\'association :', error);
        return 'Erreur lors de la récupération des données de l\'association.';
      }
    },
    async getAssociationsByCp(cp: number) {
      try {
        const response = await assoApi.getAssociationsByCp(cp);
        if (response) {
          return response;  // Retourne les données de l'association si l'appel est réussi
        } else {
          return 'Association non trouvée.';
        }
      } catch (error) {
        console.error('Erreur lors de la récupération de l\'association :', error);
        return 'Erreur lors de la récupération des données de l\'association.';
      }
    },

    async getTresorerieByAssoId(id: number) {
      try {
        const response = await assoApi.getTresorerieByAssoId(id);
        if (response) {
          return response;  // Retourne les transactions de la trésorerie si l'appel est réussi
        } else {
          return 'Aucune transaction trouvée.';
        }
      } catch (error) {
        console.error('Erreur lors de la récupération de la trésorerie :', error);
        return 'Erreur lors de la récupération des transactions de trésorerie.';
      }
    },

    async getMembersByAssoId(id: number) {
      try {
        const response = await assoApi.getMembersByAssoId(id);
        if (response) {
          return response;  // Retourne la liste des membres si l'appel est réussi
        } else {
          return 'Aucun membre trouvé.';
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des membres :', error);
        return 'Erreur lors de la récupération des membres de l\'association.';
      }
    },
    async getMemberInfoByAssoId(user_id: number, asso_id: number) {
      try {
        const response = await assoApi.getMemberInfoByAssoId(user_id, asso_id);
        if (response) {
          return response;  // Retourne la liste des membres si l'appel est réussi
        } else {
          return 'Aucun membre trouvé.';
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des membres :', error);
        return 'Erreur lors de la récupération des membres de l\'association.';
      }
    },

    async updateAssociation(id: number, updatedAsso: any) {
      try {
        const response = await assoApi.updateAssociation(id, updatedAsso);
        return response;  // Retourne un message de succès
      } catch (error) {
        console.error('Erreur lors de la mise à jour de l\'association :', error);
        return 'Erreur lors de la mise à jour de l\'association.';
      }
    },

    async createAssociation(data: any) {
      try {
        const response = await assoApi.createAssociation(data);
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
    async getAllAssociations(id: number) { // récupère les associations d'un utilisateur par son ID
      try {
        const response = await assoApi.getAllAssociations(id);
        if (response) {
          return response;
        } else {
          return 'Échec de la recupereation association.';
        }
      } catch (error) {
        console.error('Erreur lors de la recupereation des associations :', error);
        return 'Erreur lors de la création de l\'association.';
      }
    },
    async saveTresorieAsso(data: any) {
      try {
        const response = await assoApi.saveTresorieAsso(data);
        if (response && response.id_association) {
          return `Tresorie créée avec succès. ID: ${response.id}`;
        } else {
          return 'Échec de la création de la tresorie.';
        }
      } catch (error) {
        console.error('Erreur lors de la création de la tresorie :', error);
        return 'Erreur lors de la création de la tresorie.';
      }
    },
    async getAllTresorieByAssociations(id: number) {
      try {
        const response = await assoApi.getAllTresorieByAssociations(id);
        if (response) {
          return response;
        } else {
          return 'Échec de la recupereation tresorie.';
        }
      } catch (error) {
        console.error('Erreur lors de la recupereation de la tresorie :', error);
        return 'Erreur lors de la création de la Tresorie.';
      }
    },
    async getAllAssociation() { // récupère toutes les associations
      try {
        const response = await assoApi.getAllAssociation();
        if (response) {
          return response;
        } else {
          return 'Échec de la recupereation association.';
        }
      } catch (error) {
        console.error('Erreur lors de la recupereation des associations :', error);
        return 'Erreur lors de la création de l\'association.';
      }
    },
    async addBudget(id:number, data:any){
      try {
        const response = await assoApi.addBudget(id, data);
        if(response){
          return response;
        } else {
          return "Echec de l'ajout du budget";
        }
      } catch (error) {
        console.error("Erreur lors de l'ajout du budget :", error);
        return "Erreur lors de l'ajout du budget.";
      }
    },
     async getBudgetSuivi(id:number) { // récupère toutes les associations
      try {
        const response = await assoApi.getBudgetSuivi(id);
        if (response) {
          return response;
        } else {
          return 'Échec de la recupereation du suivi du budget.';
        }
      } catch (error) {
        console.error('Erreur lors de la recupereation du suivi du budget :', error);
        return 'Erreur lors de la récupération du suivi du budget.';
      }
    },
    async getAllbudgetsByAsso(id:number) { // récupère toutes les associations
      try {
        const response = await assoApi.getAllbudgetsByAsso(id);
        if (response) {
          return response;
        } else {
          return 'Échec de la recupereation des budgets.';
        }
      } catch (error) {
        console.error('Erreur lors de la recupereation des budgets :', error);
        return 'Erreur lors de la récupération des budgets.';
      }
    },
     async addActions(id:number, data:any){
      try {
        const response = await assoApi.addActions(id, data);
        if(response){
          return response;
        } else {
          return "Echec de l'ajout des actions";
        }
      } catch (error) {
        console.error("Erreur lors de l'ajout des actions :", error);
        return "Erreur lors de l'ajout des actions.";
      }
    },
     async getActionsByAssoId(id:number) { // récupère toutes les associations
      try {
        const response = await assoApi.getActionsByAssoId(id);
        if (response) {
          return response;
        } else {
          return 'Échec de la recupereation des actions.';
        }
      } catch (error) {
        console.error('Erreur lors de la recupereation des actions :', error);
        return 'Erreur lors de la récupération des actions.';
      }
    },
    async deleteActionById(id:number) { // récupère toutes les associations
      try {
        const response = await assoApi.deleteActionById(id);
        if (response) {
          return response;
        } else {
          return 'Échec de la suppression de l\'action.';
        }
      } catch (error) {
        console.error('Erreur lors de la suppression de l\'action :', error);
        return 'Erreur lors de la suppression de l\'action.';
      }
    },
     async updateAction(id: number, updatedAction: any) {
      try {
        const response = await assoApi.editActionById(id, updatedAction);
        return response;  // Retourne un message de succès
      } catch (error) {
        console.error('Erreur lors de la mise à jour de l\'action :', error);
        return 'Erreur lors de la mise à jour de l\'action.';
      }
    },
      async addDocuments(data:any){
      try {
        const response = await assoApi.addDocuments(data);
        if(response){
          return response;
        } else {
          return "Echec de l'ajout du document";
        }
      } catch (error) {
        console.error("Erreur lors de l'ajout du document :", error);
        return "Erreur lors de l'ajout du document.";
      }
    },
     async getDocumentById(id:number) { // récupère toutes les associations
      try {
        const response = await assoApi.getDocumentById(id);
        if (response) {
          return response;
        } else {
          return 'Échec de la recupereation du document.';
        }
      } catch (error) {
        console.error('Erreur lors de la recupereation du document :', error);
        return 'Erreur lors de la récupération du document.';
      }
    },
  };
}
