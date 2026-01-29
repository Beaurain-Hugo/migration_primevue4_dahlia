import axiosInstance from '@/config/AxiosConfig';
import { BaseApiUrlTask,BaseApiUrl } from '@/constants/ApiUrls';

export function useTaskApi() {
  return {
    async addTask(data: any) {
      const res = await axiosInstance.post(`${BaseApiUrlTask}`, data, {headers: {'Content-Type': 'application/ld+json', 'Accept': 'application/ld+json'}
      });
      return res.data;
    },
    async getTasksByAssoId(AssoId: number) {
      const res = await axiosInstance.get(`${BaseApiUrlTask}?association.id)${AssoId}`);
      console.log(res)
      return res.data;
    },
    async getTask(url: string) {
      const res = await axiosInstance.get(`${BaseApiUrl}${url}`);
      console.log(res)
      return res.data;
    },
     async patchTask(id:number, data: number) {
      const res = await axiosInstance.patch(`${BaseApiUrlTask}/${id}`, data, {headers: {'Content-Type': 'application/merge-patch+json'}
      });
      console.log(res)
      return res.data;
    },
    async deleteTask(id:number){
        const res = await axiosInstance.delete(`${BaseApiUrlTask}/${id}`, {headers: {'Content-Type': 'application/ld+json', 'Accept': 'application/ld+json'}
      });
        console.log(res);
        return res
    }
  };
}
