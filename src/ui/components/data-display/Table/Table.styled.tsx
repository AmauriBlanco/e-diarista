import { styled } from '@mui/material/styles';
import {
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Pagination,
  Paper,
} from '@mui/material';

export const TablePaper = styled(Paper)`
  padding: ${({ theme }) => theme.spacing(0, 4)};
`;

export const TableStyled = styled(Table)`
  &.MuiTable-root {
    border-collapse: separate;
    border-spacing: ${({ theme }) => theme.spacing(0, 3)};
  }
`;

export const TableHeadStyled = styled(TableHead)`
  .MuiTableCell-root {
    font-weight: bold;
  }
`;

export const TableBodyStyled = styled(TableBody)`
  .MuiTableRow-root {
    background-color: ${({ theme }) => theme.palette.grey[100]};
  }
`;

export const TableCellStyled = styled(TableCell)`
  &.MuiTableCell-root {
    border: nome;
    padding: ${({ theme }) => theme.spacing(1, 4)};
    color: ${({ theme }) => theme.palette.text.secondary};
  }

`;



export const TableContainerStyled = styled(TableContainer)``;


export const TableRowStyled = styled(TableRow)``;

export const TablePaginationStyled = styled(Pagination)`
  display: flex;
  justify-content: flex-end;
  margin: ${({ theme }) => theme.spacing(4)};
`;
