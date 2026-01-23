import { useEventApi } from './EventAPI';

const EventApi = useEventApi();

export function useEventService() {
  return {
    async addEvent(data: any) {
      try {
        const response = await EventApi.addEvent(data);
        if (response) {
          return response;
        } else {
          return "Échec de l'ajout de l'évènement.";
        }
      } catch (error) {
        console.error("Erreur lors de l'ajout de l'évènement  :", error);
        return "Erreur lors de l'ajout de l'évènement.";
      }
    },

 async getEventsByAssoId(id: number) {
      try {
        const response = await EventApi.getEventsByAssoId(id);
        if (response) {
          return response;  // Retourne les transactions de la trésorerie si l'appel est réussi
        } else {
          return 'Aucun évènement trouvé.';
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des évènements :', error);
        return 'Erreur lors de la récupération des évènements.';
      }
    },
    async getEventsByTypeByAssoId(id:number, type:string){
      try {
        const response = await EventApi.getEventsByTypeByAssoId(id, type);
        if(response){
          return response;
        } else {
          return 'Aucun évènement trouvé.'
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des évènements :', error);
        return 'Erreur lors de la récupération des évènements.';
      }
    },
    async addParticipantsToEvent(id:number, data:any){
      try {
        const response = await EventApi.addParticipantsToEvent(id, data);
        if (response){
          return response;
        } else {
          return 'Aucun évènement trouvé.';
        }
      } catch (error) {
        console.error("Erreur lors de l'ajout des participants", error);
        return "Erreur lors de l'ajout des participants";
      }
    },
    async deleteEvent(id:number){
      try {
        const response = await EventApi.deleteEvent(id);
        if(response){
          return response
        } else {
          return 'Erreur dans la suppression'
        }
      }catch (error) {
        console.error("Erreur lors de la suppression", error);
        return "Erreur lors de la suppression";
      }
    },
     async updateEvent(id: number, updatedEvent: any) {
      try {
        const response = await EventApi.editEvent(id, updatedEvent);
        return response;  // Retourne un message de succès
      } catch (error) {
        console.error('Erreur lors de la mise à jour de l\'evenement :', error);
        return 'Erreur lors de la mise à jour de l\'evenement.';
      }
    },
  };
}
