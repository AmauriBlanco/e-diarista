import { Oportunidade } from 'data/@Types/oportunidadesInterface';
import { UserContext } from 'data/contexts/UserContext';
import { ApiServiceHeteoas, linksResolver } from 'data/services/ApiService';
import { useContext, useState } from 'react';
import useApiHeteoas from '../useApi.hook';
import useIsMobile from '../useIsMobile';
import usePagination from '../usePagination.hook';
import { mutate } from 'swr';

export default function useOportunidades() {
  const {
      userState: { user },
    } = useContext(UserContext),
    oportunidades = useApiHeteoas<Oportunidade[]>(
      user.links,
      'lista_oportunidades'
    ).data,
    isMobile = useIsMobile(),
    { currentPage, setCurrentPage, totalPage, itemsPerPage } = usePagination(
      oportunidades ?? [],
      5
    ),
    [oportunidadeSelecionada, setOportunidadeSelecionada] =
      useState<Oportunidade>(),
    [mensagemSnackbar, setMensagemSnackbar] = useState('');

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

  function podeCandidatar(oportunidade: Oportunidade): boolean {
    return (
      linksResolver(oportunidade.links, 'candidatar_diarista') != undefined
    );
  }

  function seCandidatar(oportunidade: Oportunidade) {
    ApiServiceHeteoas(
      oportunidade.links,
      'candidatar_diarista',
      async (request) => {
        try {
          await request();
          setMensagemSnackbar('Candidatura enviada!');
          setOportunidadeSelecionada(undefined);
          atualizarOportunidades();
        } catch (error) {}
      }
    );
  }

  function atualizarOportunidades() {
    mutate('lista_oportunidades');
  }

  return {
    oportunidades,
    isMobile,
    totalComodos,
    podeCandidatar,
    currentPage,
    setCurrentPage,
    totalPage,
    itemsPerPage,
    oportunidadeSelecionada,
    setOportunidadeSelecionada,
    mensagemSnackbar,
    setMensagemSnackbar,
    seCandidatar,
  };
}
