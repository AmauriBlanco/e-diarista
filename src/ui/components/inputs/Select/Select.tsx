import React, { PropsWithChildren, useEffect } from 'react';
import {
  SelectProps as MuiSelectProps,
  FormControl,
  InputLabel,
} from '@mui/material';
import { SelectStyled } from './Select.styled';
import { v4 as uuid } from 'uuid';
import { useState } from '@storybook/addons';

export interface SelectProps extends MuiSelectProps {
  label?: string;
}

const Select: React.FC<PropsWithChildren<SelectProps>> = ({
  label,
  children,
  style,
  ...props
}) => {
  const [elementId, setElementId] = useState('');
  useEffect(() => {
    if (window !== undefined) {
      setElementId(uuid());
    }
  }, []);
  return (
    <FormControl variant="outlined" style={style}>
      <InputLabel id={elementId}>{label}</InputLabel>
      <SelectStyled labelId={elementId} label={label} {...props}>
        {children}
      </SelectStyled>
    </FormControl>
  );
};

export default Select;
