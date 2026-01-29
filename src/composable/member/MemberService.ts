import { useMemberApi } from './MemberAPI';

const MemberApi = useMemberApi();

export function useMemberService() {
  return {
    async getMember(url:string){
      try {
        const response = await MemberApi.getMember(url);
        return response;
      } catch (error) {
        console.error("Erreur lors de la récupération du membre :", error);
        return "Erreur lors de la récupération du membre.";
      }
    },
    async updateMember(id: number, updatedMember: any) {
      try {
        const response = await MemberApi.updateMember(id, updatedMember);
        return response; // Retourne un message de succès
      } catch (error) {
        console.error("Erreur lors de la mise à jour de l'association :", error);
        return "Erreur lors de la mise à jour de l'association.";
      }
    },
    async addMember(data: any) {
      try {
        const response = await MemberApi.addMember(data);
        if (response.id) {
          return `Membre ajouté avec succès. ID: ${response}`;
        } else {
          return "Échec de l'ajout des membres.";
        }
      } catch (error) {
        console.error("Erreur lors de l'ajout des membres  :", error);
        return "Erreur lors de l'ajout des membres.";
      }
    },
    async deleteMember(id: number){
      try {
        const response = await MemberApi.deleteMember(id);
        if(response){
          return `Membre supprimé avec succès`
        } else {
          return `Echec de la suppression du membre`
        }
      } catch (error) {
        console.error("Erreur lors de la suppression du membre  :", error);
        return "Erreur lors de la suppression du membre.";
      }
    },
    async deleteMembers(data: any){
      console.log(data);
      try {
        const response = await MemberApi.deleteMembers(data);
        if(response){
          return `Membres suppprimés avec succès`
        } else {
          return `Echec de la suppression des membres`
        }
      } catch (error) {
        console.error("Erreur lors de la suppression des membres  :", error);
        return "Erreur lors de la suppression des membres.";
      }
    }
  };
}
