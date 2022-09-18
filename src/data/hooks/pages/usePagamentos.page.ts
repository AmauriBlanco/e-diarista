import {
  PagamentosInterface,
  PagamentoStatus,
} from 'data/@Types/PagamentosInterface';
import { UserContext } from 'data/contexts/UserContext';
import useIsMobile from 'data/hooks/useIsMobile';
import usePagination from 'data/hooks/usePagination.hook';
import { useContext, useMemo, useState } from 'react';
import useApiHeteoas from '../useApi.hook';

type FilterType = 'pago' | 'aguardando';

export default function usePagamentos() {
  const isMobile = useIsMobile(),
    {
      userState: { user },
    } = useContext(UserContext),
    pagamentos = useApiHeteoas<PagamentosInterface[]>(
      user.links,
      'lista_pagamentos'
    ).data,
    [filtro, setFiltro] = useState<FilterType>('pago'),
    filteredData = useMemo(() => {
      return filtrarPagamentos(pagamentos ?? [], filtro);
    }, [pagamentos, filtro]),
    { currentPage, setCurrentPage, totalPage, itemsPerPage } = usePagination(
      filteredData,
      5
    );

  function filtrarPagamentos(
    pagamentos: PagamentosInterface[],
    filtro: FilterType
  ): PagamentosInterface[] {
    return pagamentos.filter((pagamento) => {
      if (
        (filtro === 'pago' && pagamento.status === PagamentoStatus.Pago) ||
        (filtro === 'aguardando' && PagamentoStatus.Aguardando_transferencia)
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

  return {
    isMobile,
    currentPage,
    setCurrentPage,
    totalPage,
    itemsPerPage,
    filteredData,
    filtro,
    setFiltro,
    alterarFiltro,
  };
}
