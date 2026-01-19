import axiosInstance from '@/config/AxiosConfig';
import { ApiUrlAssos, ApiUrlUsers, ApiUrlTresories, ApiUrlEvents } from '@/constants/ApiUrls';

export function useEventApi() {
  return {
    async addEvent(data: any) {
      const res = await axiosInstance.post(`${ApiUrlEvents}/add`, data);
      return res.data.body;
    },
     async getEventsByAssoId(id: number) {
      const res = await axiosInstance.get(`${ApiUrlAssos}/${id}/events`);
      return res.data.body;
    }, 
  };
}
