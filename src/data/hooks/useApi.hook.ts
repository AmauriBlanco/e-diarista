import { AxiosRequestConfig } from 'axios';
import { ApiLinksInterface } from 'data/@Types/ApiLinksInterface';
import { ApiService, ApiServiceHeteoas } from 'data/services/ApiService';
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

export function useApiHeteoas<OutputType>(
  links: ApiLinksInterface[] = [],
  nome: string | null,
  config?: AxiosRequestConfig
): { data: OutputType | undefined; error: Error } {
  const { data, error } = useSWR<OutputType>(nome, async (nome) => {
    return new Promise<OutputType>((resolve) => {
      ApiServiceHeteoas(links, nome, async (request) => {
        const response = await request<OutputType>(config);
        resolve(response.data);
      });
    });
  });
  return { data, error };
}
