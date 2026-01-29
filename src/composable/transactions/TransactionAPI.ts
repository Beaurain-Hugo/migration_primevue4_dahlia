import axiosInstance from '@/config/AxiosConfig';
import { BaseApiUrl,BaseApiUrlTransactions, BaseApiUrlUsers, BaseApiUrlTresories, BaseApiUrlBudgets, BaseApiUrlActions, BaseApiUrlDocuments, BaseApiUrlRole, BaseApiUrlTransactionType } from '@/constants/ApiUrls';
import axios from 'axios';

export function useTransactionsApi() {
  return {
    async addTransactions(data:any) {
      const res = await axiosInstance.post(`${BaseApiUrlTransactions}`, data, {headers: {'Content-Type': 'application/ld+json', 'Accept': 'application/ld+json'}
      });
      return res.data;
    },
    async getType(url:string) {
      const res = await axiosInstance.get(`${BaseApiUrl}${url}`);
      return res.data;
    },
    async getTransactionsByAssoId(IdAsso:number) {
      const res = await axiosInstance.get(`${BaseApiUrlTransactions}?association.id=${IdAsso}`);
      return res.data;
    },
    async getTypes(){
        const res = await axiosInstance.get(`${BaseApiUrlTransactionType}`);
        return res.data;
    }
  }
}
