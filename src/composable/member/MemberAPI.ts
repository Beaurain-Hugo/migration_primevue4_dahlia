import axiosInstance from '@/config/AxiosConfig';
import { BaseApiUrl, BaseApiUrlAssociationsUser, ApiUrlAssos } from '@/constants/ApiUrls';
import { Url } from 'url';

export function useMemberApi() {
  return {
    async getMember(url:string){
      const res = await axiosInstance.get(`${BaseApiUrl}${url}`);
      console.log(res);
      return res.data;
    },
    async updateMember(id: number, updatedMember: any) {
      const res = await axiosInstance.put(`${ApiUrlMembres}/update/${id}`, updatedMember);
      return res.data.message;
    },
    async addMember(data: any){
      const res = await axiosInstance.post(`${BaseApiUrlAssociationsUser}`, data, {headers: {'Content-Type': 'application/ld+json', 'Accept': 'application/ld+json'}
      });
      return res.data;
    },
    async deleteMember(id: number){
      const res = await axiosInstance.delete(`${BaseApiUrlAssociationsUser}/${id}`);
      return res.data;
    },
    async deleteMembers(deletedMembers: any){
      console.log(deletedMembers);
      const res = await axiosInstance.post(`${ApiUrlMembres}/delete`, deletedMembers);
      return res.data.message;
    },
  };
}
