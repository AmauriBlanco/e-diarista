import React, { PropsWithChildren } from 'react';
//import {} from '@mui/material';
import {
  TableStyled,
  TableContainerStyled,
  TablePaper,
  TableHeadStyled,
  TableBodyStyled,
  TableCellStyled,
  TableRowStyled,
  TablePaginationStyled,
} from './Table.styled';

export interface TableProps<T> {
  header: string[];
  data: T[];
  rowElement: (item: T, index: number) => React.ReactNode;
}

export type TableComponentType = <T>(
  props: TableProps<T>
) => React.ReactElement;

const Table: TableComponentType = ({ header, rowElement, data }) => {
  return (
    <TablePaper>
      <TableContainerStyled>
        <TableStyled>
          {/* Head da Tabela */}
          <TableHeadStyled>
            <TableRowStyled>
              {header.map((title, index) => {
                return <TableCellStyled key={index}>{title}</TableCellStyled>;
              })}
            </TableRowStyled>
          </TableHeadStyled>

          {/* Body da tablea */}
          <TableBodyStyled>
            {data.map((item, index) => {
              return rowElement(item, index);
            })}
          </TableBodyStyled>
        </TableStyled>
      </TableContainerStyled>
    </TablePaper>
  );
};

export default Table;
export const TableRow = TableRowStyled;
export const TableCell = TableCellStyled;
export const TablePagination = TablePaginationStyled;
