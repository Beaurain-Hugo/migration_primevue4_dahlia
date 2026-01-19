import { useEventApi } from './EventAPI';

const EventApi = useEventApi();

export function useEventService() {
  return {
    async addEvent(data: any) {
      try {
        const response = await EventApi.addEvent(data);
        if (response) {
          return `Evènement ajouté avec succès. ID: ${response}`;
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
  };
}
