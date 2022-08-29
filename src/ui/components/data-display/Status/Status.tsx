import { TextColor } from 'data/@Types/DiariaInterface';
import React, { PropsWithChildren } from 'react';
import { StatusStyled } from './Status.styled';
//import {} from '@mui/material';
//import {} from './Status.styled'

export interface StatusProps {
  colors?: TextColor;
}

const Status: React.FC<PropsWithChildren<StatusProps>> = ({
  colors = 'success',
  ...props
}) => {
  return (
    <StatusStyled sx={{ bgcolor: `${colors}.main` }} {...props}/>
  );
};

export default Status;
