import axiosInstance from '@/config/AxiosConfig';
import { BaseApiUrl,BaseApiUrlAssociations, BaseApiUrlUsers, BaseApiUrlTresories, BaseApiUrlBudgets, BaseApiUrlActions, BaseApiUrlDocuments, BaseApiUrlRole } from '@/constants/ApiUrls';
import axios from 'axios';

export function useRoleApi() {
  return {
    async addRole(data:any) {
      const res = await axiosInstance.post(`${BaseApiUrlRole}`, data, {headers: {'Content-Type': 'application/ld+json', 'Accept': 'application/ld+json'}
      });
      console.log(res)
      return res.data;
    },
    async getRole(url:string) {
      const res = await axiosInstance.get(`${BaseApiUrl}${url}`);
      console.log(res)
      return res.data;
    },
    async getRoles() {
      const res = await axiosInstance.get(`${BaseApiUrlRole}`);
      return res.data;
    },
  }
}
