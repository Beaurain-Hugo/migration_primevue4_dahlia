import axiosInstance from '@/config/AxiosConfig';
import { ApiUrlAssos, ApiUrlUsers, ApiUrlTresories, ApiUrlEvents } from '@/constants/ApiUrls';

export function useEventApi() {
  return {
    async addEvent(data: any) {
      const res = await axiosInstance.post(`${ApiUrlEvents}/add`, data);
      console.log(res)
      return res.data.body;
    },
     async getEventsByAssoId(id: number) {
      const res = await axiosInstance.get(`${ApiUrlAssos}/${id}/events`);
      console.log("ICI", res)
      return res.data.body;
    },
    async getEventsByTypeByAssoId(id:number, type:string){
      const res = await axiosInstance.get(`${ApiUrlAssos}/${id}/events/${type}`);
      return res.data.body
    },
    async addParticipantsToEvent(id:number, data: any){
      const res = await axiosInstance.post(`${ApiUrlEvents}/${id}/add/participants`, data);
      return res.data.body
    },
    async deleteEvent(id:number){
      const res = await axiosInstance.delete(`${ApiUrlEvents}/delete/${id}`);
      console.log(res)
      return res.data.message
    },
    async editEvent(id:number, data:any){
      const res = await axiosInstance.put(`${ApiUrlEvents}/update/${id}`, data);
      return res.data.message;
    },
  };
}
