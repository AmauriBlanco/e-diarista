import { Oportunidade } from 'data/@Types/oportunidadesInterface';
import { UserContext } from 'data/contexts/UserContext';
import { linksResolver } from 'data/services/ApiService';
import { useContext } from 'react';
import useApiHeteoas from '../useApi.hook';
import useIsMobile from '../useIsMobile';

export default function useOportunidades() {
  const {
      userState: { user },
    } = useContext(UserContext),
    oportunidades = useApiHeteoas<Oportunidade[]>(
      user.links,
      'lista_oportunidades'
    ).data,
    isMobile = useIsMobile();

  function totalComodos(oportunidade: Oportunidade): number {
    let total = 0;
    total += oportunidade.quantidade_banheiros;
    total += oportunidade.quantidade_cozinhas;
    total += oportunidade.quantidade_outros;
    total += oportunidade.quantidade_quartos;
    total += oportunidade.quantidade_quintais;
    total += oportunidade.quantidade_salas;

    return total;
  }

  function podeCandidatar(oportunidade: Oportunidade):boolean {
    return linksResolver(oportunidade.links, 'candidatar_diarista') != undefined;
  }

  return { oportunidades, isMobile, totalComodos, podeCandidatar };
}