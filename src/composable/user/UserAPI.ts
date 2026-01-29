import axiosInstance from '@/config/AxiosConfig';
import { BaseApiUrl, BaseApiUrlUser, BaseApiUrlAuth, BaseApiUrlMe } from '@/constants/ApiUrls';

export function useUserApi() {
  return {
    async getUsers() {
      const res = await axiosInstance.get(`${BaseApiUrlUser}`);
      return res.data;
    },
    async getUserById(id: number) {
      const res = await axiosInstance.get(`${BaseApiUrlUser}/${id}`);
      console.log(res)
      return res.data;
    },
    async getUser(url: string) {
      const res = await axiosInstance.get(`${BaseApiUrl}${url}`);
      console.log(res)
      return res.data;
    },
    async getMe() {
      const res = await axiosInstance.get(`${BaseApiUrlMe}`);
      return res.data;
    },
    async loginUser(email: string, password: string) {
      const res = await axiosInstance.post(`${BaseApiUrlAuth}`, { email, password });
      return res.data;
    },
    async createUserAccount(firstname: string, lastName: string, email: string, password: string) {
      const formData = new FormData();
      formData.append('firstname', firstname);
      formData.append('lastname', lastName);
      formData.append('email', email);
      formData.append('password', password);
      const res = await axiosInstance.post(`${BaseApiUrlAuth}/register`,formData);
      return res.data;
    }
  };
}
