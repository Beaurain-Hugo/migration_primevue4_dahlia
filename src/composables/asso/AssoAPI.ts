import axiosInstance from '@/config/AxiosConfig';
import { ApiUrlAssos, ApiUrlUsers, ApiUrlTresories, ApiUrlBudgets, ApiUrlActions, ApiUrlDocuments } from '@/constants/ApiUrls';
import axios from 'axios';

export function useAssoApi() {
  return {
    async getAssociationById(id: number) {
      const res = await axiosInstance.get(`${ApiUrlAssos}/id/${id}`);
      return res.data.body;
    },
    async getAssociationsByCp(cp: number) {
      const res = await axiosInstance.get(`${ApiUrlAssos}/cp/${cp}`);
      return res.data.body;
    },

    async getTresorerieByAssoId(id: number) {
      const res = await axiosInstance.get(`${ApiUrlAssos}/${id}/tresorerie`);
      return res.data.body;
    },

    async getMembersByAssoId(id: number) {
      const res = await axiosInstance.get(`${ApiUrlAssos}/${id}/membres`);
      return res.data.body;
    },

    async updateAssociation(id: number, updatedAsso: any) {
      const res = await axiosInstance.put(`${ApiUrlAssos}/update/${id}`, updatedAsso);
      return res.data.message;
    },

    async createAssociation(data: any) {
      const res = await axiosInstance.post(`${ApiUrlAssos}/add`, data);
      return res.data.body;
    },
    async getAllAssociations(id: number) {
      const res = await axiosInstance.get(`${ApiUrlUsers}/${id}/associations`);
      return res.data.body;
    },
    async saveTresorieAsso(data: any){
      const res = await axiosInstance.post(`${ApiUrlTresories}/add`, data);
      return res.data.body;
    },
    async getAllTresorieByAssociations(id: number){
      const res = await axiosInstance.get(`${ApiUrlAssos}/${id}/tresorerie`);
      return res.data.body;
    },
    async getAllAssociation(){
      const res = await axiosInstance.get(`${ApiUrlAssos}`);
      return res.data.body;
    },
    async addBudget(id:number, data:any){
      const res = await axiosInstance.post(`${ApiUrlAssos}/${id}/add/budget`, data);
      return res.data.body;
    },
    async getBudgetSuivi(id:number){
      const res = await axiosInstance.get(`${ApiUrlBudgets}/${id}/suivi`);
      return res.data.body;
    },
    async getAllbudgetsByAsso(id:number){
      const res = await axiosInstance.get(`${ApiUrlAssos}/${id}/budgets`);
      return res.data.body;
    },
    async addActions(id:number, data:any){
      const res = await axiosInstance.post(`${ApiUrlAssos}/${id}/add/actions`, data);
      return res.data.body;
    },
    async getActionsByAssoId(id:number){
      const res = await axiosInstance.get(`${ApiUrlAssos}/${id}/actions`);
      return res.data.body;
    },
    async deleteActionById(id:number){
      const res = await axiosInstance.delete(`${ApiUrlActions}/delete/${id}`);
      return res.data.body;
    },
    async editActionById(id:number, data:any){
      const res = await axiosInstance.put(`${ApiUrlActions}/update/${id}`, data);
      return res.data.message;
    },
    async addDocuments(data:any){
      const res = await axiosInstance.post(`${ApiUrlDocuments}/add`, data);
      return res.data.body;
    },
    async getDocumentById(id:number){
      // return await axiosInstance.get(`${ApiUrlDocuments}/${id}`, { responseType: 'blob' });
        const res = await axiosInstance.get(`${ApiUrlDocuments}/${id}`, { responseType: 'blob' });

       // Extraire le nom du fichier depuis les headers
  let filename = "document.pdf";
  const contentDisposition = res.headers["content-disposition"];
  if (contentDisposition) {
    const match = contentDisposition.match(/filename="(.+)"/);
    if (match) filename = match[1];
  }

  return { blob: res.data, filename };
    },
  };
}
