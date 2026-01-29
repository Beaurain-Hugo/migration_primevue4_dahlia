import axiosInstance from '@/config/AxiosConfig';
import { ApiUrlAssos, ApiUrlUsers, ApiUrlTresories, BaseApiUrlEvent, BaseApiUrl } from '@/constants/ApiUrls';

export function useEventApi() {
  return {
    async addEvent(data: any) {
      const res = await axiosInstance.post(`${BaseApiUrlEvent}`, data, {headers: {'Content-Type': 'application/ld+json', 'Accept': 'application/ld+json'}});
      console.log(res)
      return res.data.body;
    },
     async getEventsByAssoId(id: number) {
      const res = await axiosInstance.get(`${BaseApiUrlEvent}?association.id=${id}`);
      console.log("ICI", res)
      return res.data;
    },
    async getEventsByTypeByAssoId(id:number, type:string){
      const res = await axiosInstance.get(`${BaseApiUrlEvent}?association.id=${id}&eventType.name=${type}`, {headers: {'Content-Type': 'application/ld+json', 'Accept': 'application/ld+json'}});
      return res.data
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
    async getEventType(id:string, ){
      const res = await axiosInstance.get(`${BaseApiUrl}${id}`);
      return res.data;
    },
  };
}
