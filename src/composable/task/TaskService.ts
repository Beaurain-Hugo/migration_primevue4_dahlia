import { useTaskApi } from './TaskAPI';

const taskApi = useTaskApi();

export function useTaskService() {
  return {
   async addTask(data:any) {
      try {
        const response = await taskApi.addTask(data);
        console.log('test response',response);
        if (response) {
          return response;  
        } else {
          return 'Échec de la création du compte. Vérifiez les informations saisies.';
        }
      } catch (error) {
        console.error('Erreur lors de la création du compte utilisateur :', error);
        return 'Une erreur est survenue lors de la création du compte. Veuillez réessayer plus tard.';
      }
    },
    async getTask(url:string){
        try {
            const response = await taskApi.getTask(url);
            if(response){
                return response
            } else {
                return 'Action non trouvé';
            }
        } catch (error){
              console.error('Erreur lors de la récupération de l\'utilisateur :', error);
            return 'Erreur lors de la récupération des données utilisateur.';
        }
    },
    async getTasksByAssoId(AssoId:number){
        try {
            const response = await taskApi.getTasksByAssoId(AssoId);
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
     async patchTask(id:number, data:any){
        try {
            const response = await taskApi.patchTask(id, data);
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
    async deleteTask(id:number){
        try {
            const response = await taskApi.deleteTask(id);
            if(response){
                return response
            }
        } catch(error){
            console.error('Erreur lors de la récupération de l\'utilisateur :', error);
            return 'Erreur lors de la récupération des données utilisateur.';
        }
    }
  };
}
