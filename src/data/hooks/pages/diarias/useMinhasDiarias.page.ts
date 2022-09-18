import { DiariaInterface, DiariaStatus } from 'data/@Types/DiariaInterface';
import { DiariaContext } from 'data/contexts/DiariaContext';
import useIsMobile from 'data/hooks/useIsMobile';
import usePagination from 'data/hooks/usePagination.hook';
import { ApiServiceHeteoas, linksResolver } from 'data/services/ApiService';
import { useContext, useMemo, useState } from 'react';
import { mutate } from 'swr';

type FilterType = 'pendente' | 'cancelados' | 'avaliados';

export default function useMinhasDiarias() {
  const isMobile = useIsMobile(),
    {
      diariaState: { diarias },
    } = useContext(DiariaContext),
    [filtro, setFiltro] = useState<FilterType>('pendente'),
    filteredData = useMemo(() => {
      return filtrarDiaria(diarias, filtro);
    }, [diarias, filtro]),
    { currentPage, setCurrentPage, totalPage, itemsPerPage } = usePagination(
      filteredData,
      5
    ),
    [diariaConfirmar, setDiariaConfirmar] = useState<DiariaInterface>(),
    [diariaAvaliar, setDiariaAvaliar] = useState<DiariaInterface>(),
    [diariaCancelar, setDiariaCancelar] = useState<DiariaInterface>();

  function filtrarDiaria(
    diarias: DiariaInterface[],
    filtro: FilterType
  ): DiariaInterface[] {
    return diarias.filter((diaria) => {
      const avaliadas = [DiariaStatus.AVALIADO].includes(diaria.status ?? 0),
        cancelado = [
          DiariaStatus.CANCELADO,
          DiariaStatus.SEM_PAGAMENTO,
        ].includes(diaria.status ?? 0),
        pendente = [
          DiariaStatus.PAGO,
          DiariaStatus.CONFIRMADO,
          DiariaStatus.CONCLUIDO,
        ].includes(diaria.status ?? 0);

      if (
        (avaliadas && filtro === 'avaliados') ||
        (cancelado && filtro === 'cancelados') ||
        (pendente && filtro === 'pendente')
      ) {
        return true;
      }
      return false;
    });
  }

  function alterarFiltro(filtro: FilterType) {
    setCurrentPage(1);
    setFiltro(filtro);
  }

  function podeVisualizar(diaria: DiariaInterface): boolean {
    return linksResolver(diaria.links, 'self') != undefined;
  }

  function podeCancelar(diaria: DiariaInterface): boolean {
    return linksResolver(diaria.links, 'cancelar_diaria') != undefined;
  }

  function podeConfirmar(diaria: DiariaInterface): boolean {
    return linksResolver(diaria.links, 'confirmar_diarista') != undefined;
  }

  function podeAvaliar(diaria: DiariaInterface): boolean {
    return linksResolver(diaria.links, 'avaliar_diaria') != undefined;
  }

  async function confirmarDiaria(diaria: DiariaInterface) {
    ApiServiceHeteoas(diaria.links, 'confirmar_diarista', async (request) => {
      try {
        await request();
        setDiariaConfirmar(undefined);
        atualizarDiarias();
      } catch (error) {}
    });
  }

  async function avaliarDiaria(
    diaria: DiariaInterface,
    avaliacao: { descricao: string; nota: number }
  ) {
    ApiServiceHeteoas(diaria.links, 'avaliar_diaria', async (request) => {
      try {
        await request({
          data: avaliacao,
        });
        setDiariaAvaliar(undefined);
        atualizarDiarias();
      } catch (error) {}
    });
  }

  async function cancelarDiaria(diaria: DiariaInterface, motivo: string) {
    ApiServiceHeteoas(diaria.links, 'cancelar_diaria', async (request) => {
      try {
        await request({
          data: {
            motivo_cancelamento: motivo,
          },
        });
        setDiariaCancelar(undefined);
        atualizarDiarias();
      } catch (error) {}
    });
  }

  function atualizarDiarias() {
    mutate('listar_diarias');
  }

  return {
    isMobile,
    currentPage,
    setCurrentPage,
    totalPage,
    itemsPerPage,
    filteredData,
    podeVisualizar,
    podeCancelar,
    podeConfirmar,
    podeAvaliar,
    diariaConfirmar,
    setDiariaConfirmar,
    confirmarDiaria,
    diariaAvaliar,
    setDiariaAvaliar,
    avaliarDiaria,
    diariaCancelar,
    setDiariaCancelar,
    cancelarDiaria,
    filtro,
    setFiltro,
    alterarFiltro,
  };
}
