import axiosInstance from '@/config/AxiosConfig';
import { BaseApiUrl,BaseApiUrlBudget, BaseApiUrlUsers, BaseApiUrlTresories, BaseApiUrlBudgets, BaseApiUrlActions, BaseApiUrlDocuments, BaseApiUrlRole, BaseApiUrlTransactionType } from '@/constants/ApiUrls';
import axios from 'axios';

export function useBudgetApi() {
  return {
    async addBudget(data:any) {
      const res = await axiosInstance.post(`${BaseApiUrlBudget}`, data, {headers: {'Content-Type': 'application/ld+json', 'Accept': 'application/ld+json'}
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
    async getTypes(){
        const res = await axiosInstance.get(`${BaseApiUrlTransactionType}`);
        return res.data;
    }
  }
}
