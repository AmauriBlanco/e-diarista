import { AxiosRequestConfig } from 'axios';
import { ApiService } from 'data/services/ApiService';
import useSWR from 'swr';

export default function useApi<OutputType>(
  endPoint: string | null,
  config?: AxiosRequestConfig
): { data: OutputType | undefined; error: Error } {
  const { data, error } = useSWR(endPoint, async (url) => {
    const reponse = await ApiService(url, config);

    return reponse.data;
  });
  return { data, error };
}
