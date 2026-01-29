import axiosInstance from '@/config/AxiosConfig';
import { BaseApiUrl,BaseApiUrlLine, BaseApiUrlUsers, BaseApiUrlTresories, BaseApiUrlBudgets, BaseApiUrlActions, BaseApiUrlDocuments, BaseApiUrlRole, BaseApiUrlTransactionType } from '@/constants/ApiUrls';

export function useLinesApi() {
  return {
    async addLines(data:any) {
      const res = await axiosInstance.post(`${BaseApiUrlLine}`, data, {headers: {'Content-Type': 'application/ld+json', 'Accept': 'application/ld+json'}
      });
      return res.data;
    },
    async getLine(url:string) {
      const res = await axiosInstance.get(`${BaseApiUrl}${url}`, {headers: {'Content-Type': 'application/ld+json', 'Accept': 'application/ld+json'}});
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
