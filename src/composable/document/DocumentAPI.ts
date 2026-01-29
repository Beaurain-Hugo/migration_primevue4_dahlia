import axiosInstance from '@/config/AxiosConfig';
import { BaseApiUrlDocument,BaseApiUrlBudget, BaseApiUrl, BaseApiUrlTresories, BaseApiUrlBudgets, BaseApiUrlActions, BaseApiUrlDocuments, BaseApiUrlRole, BaseApiUrlTransactionType } from '@/constants/ApiUrls';
import axios from 'axios';

export function useDocumentApi() {
  return {
    async addDocument(data:any) {
      const res = await axiosInstance.post(`${BaseApiUrlDocument}`, data, {headers: {'Content-Type': 'application/ld+json', 'Accept': 'application/ld+json'}
      });
      return res.data;
    },
    async getBudgetById(id:number) {
      const res = await axiosInstance.get(`${BaseApiUrlBudget}/${id}`);
      return res.data;
    },
    async getBudgetsByAssoId(IdAsso:number) {
      const res = await axiosInstance.get(`${BaseApiUrlBudget}?association.id=${IdAsso}`);
      return res.data;
    },
    async getDocument(id:string){
        const res = await axiosInstance.get(`${BaseApiUrl}${id}`, {headers: {'Content-Type': 'application/ld+json', 'Accept': 'application/ld+json'}});
        return res.data;
    }
  }
}
