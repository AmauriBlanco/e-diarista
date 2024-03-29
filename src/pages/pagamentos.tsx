import { Button, Container, Typography } from '@mui/material';
import { DiariaService } from 'data/services/DiariaService';
import { TextFormatService } from 'data/services/TextFormatService';
import React, { PropsWithChildren } from 'react';
import DataList from 'ui/components/data-display/DataList/DataList';
import PageTitle from 'ui/components/data-display/PageTitle/PageTitle';
import Status from 'ui/components/data-display/Status/Status';
import Table, {
  TableCell,
  TablePagination,
  TableRow,
} from 'ui/components/data-display/Table/Table';
import Link from 'ui/components/navigation/Link/Link';
import { ButtonsContainer } from 'ui/partials/diarias/minhas-diarias.styled';
import usePagamentos from 'data/hooks/pages/usePagamentos.page';
import { GetStaticProps } from 'next';
import { PaymentService } from 'data/services/PaymentService';

//import { Component } from '@styles/pages/pagamentos.styled';

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      title: 'Pagamentos',
    },
  };
};

const MinhasDiarias: React.FC<PropsWithChildren> = () => {
  const {
    isMobile,
    currentPage,
    setCurrentPage,
    totalPage,
    itemsPerPage,
    filteredData,
    filtro,
    alterarFiltro,
  } = usePagamentos();
  return (
    <Container sx={{ mb: 5, p: 0 }}>
      <PageTitle title="Minhas diárias" />

      <ButtonsContainer>
        <Button
          onClick={() => alterarFiltro('pago')}
          variant={filtro === 'pago' ? 'contained' : 'outlined'}
        >
          Pago
        </Button>
        <Button
          onClick={() => alterarFiltro('aguardando')}
          variant={filtro === 'aguardando' ? 'contained' : 'outlined'}
        >
          Aguardar Transferência
        </Button>
      </ButtonsContainer>

      {filteredData.length > 0 ? (
        isMobile ? (
          // Mobile
          <>
            {filteredData.map((diaria) => {
              return (
                <DataList
                  key={diaria.id}
                  header={
                    <>
                      Data:
                      {TextFormatService.reverseDate(
                        diaria.created_at as string
                      )}
                    </>
                  }
                  body={
                    <>
                      Status: {PaymentService.getStatus(diaria.status!).label}
                      <br />
                      Valor diária: {TextFormatService.currency(diaria.valor)}
                      <br />
                      Valor depósito: {TextFormatService.currency(diaria.valor_deposito)}
                    </>
                  }
                />
              );
            })}
          </>
        ) : (
          // Desktop
          <>
            <Table
              header={['Data', 'Status', 'Valor da Diária', 'Valor Depósito']}
              data={filteredData}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              rowElement={(item, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <strong>
                      {TextFormatService.reverseDate(item.created_at)}
                    </strong>
                  </TableCell>
                  <TableCell>
                    <Status
                      colors={PaymentService.getStatus(item.status!).color}
                    >
                      {PaymentService.getStatus(item.status!).label}
                    </Status>
                  </TableCell>

                  <TableCell>
                    {TextFormatService.currency(item.valor)}
                  </TableCell>
                  <TableCell>
                    {TextFormatService.currency(item.valor_deposito)}
                  </TableCell>
                </TableRow>
              )}
            />
            <TablePagination
              count={totalPage}
              page={currentPage}
              onChange={(_evt, nextPage) => setCurrentPage(nextPage)}
            />
          </>
        )
      ) : (
        <Typography align="center">Nenhuma diária ainda</Typography>
      )}
    </Container>
  );
};


export default MinhasDiarias;
